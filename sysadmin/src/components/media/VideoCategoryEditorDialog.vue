<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { VideoCategoryRecord } from "../../types/admin";

interface CategoryTreeNode extends VideoCategoryRecord {
  children: CategoryTreeNode[];
}

interface ParentCategoryOption {
  value: string;
  label: string;
}

const ROOT_PARENT_LABEL = "顶级分类";

const props = defineProps<{
  modelValue: boolean;
  category: VideoCategoryRecord | null;
  categories: VideoCategoryRecord[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [value: VideoCategoryRecord];
}>();

const createDraft = (): VideoCategoryRecord => ({
  id: "",
  name: "",
  slug: "",
  parent: ROOT_PARENT_LABEL,
  sortOrder: 1,
  enabled: true,
  seoTitle: ""
});

const draft = reactive<VideoCategoryRecord>(createDraft());

const categoryTree = computed<CategoryTreeNode[]>(() => {
  const nodeMap = new Map<string, CategoryTreeNode>();

  for (const item of props.categories) {
    nodeMap.set(item.id, {
      ...item,
      children: []
    });
  }

  const roots: CategoryTreeNode[] = [];

  for (const node of nodeMap.values()) {
    if (!node.parent || node.parent === ROOT_PARENT_LABEL) {
      roots.push(node);
      continue;
    }

    const parent = Array.from(nodeMap.values()).find((item) => item.name === node.parent);

    if (parent) {
      parent.children.push(node);
      continue;
    }

    roots.push(node);
  }

  const sortTree = (items: CategoryTreeNode[]): CategoryTreeNode[] =>
    items
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item) => ({
        ...item,
        children: sortTree(item.children)
      }));

  return sortTree(roots);
});

const blockedParentIds = computed(() => {
  if (!draft.id) {
    return new Set<string>();
  }

  const blocked = new Set<string>([draft.id]);
  const queue = [draft.id];

  while (queue.length) {
    const currentId = queue.shift();

    if (!currentId) {
      continue;
    }

    const currentCategory = props.categories.find((item) => item.id === currentId);
    const children = props.categories.filter((item) => item.parent === currentCategory?.name);

    for (const child of children) {
      if (blocked.has(child.id)) {
        continue;
      }

      blocked.add(child.id);
      queue.push(child.id);
    }
  }

  return blocked;
});

const parentOptions = computed<ParentCategoryOption[]>(() => {
  const options: ParentCategoryOption[] = [{ value: ROOT_PARENT_LABEL, label: ROOT_PARENT_LABEL }];

  const appendNodes = (nodes: CategoryTreeNode[], level = 0) => {
    for (const node of nodes) {
      if (!blockedParentIds.value.has(node.id)) {
        options.push({
          value: node.name,
          label: `${level > 0 ? `${"> ".repeat(level)}` : ""}${node.name}`
        });
      }

      appendNodes(node.children, level + 1);
    }
  };

  appendNodes(categoryTree.value);

  if (
    draft.parent &&
    draft.parent !== ROOT_PARENT_LABEL &&
    !options.some((item) => item.value === draft.parent)
  ) {
    options.push({
      value: draft.parent,
      label: draft.parent
    });
  }

  return options;
});

watch(
  () => props.category,
  (value) => {
    Object.assign(draft, createDraft(), value ?? {});
  },
  { immediate: true }
);

watch(
  () => props.categories,
  (categories) => {
    if (!draft.parent || draft.parent === ROOT_PARENT_LABEL) {
      draft.parent = ROOT_PARENT_LABEL;
      return;
    }

    const parentExists = categories.some((item) => item.name === draft.parent);

    if (!parentExists) {
      draft.parent = ROOT_PARENT_LABEL;
    }
  },
  { immediate: true }
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("save", {
    ...draft,
    parent: draft.parent || ROOT_PARENT_LABEL,
    id: draft.id || `vcat-${Date.now()}`
  });
};
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    width="640px"
    :title="category ? '编辑视频分类' : '新增视频分类'"
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
          <el-select v-model="draft.parent" placeholder="请选择上级分类">
            <el-option
              v-for="option in parentOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
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
