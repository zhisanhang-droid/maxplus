<script setup lang="ts">
import { computed, ref } from "vue";
import { useSystemStore } from "../../stores/system";

const systemStore = useSystemStore();
const filterType = ref("all");
const typeLabelMap: Record<string, string> = {
  login: "登录日志",
  operation: "操作日志"
};
const roleLabelMap: Record<string, string> = {
  "super-admin": "超级管理员",
  operator: "运营",
  support: "客服"
};

const visibleLogs = computed(() =>
  systemStore.logs.filter((item) => (filterType.value === "all" ? true : item.type === filterType.value))
);
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">系统记录</p>
        <h2>日志中心</h2>
      </div>
      <el-select v-model="filterType" class="toolbar-input">
        <el-option label="全部日志" value="all" />
        <el-option label="登录日志" value="login" />
        <el-option label="操作日志" value="operation" />
      </el-select>
    </div>

    <el-table :data="visibleLogs" stripe>
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          {{ typeLabelMap[row.type] ?? row.type }}
        </template>
      </el-table-column>
      <el-table-column prop="actor" label="操作人" width="180" />
      <el-table-column label="角色" width="140">
        <template #default="{ row }">
          {{ roleLabelMap[row.role] ?? row.role }}
        </template>
      </el-table-column>
      <el-table-column prop="message" label="内容" min-width="360" />
      <el-table-column prop="createdAt" label="时间" width="190" />
    </el-table>
  </div>
</template>
