<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { CategoryRecord, ProductRecord } from "../../types/admin";

const props = defineProps<{
  modelValue: boolean;
  product: ProductRecord | null;
  categories: CategoryRecord[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: ProductRecord];
}>();

const createDraft = (): ProductRecord => ({
  id: "",
  title: "",
  slug: "",
  sku: "",
  categoryId: props.categories[0]?.id ?? "",
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  weight: "",
  status: "draft",
  tags: [],
  heroImage: "",
  gallery: [],
  summary: ""
});

const draft = reactive<ProductRecord>(createDraft());
const tagsText = computed({
  get: () => draft.tags.join(", "),
  set: (value: string) => {
    draft.tags = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
});

watch(
  () => props.product,
  (value) => {
    Object.assign(draft, value ?? createDraft());
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    id: draft.id || `prd-${Date.now()}`
  });
  close();
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="720px"
    :title="product ? '编辑商品' : '新增商品'"
    @close="close"
  >
    <el-form label-position="top" class="editor-form">
      <div class="editor-grid editor-grid--2">
        <el-form-item label="商品名称">
          <el-input v-model="draft.title" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="draft.slug" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="SKU">
          <el-input v-model="draft.sku" />
        </el-form-item>
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
      </div>

      <div class="editor-grid editor-grid--3">
        <el-form-item label="售价">
          <el-input-number v-model="draft.price" :min="0" :controls="false" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="draft.compareAtPrice" :min="0" :controls="false" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="draft.stock" :min="0" :controls="false" />
        </el-form-item>
      </div>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="重量">
          <el-input v-model="draft.weight" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="draft.status">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="标签">
        <el-input v-model="tagsText" placeholder="多个标签请用英文逗号分隔" />
      </el-form-item>

      <el-form-item label="主图地址">
        <el-input v-model="draft.heroImage" />
      </el-form-item>

      <el-form-item label="商品摘要">
        <el-input v-model="draft.summary" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存商品</el-button>
    </template>
  </el-dialog>
</template>
