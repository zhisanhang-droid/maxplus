<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useSessionStore } from "../../stores/session";
import ImageUploader from "../shared/ImageUploader.vue";
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

const sessionStore = useSessionStore();
const token = computed(() => sessionStore.token);

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
  summary: "",
  description: "",
  tagLabel: "",
  orderMinimum: "",
  leadTime: "",
  sportType: "",
  audience: "",
  useCase: "",
  visualClass: "",
  buyButtonLabel: "Go To Buy",
  buyButtonUrl: "/buy"
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
    Object.assign(draft, createDraft(), value ?? {});
  },
  { immediate: true }
);

function addGallerySlot() {
  draft.gallery = [...draft.gallery, ""];
}

function updateGalleryItem(index: number, url: string) {
  const updated = [...draft.gallery];
  updated[index] = url;
  draft.gallery = updated;
}

function removeGalleryItem(index: number) {
  draft.gallery = draft.gallery.filter((_, i) => i !== index);
}

const close = () => emit("update:modelValue", false);

const submitWithStatus = (status: ProductRecord["status"]) => {
  draft.status = status;
  emit("save", {
    ...draft,
    gallery: draft.gallery.filter(Boolean),
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

      <el-form-item label="重量">
        <el-input v-model="draft.weight" />
      </el-form-item>

      <el-form-item label="标签">
        <el-input v-model="tagsText" placeholder="多个标签请用英文逗号分隔" />
      </el-form-item>

      <div class="editor-block">
        <p class="page-card__eyebrow">前台商品卡片</p>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="卡片标签">
            <el-input v-model="draft.tagLabel" placeholder="如：Best Seller" />
          </el-form-item>
          <el-form-item label="视觉类名">
            <el-input
              v-model="draft.visualClass"
              placeholder="如：product-card__visual--net"
            />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--3">
          <el-form-item label="运动类型">
            <el-input v-model="draft.sportType" placeholder="如：Volleyball" />
          </el-form-item>
          <el-form-item label="受众">
            <el-input v-model="draft.audience" placeholder="如：Club / Family" />
          </el-form-item>
          <el-form-item label="用途">
            <el-input v-model="draft.useCase" placeholder="如：Outdoor Setup" />
          </el-form-item>
        </div>

        <div class="editor-grid editor-grid--2">
          <el-form-item label="起订量">
            <el-input v-model="draft.orderMinimum" placeholder="如：24 sets" />
          </el-form-item>
          <el-form-item label="交期">
            <el-input v-model="draft.leadTime" placeholder="如：10-15 business days" />
          </el-form-item>
        </div>
      </div>

      <el-form-item label="主图">
        <ImageUploader v-model="draft.heroImage" :token="token" />
      </el-form-item>

      <el-form-item label="详情图集">
        <div class="gallery-grid">
          <div
            v-for="(url, index) in draft.gallery"
            :key="index"
            class="gallery-grid__item"
          >
            <ImageUploader
              :model-value="url"
              :token="token"
              @update:model-value="updateGalleryItem(index, $event)"
            />
            <el-button
              size="small"
              type="danger"
              plain
              class="gallery-grid__del"
              @click="removeGalleryItem(index)"
            >
              移除
            </el-button>
          </div>
          <el-button class="gallery-grid__add" @click="addGallerySlot">
            + 添加图片
          </el-button>
        </div>
      </el-form-item>

      <div class="editor-grid editor-grid--2">
        <el-form-item label="购买按钮文案">
          <el-input v-model="draft.buyButtonLabel" placeholder="如：Go To Buy" />
        </el-form-item>
        <el-form-item label="购买按钮链接">
          <el-input v-model="draft.buyButtonUrl" placeholder="如：/buy 或 https://example.com" />
        </el-form-item>
      </div>

      <el-form-item label="商品摘要">
        <el-input v-model="draft.summary" type="textarea" :rows="4" />
      </el-form-item>

      <el-form-item label="详情描述">
        <el-input v-model="draft.description" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button v-if="product" @click="submitWithStatus('archived')">归档商品</el-button>
      <el-button @click="submitWithStatus('draft')">
        {{ product ? "保存草稿" : "创建草稿" }}
      </el-button>
      <el-button type="primary" @click="submitWithStatus('published')">
        {{ product ? "发布更新" : "发布商品" }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}
.gallery-grid__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gallery-grid__del {
  width: 100%;
}
.gallery-grid__add {
  width: 160px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  color: #909399;
}
</style>
