<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const save = async () => {
  try {
    await settingsStore.saveHomeContent();
    ElMessage.success("首页内容已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "首页内容保存失败。");
  }
};
</script>

<template>
  <div class="page-stack">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">首页配置</p>
          <h2>首屏轮播和推荐模块</h2>
        </div>
        <el-button type="primary" @click="save">保存内容</el-button>
      </div>

      <div class="stack-grid">
        <div v-for="item in settingsStore.homeContent.heroSlides" :key="item.id" class="editor-block">
          <div class="editor-grid editor-grid--2">
            <el-input v-model="item.title" placeholder="轮播标题" />
            <el-input v-model="item.targetUrl" placeholder="跳转链接" />
          </div>
          <el-input v-model="item.subtitle" placeholder="轮播副标题" />
          <div class="inline-row">
            <el-switch v-model="item.enabled" />
            <span>启用该轮播</span>
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">亮点卡片</p>
          <h2>首页亮点文案</h2>
        </div>
      </div>

      <div class="stack-grid">
        <el-input
          v-for="(item, index) in settingsStore.homeContent.highlights"
          :key="`${item}-${index}`"
          v-model="settingsStore.homeContent.highlights[index]"
        />
      </div>
    </section>
  </div>
</template>
