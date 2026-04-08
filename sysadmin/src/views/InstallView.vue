<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useInstallStore } from "../stores/install";
import type { InstallSetupPayload } from "../types/install";

const router = useRouter();
const installStore = useInstallStore();

const testing = ref(false);
const submitting = ref(false);

const form = reactive<InstallSetupPayload>({
  database: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "maxplus_cms"
  },
  admin: {
    username: "admin",
    password: "",
    confirmPassword: ""
  }
});

const pageTitle = computed(() =>
  installStore.status?.installed ? "修复部署配置" : "安装配置向导"
);

const pageDescription = computed(() =>
  installStore.status?.ready
    ? "系统当前已完成安装。你仍然可以重新进入这里，测试数据库连接，或重新保存部署配置与超级管理员账号。"
    : installStore.status?.mode === "error"
      ? "当前后端配置存在问题。重新填写数据库连接和超级管理员账号后，可重新完成初始化。"
      : "首次上线时，在这里配置数据库连接和后台管理系统超级管理员账号。安装完成后将自动初始化数据表。"
);

const submitLabel = computed(() =>
  installStore.status?.ready ? "保存并重新应用配置" : "完成安装"
);

const successMessage = computed(() =>
  installStore.status?.ready ? "配置已重新应用，正在跳转登录页。" : "安装完成，正在跳转登录页。"
);

const actionHint = computed(() =>
  installStore.status?.mode === "error"
    ? "可用于修复数据库连接、重置超级管理员账号，或重新生成安装配置。"
    : installStore.status?.ready
      ? "重新提交后会覆盖当前服务端安装配置，并确保所填管理员账号拥有超级管理员权限。"
      : "安装完成后会自动创建数据库表、默认内容以及超级管理员账号。"
);

const passwordHint = computed(() =>
  installStore.status?.database.passwordConfigured
    ? "留空则沿用当前已保存的数据库密码。"
    : "请输入可连接 MySQL 的数据库密码。"
);

function hydrateFormFromStatus() {
  const database = installStore.status?.database;

  if (!database) {
    return;
  }

  form.database.host = database.host || form.database.host;
  form.database.port = database.port || form.database.port;
  form.database.user = database.user || form.database.user;
  form.database.database = database.database || form.database.database;
  form.database.password = "";
}

async function refreshStatus() {
  try {
    await installStore.ensureStatus(true);
    hydrateFormFromStatus();
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "无法获取安装状态。");
  }
}

async function testDatabase() {
  testing.value = true;

  try {
    const result = await installStore.testDatabase(form.database);
    ElMessage.success(result.message || "数据库连接成功。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "数据库连接测试失败。");
  } finally {
    testing.value = false;
  }
}

async function submit() {
  submitting.value = true;

  try {
    const result = await installStore.submit(form);
    ElMessage.success(successMessage.value);
    await router.replace(result.loginPath || "/login");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "安装失败。");
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void refreshStatus();
});
</script>

<template>
  <div class="login-screen install-screen">
    <div class="login-card install-card">
      <div class="login-card__copy install-card__copy">
        <p class="login-card__eyebrow">Deployment Setup</p>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
        <p class="install-card__note">{{ actionHint }}</p>

        <el-alert
          v-if="installStore.status"
          class="install-card__alert"
          :title="installStore.status.message"
          :type="installStore.status.mode === 'error' ? 'error' : 'info'"
          :closable="false"
          show-icon
        >
          <template #default>
            <span v-if="installStore.status.details?.reason">
              {{ installStore.status.details.reason }}
            </span>
          </template>
        </el-alert>

        <div class="login-card__highlights">
          <article class="login-highlight">
            <strong>数据库初始化</strong>
            <span>自动创建数据库、数据表，以及当前后台所需的默认内容和配置项。</span>
          </article>
          <article class="login-highlight">
            <strong>超级管理员</strong>
            <span>安装时创建首个超级管理员账号，后续用它登录后台并继续管理系统。</span>
          </article>
          <article class="login-highlight">
            <strong>环境落盘</strong>
            <span>安装完成后会把数据库与安全配置写入服务端 `.env`，供生产环境直接使用。</span>
          </article>
        </div>
      </div>

      <el-form class="login-form install-form" label-position="top" @submit.prevent="submit">
        <section class="install-form__group">
          <div class="install-form__group-head">
            <strong>数据库连接</strong>
            <span>请填写可访问的 MySQL 信息</span>
          </div>

          <div class="install-form__grid install-form__grid--database">
            <el-form-item label="主机">
              <el-input v-model="form.database.host" placeholder="127.0.0.1" />
            </el-form-item>

            <el-form-item label="端口">
              <el-input v-model.number="form.database.port" type="number" placeholder="3306" />
            </el-form-item>

            <el-form-item label="用户名">
              <el-input v-model="form.database.user" placeholder="root" />
            </el-form-item>

            <el-form-item label="数据库名">
              <el-input v-model="form.database.database" placeholder="maxplus_cms" />
            </el-form-item>
          </div>

          <el-form-item label="数据库密码">
            <el-input
              v-model="form.database.password"
              show-password
              placeholder="请输入数据库密码"
            />
          </el-form-item>
          <p class="install-form__hint">{{ passwordHint }}</p>
        </section>

        <section class="install-form__group">
          <div class="install-form__group-head">
            <strong>超级管理员账号</strong>
            <span>安装完成后使用这个账号登录后台</span>
          </div>

          <el-form-item label="管理员账号">
            <el-input v-model="form.admin.username" placeholder="admin" />
          </el-form-item>

          <div class="install-form__grid">
            <el-form-item label="管理员密码">
              <el-input
                v-model="form.admin.password"
                show-password
                placeholder="至少 8 位"
              />
            </el-form-item>

            <el-form-item label="确认密码">
              <el-input
                v-model="form.admin.confirmPassword"
                show-password
                placeholder="再次输入管理员密码"
              />
            </el-form-item>
          </div>
        </section>

        <div class="install-form__actions">
          <el-button :loading="testing" @click="testDatabase">测试数据库连接</el-button>
          <el-button type="primary" :loading="submitting" @click="submit">{{ submitLabel }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.install-card {
  grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
}

.install-card__copy {
  gap: 1rem;
}

.install-card__alert {
  margin-top: 0.2rem;
}

.install-card__note {
  margin: -0.3rem 0 0;
  color: var(--admin-text-soft);
  font-size: 0.9rem;
  line-height: 1.6;
}

.install-form {
  display: grid;
  gap: 1rem;
}

.install-form__group {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(16, 33, 58, 0.08);
  background: rgba(255, 255, 255, 0.84);
}

.install-form__group-head {
  display: grid;
  gap: 0.28rem;
  margin-bottom: 0.9rem;
}

.install-form__group-head strong {
  color: var(--admin-navy);
  font-size: 1rem;
}

.install-form__group-head span,
.install-form__hint {
  color: var(--admin-text-soft);
  font-size: 0.84rem;
  line-height: 1.55;
}

.install-form__hint {
  margin: -0.45rem 0 0;
}

.install-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.install-form__grid--database {
  margin-bottom: 0.2rem;
}

.install-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

@media (max-width: 980px) {
  .install-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .install-form__grid,
  .install-form__actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
