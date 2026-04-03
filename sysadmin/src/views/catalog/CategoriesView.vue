<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CategoryEditorDialog from "../../components/catalog/CategoryEditorDialog.vue";
import { useCatalogStore } from "../../stores/catalog";
import type { CategoryRecord } from "../../types/admin";

const catalogStore = useCatalogStore();
const dialogVisible = ref(false);
const currentRecord = ref<CategoryRecord | null>(null);

const openCreate = () => {
  currentRecord.value = null;
  dialogVisible.value = true;
};

const openEdit = (record: CategoryRecord) => {
  currentRecord.value = { ...record };
  dialogVisible.value = true;
};

const saveCategory = async (record: CategoryRecord) => {
  try {
    await catalogStore.saveCategory(record);
    ElMessage.success("分类已保存。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "分类保存失败。");
  }
};

const removeCategory = async (record: CategoryRecord) => {
  await ElMessageBox.confirm(`确认删除分类“${record.name}”吗？`, "提示", { type: "warning" });

  try {
    await catalogStore.removeCategory(record.id);
    ElMessage.success("分类已删除。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "分类删除失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">分类中心</p>
        <h2>分类管理</h2>
      </div>
      <el-button type="primary" @click="openCreate">新增分类</el-button>
    </div>

    <el-table :data="catalogStore.categories" stripe>
      <el-table-column prop="name" label="分类名称" min-width="220" />
      <el-table-column prop="slug" label="Slug" min-width="180" />
      <el-table-column prop="parent" label="上级分类" width="140" />
      <el-table-column prop="sortOrder" label="排序" width="90" />
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

    <CategoryEditorDialog
      v-model="dialogVisible"
      :category="currentRecord"
      @save="saveCategory"
    />
  </div>
</template>
