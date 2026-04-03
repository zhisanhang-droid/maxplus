<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useCrmStore } from "../../stores/crm";
import type { InquiryRecord } from "../../types/admin";

const crmStore = useCrmStore();

const statusOptions = ["new", "processing", "closed"];
const sourceLabelMap: Record<string, string> = {
  product: "商品页",
  contact: "联系页",
  wholesale: "批发合作"
};

const saveStatus = async (row: InquiryRecord) => {
  try {
    await crmStore.updateInquiry(row);
    ElMessage.success("询盘状态已更新。");
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "询盘状态更新失败。");
  }
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">线索中心</p>
        <h2>询盘管理</h2>
      </div>
    </div>

    <el-table :data="crmStore.inquiries" stripe>
      <el-table-column prop="customer" label="客户" min-width="180" />
      <el-table-column label="来源" width="120">
        <template #default="{ row }">
          {{ sourceLabelMap[row.source] ?? row.source }}
        </template>
      </el-table-column>
      <el-table-column prop="company" label="公司" min-width="180" />
      <el-table-column prop="createdAt" label="创建时间" width="170" />
      <el-table-column label="状态" width="180">
        <template #default="{ row }">
          <el-select v-model="row.status" @change="saveStatus(row)">
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item === 'new' ? '新建' : item === 'processing' ? '处理中' : '已关闭'"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="assignee" label="负责人" width="140" />
      <el-table-column prop="message" label="留言内容" min-width="280" />
    </el-table>
  </div>
</template>
