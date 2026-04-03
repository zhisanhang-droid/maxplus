<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useSettingsStore } from "../../stores/settings";

const settingsStore = useSettingsStore();

const save = async () => {
  try {
    await settingsStore.saveSeoSettings();
    ElMessage.success("SEO 设置已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "SEO 设置保存失败。");
  }
};
</script>

<template>
  <div class="page-grid page-grid--2">
    <section class="page-card">
      <div class="page-card__header">
        <div>
          <p class="page-card__eyebrow">SEO 配置</p>
          <h2>全局 Meta 信息</h2>
        </div>
        <el-button type="primary" @click="save">保存设置</el-button>
      </div>

      <el-form label-position="top" class="editor-form">
        <el-form-item label="全局标题">
          <el-input v-model="settingsStore.seoSettings.globalTitle" />
        </el-form-item>
        <el-form-item label="全局描述">
          <el-input v-model="settingsStore.seoSettings.globalDescription" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="OG 图片">
          <el-input v-model="settingsStore.seoSettings.ogImage" />
        </el-form-item>
      </el-form>
    </section>

      <section class="page-card">
        <div class="page-card__header">
          <div>
            <p class="page-card__eyebrow">模板规则</p>
            <h2>各路由的 SEO 输出模板</h2>
          </div>
        </div>

        <el-form label-position="top" class="editor-form">
          <el-form-item label="商品标题模板">
            <el-input v-model="settingsStore.seoSettings.productTemplate" />
          </el-form-item>
          <el-form-item label="分类标题模板">
            <el-input v-model="settingsStore.seoSettings.categoryTemplate" />
          </el-form-item>
          <el-form-item label="博客标题模板">
            <el-input v-model="settingsStore.seoSettings.blogTemplate" />
          </el-form-item>
          <div class="inline-row">
            <el-switch v-model="settingsStore.seoSettings.sitemapEnabled" />
            <span>启用 Sitemap</span>
          </div>
          <div class="inline-row">
            <el-switch v-model="settingsStore.seoSettings.robotsIndex" />
            <span>允许被索引</span>
          </div>
        </el-form>
      </section>
  </div>
</template>
