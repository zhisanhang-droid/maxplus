<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useCrmStore } from "../../stores/crm";

const crmStore = useCrmStore();

const exportCsv = () => {
  const rows = crmStore.subscribers.map((item) =>
    [item.email, item.source, item.orderNumber, item.createdAt].join(",")
  );
  const csv = ["email,source,orderNumber,createdAt", ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "订阅列表.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  ElMessage.success("订阅列表已导出。");
};
</script>

<template>
  <div class="page-card">
    <div class="page-card__header">
      <div>
        <p class="page-card__eyebrow">线索中心</p>
        <h2>订阅管理</h2>
      </div>
      <el-button type="primary" plain @click="exportCsv">导出 CSV</el-button>
    </div>

    <el-table :data="crmStore.subscribers" stripe>
      <el-table-column prop="email" label="邮箱" min-width="220" />
      <el-table-column prop="source" label="来源" width="180" />
      <el-table-column prop="orderNumber" label="订单号" width="160" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
    </el-table>
  </div>
</template>
