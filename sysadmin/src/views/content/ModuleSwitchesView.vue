<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("模块开关已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "模块开关保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">模块控制</p>
          <h2>首页模块开关</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <div class="module-toggle-grid">
        <article
          v-for="item in settingsStore.homeContent.sectionToggles"
          :key="item.key"
          class="editor-block module-toggle-card"
        >
          <div class="module-toggle-card__top">
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.enabled ? "当前显示中" : "当前已隐藏" }}</p>
            </div>
            <el-switch v-model="item.enabled" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
