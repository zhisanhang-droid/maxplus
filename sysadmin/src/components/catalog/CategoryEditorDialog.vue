<script setup lang="ts">
import { reactive, watch } from "vue";
import type { CategoryRecord } from "../../types/admin";

const props = defineProps<{
  modelValue: boolean;
  category: CategoryRecord | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: CategoryRecord];
}>();

const createDraft = (): CategoryRecord => ({
  id: "",
  name: "",
  slug: "",
  parent: "顶级分类",
  sortOrder: 1,
  enabled: true,
  seoTitle: ""
});

const draft = reactive<CategoryRecord>(createDraft());

watch(
  () => props.category,
  (value) => {
    Object.assign(draft, value ?? createDraft());
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    id: draft.id || `cat-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="640px"
    :title="category ? '编辑分类' : '新增分类'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="分类名称">
          <el-input v-model="draft.name" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="上级分类">
          <el-input v-model="draft.parent" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="draft.sortOrder" :min="1" :controls="false" />
        </el-form-item>
      </div>

      <el-form-item label="SEO 标题">
        <el-input v-model="draft.seoTitle" />
      </el-form-item>

      <el-form-item label="是否启用">
        <el-switch v-model="draft.enabled" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存分类</el-button>
    </template>
  </el-dialog>
</template>
