<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useSessionStore } from "../../stores/session";

const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

const pageTitleMap: Record<string, string> = {
  dashboard: "仪表盘",
  "site-settings": "站点设置",
  products: "商品管理",
  categories: "分类管理",
  videos: "视频管理",
  blog: "博客管理",
  "home-content": "首页内容",
  "module-switches": "模块开关",
  inquiries: "询盘管理",
  subscribers: "订阅管理",
  seo: "SEO",
  logs: "系统日志"
};

const roleLabelMap: Record<string, string> = {
  "super-admin": "超级管理员",
  operator: "运营",
  support: "客服"
};

const logout = async () => {
  sessionStore.logout();
  await router.push("/login");
};
</script>

<template>
  <header class="header-bar">
    <div>
      <p class="header-bar__eyebrow">MaxPlus 后台</p>
      <h1>{{ pageTitleMap[String(route.name)] ?? "后台管理系统" }}</h1>
    </div>

    <div class="header-bar__actions">
      <div class="header-bar__user">
        <strong>{{ sessionStore.session?.username ?? "访客" }}</strong>
        <span>{{ roleLabelMap[sessionStore.session?.role ?? ""] ?? "访客" }}</span>
      </div>

      <el-button type="primary" plain @click="logout">
        退出登录
      </el-button>
    </div>
  </header>
</template>
