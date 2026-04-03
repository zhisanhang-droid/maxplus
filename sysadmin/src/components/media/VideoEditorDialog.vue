<script setup lang="ts">
import { reactive, watch } from "vue";
import type { CategoryRecord, VideoRecord } from "../../types/admin";

const props = defineProps<{
  modelValue: boolean;
  video: VideoRecord | null;
  categories: CategoryRecord[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: VideoRecord];
}>();

const createDraft = (): VideoRecord => ({
  id: "",
  title: "",
  slug: "",
  categoryId: props.categories[0]?.id ?? "",
  topic: "",
  duration: "",
  status: "draft",
  cover: "",
  videoUrl: "",
  summary: ""
});

const draft = reactive<VideoRecord>(createDraft());

watch(
  () => props.video,
  (value) => {
    Object.assign(draft, value ?? createDraft());
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    id: draft.id || `vid-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="680px"
    :title="video ? '编辑视频' : '新增视频'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="视频标题">
          <el-input v-model="draft.title" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="所属分类">
          <el-select v-model="draft.categoryId">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主题标签">
          <el-input v-model="draft.topic" />
        </el-form-item>
        <el-form-item label="时长">
          <el-input v-model="draft.duration" placeholder="例如 03:42" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="状态">
          <el-select v-model="draft.status">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面地址">
          <el-input v-model="draft.cover" />
        </el-form-item>
      </div>

      <el-form-item label="视频地址">
        <el-input v-model="draft.videoUrl" />
      </el-form-item>

      <el-form-item label="视频摘要">
        <el-input v-model="draft.summary" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存视频</el-button>
    </template>
  </el-dialog>
</template>
