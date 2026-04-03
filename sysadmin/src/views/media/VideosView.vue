<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import VideoEditorDialog from "../../components/media/VideoEditorDialog.vue";
import { useCatalogStore } from "../../stores/catalog";
import type { VideoRecord } from "../../types/admin";

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<VideoRecord | null>(null);
const categoryFilter = ref("all");

const visibleVideos = computed(() =>
  catalogStore.videos.filter((item) =>
    categoryFilter.value === "all" ? true : item.categoryId === categoryFilter.value
  )
);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: VideoRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveVideo = async (record: VideoRecord) => {
  try {
    await catalogStore.saveVideo(record);
    ElMessage.success("视频已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频保存失败。");
  }
};

const removeVideo = async (record: VideoRecord) => {
  await ElMessageBox.confirm(`确认删除视频“${record.title}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeVideo(record.id);
    ElMessage.success("视频已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频删除失败。");
  }
};

const getCategoryLabel = (id: string) =>
  catalogStore.categories.find((item) => item.id === id)?.name ?? "未知分类";
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">媒体中心</p>
        <h2>视频管理</h2>
      </div>

      <div class="header-actions">
        <el-select v-model="categoryFilter" class="toolbar-input">
          <el-option label="全部分类" value="all" />
          <el-option
            v-for="item in catalogStore.categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="openCreate">新增视频</el-button>
      </div>
    </div>

    <el-table :data="visibleVideos" stripe>
      <el-table-column prop="title" label="视频标题" min-width="260" />
      <el-table-column label="所属分类" width="160">
        <template #default="{ row }">{{ getCategoryLabel(row.categoryId) }}</template>
      </el-table-column>
      <el-table-column prop="topic" label="主题" width="120" />
      <el-table-column prop="duration" label="时长" width="100" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
            {{ row.status === "published" ? "已发布" : "草稿" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removeVideo(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <VideoEditorDialog
      v-model="dialogVisible"
      :video="currentRecord"
      :categories="catalogStore.categories"
      @save="saveVideo"
    />
  </div>
</template>
