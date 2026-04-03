import { createRouter, createWebHistory } from "vue-router";
import AboutPage from "../pages/AboutPage.vue";
import BlogPage from "../pages/BlogPage.vue";
import BuyPage from "../pages/BuyPage.vue";
import CategoryDetailPage from "../pages/CategoryDetailPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import HomePage from "../pages/HomePage.vue";
import PolicyPage from "../pages/PolicyPage.vue";
import ProductDetailPage from "../pages/ProductDetailPage.vue";
import ProductsPage from "../pages/ProductsPage.vue";
import SearchPage from "../pages/SearchPage.vue";
import VideosPage from "../pages/VideosPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/videos",
      name: "videos",
      component: VideosPage
    },
    {
      path: "/about",
      name: "about",
      component: AboutPage
    },
    {
      path: "/products",
      name: "products",
      component: ProductsPage
    },
    {
      path: "/products/:slug",
      name: "product-detail",
      component: ProductDetailPage
    },
    {
      path: "/categories/:slug",
      name: "category-detail",
      component: CategoryDetailPage
    },
    {
      path: "/blog",
      name: "blog",
      component: BlogPage
    },
    {
      path: "/search",
      name: "search",
      component: SearchPage
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactPage
    },
    {
      path: "/buy",
      name: "buy",
      component: BuyPage
    },
    {
      path: "/policy/:type",
      name: "policy",
      component: PolicyPage
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ],
  scrollBehavior() {
    return {
      top: 0
    };
  }
});
