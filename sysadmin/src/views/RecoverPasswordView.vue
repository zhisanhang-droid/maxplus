<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { resetAdminPassword } from "../services/recovery";
import type { AdminPasswordRecoveryPayload } from "../types/admin";

const router = useRouter();
const loading = ref(false);

const form = reactive<AdminPasswordRecoveryPayload>({
  username: "admin",
  recoveryKey: "",
  password: "",
  confirmPassword: ""
});

async function submit() {
  loading.value = true;

  try {
    await resetAdminPassword(form);
    ElMessage.success("密码已重置，请使用新密码登录。");
    await router.push("/login");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "密码重置失败。");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-screen">
    <div class="login-card">
      <div class="login-card__copy">
        <p class="login-card__eyebrow">Password Recovery</p>
        <h1>重置后台登录密码</h1>
        <p>当管理员忘记密码时，可使用服务器上的恢复密钥直接重置账号密码，无需重新安装系统。</p>

        <div class="login-card__highlights">
          <article class="login-highlight">
            <strong>恢复密钥位置</strong>
            <span>`node/.env` 中优先使用 `ADMIN_RECOVERY_KEY`。旧安装如果还没有这个字段，可临时使用 `JWT_SECRET`。</span>
          </article>
          <article class="login-highlight">
            <strong>适用范围</strong>
            <span>只重置指定管理员账号的登录密码，不会影响站点内容、数据库连接或前台数据。</span>
          </article>
          <article class="login-highlight">
            <strong>恢复后建议</strong>
            <span>登录成功后尽快把恢复密钥单独保存在服务器环境变量中，不要继续长期复用 JWT 密钥。</span>
          </article>
        </div>
      </div>

      <el-form class="login-form" label-position="top" @submit.prevent="submit">
        <el-form-item label="管理员账号">
          <el-input v-model="form.username" placeholder="请输入管理员账号" />
        </el-form-item>

        <el-form-item label="恢复密钥">
          <el-input
            v-model="form.recoveryKey"
            show-password
            placeholder="请输入服务器中的恢复密钥"
          />
        </el-form-item>

        <el-form-item label="新密码">
          <el-input v-model="form.password" show-password placeholder="至少 8 位" />
        </el-form-item>

        <el-form-item label="确认新密码">
          <el-input v-model="form.confirmPassword" show-password placeholder="再次输入新密码" />
        </el-form-item>

        <el-button type="primary" class="login-form__button" :loading="loading" @click="submit">
          重置密码
        </el-button>

        <RouterLink class="login-form__text-link" to="/login">返回登录</RouterLink>
      </el-form>
    </div>
  </div>
</template>
