<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import VideoCategoryEditorDialog from "../../components/media/VideoCategoryEditorDialog.vue";
import TablePagination from "../../components/shared/TablePagination.vue";
import { useTablePagination } from "../../composables/useTablePagination";
import { useCatalogStore } from "../../stores/catalog";
import type { VideoCategoryRecord } from "../../types/admin";

interface VideoCategoryTreeRow extends VideoCategoryRecord {
  videoCount: number;
  children?: VideoCategoryTreeRow[];
}

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<VideoCategoryRecord | null>(null);
const ROOT_PARENT_LABEL = "顶级分类";

const categoryTree = computed<VideoCategoryTreeRow[]>(() => {
  const rowMap = new Map<string, VideoCategoryTreeRow>();

  for (const item of catalogStore.videoCategories) {
    rowMap.set(item.id, {
      ...item,
      videoCount: catalogStore.videos.filter((video) => video.categoryId === item.id).length,
      children: []
    });
  }

  const roots: VideoCategoryTreeRow[] = [];
  const resolveParent = (row: VideoCategoryTreeRow) =>
    Array.from(rowMap.values())
      .filter((item) => item.id !== row.id && item.name === row.parent)
      .sort((left, right) => {
        const leftScore = left.parent === ROOT_PARENT_LABEL ? 0 : 1;
        const rightScore = right.parent === ROOT_PARENT_LABEL ? 0 : 1;

        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }

        return left.sortOrder - right.sortOrder;
      })[0];

  for (const row of rowMap.values()) {
    if (!row.parent || row.parent === ROOT_PARENT_LABEL) {
      roots.push(row);
      continue;
    }

    const parent = resolveParent(row);

    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(row);
      continue;
    }

    roots.push(row);
  }

  const sortRows = (items: VideoCategoryTreeRow[]): VideoCategoryTreeRow[] =>
    items
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item): VideoCategoryTreeRow => {
        const children: VideoCategoryTreeRow[] | undefined = item.children?.length
          ? sortRows(item.children)
          : undefined;
        const childVideoCount =
          children?.reduce((total: number, child: VideoCategoryTreeRow) => total + child.videoCount, 0) || 0;

        return {
          ...item,
          videoCount: item.videoCount + childVideoCount,
          children
        };
      });

  return sortRows(roots);
});
const { currentPage, pageSize, pageSizes, total, pagedItems, resetPagination } = useTablePagination(categoryTree);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: VideoCategoryRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveCategory = async (record: VideoCategoryRecord) => {
  try {
    await catalogStore.saveVideoCategory(record);
    resetPagination();
    dialogVisible.value = false;
    currentRecord.value = null;
    ElMessage.success("视频分类已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频分类保存失败。");
  }
};

const removeCategory = async (record: VideoCategoryRecord) => {
  await ElMessageBox.confirm(`确认删除视频分类“${record.name}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeVideoCategory(record.id);
    ElMessage.success("视频分类已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "视频分类删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">视频分类列表</p>
      </div>
      <el-button type="primary" @click="openCreate">新增视频分类</el-button>
    </div>

    <div class="table-scroll">
      <el-table
        :data="pagedItems"
        stripe
        row-key="id"
        :default-expand-all="true"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="name" label="分类名称" min-width="220" />
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column prop="parent" label="上级分类" width="140" />
        <el-table-column prop="sortOrder" label="排序" width="90" />
        <el-table-column prop="videoCount" label="关联视频" width="100" />
        <el-table-column label="启用状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? "启用" : "隐藏" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeCategory(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <TablePagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
    />

    <VideoCategoryEditorDialog
      v-model="dialogVisible"
      :category="currentRecord"
      :categories="catalogStore.videoCategories"
      @save="saveCategory"
    />
  </div>
</template>
