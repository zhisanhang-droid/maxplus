# MaxPlus Website Vue3 改造 TODO

## 目标

将当前静态页面改造成 `Vue 3 + Vite` 技术栈，并严格遵循 `need.txt` 的要求：

- 遵循模块化思想，每个模块代码量尽量少
- 要求网站性能好，提高用户浏览网站体验
- 减少白屏时间，优化滚动体验

## 待办清单

### 1. 工程基础

- [x] 创建 `Vue 3 + Vite` 工程基础文件
- [x] 创建 `src/`、`components/`、`composables/`、`data/`、`directives/` 目录
- [x] 安装项目依赖
- [x] 跑通生产构建环境

### 2. 页面结构改造

- [x] 将首页拆分为独立 Vue 组件
- [x] 拆分顶部导航 `SiteHeader`
- [x] 拆分首屏轮播 `HeroSlider`
- [x] 拆分亮点模块 `HighlightsSection`
- [x] 拆分精选产品模块 `FeaturedProductsSection`
- [x] 拆分分类模块 `CategorySection`
- [x] 拆分评价模块 `ReviewsSection`
- [x] 拆分联系表单模块 `ContactSection`
- [x] 拆分页脚模块 `SiteFooter`
- [x] 拆分订阅浮层模块 `SubscribeWidget`

### 3. 数据与状态

- [x] 抽离页面文案到独立数据文件
- [x] 抽离导航、Hero、产品、分类、评价、联系表单、订阅文案
- [x] 保持内容结构清晰，避免把大段文案硬编码到组件内

### 4. 交互功能

- [x] 实现 Hero 自动轮播
- [x] 实现 Hero 手动切换
- [x] 实现移动端菜单展开/收起
- [x] 实现订阅浮层开合
- [x] 实现联系表单前端演示提交
- [x] 实现订阅表单前端演示提交

### 5. 滚动与体验优化

- [x] 用指令或组合函数实现滚动显隐动画
- [x] 保留现有页面滚动 reveal 效果
- [x] 避免重复监听和重复逻辑
- [x] 兼容 `prefers-reduced-motion`

### 6. 性能优化

- [x] 保持轻量依赖，不引入不必要的库
- [x] 减少组件耦合，控制单文件体积
- [x] 在 `index.html` 中保留首屏基础背景，减少白屏感
- [x] 保留字体预连接 `preconnect`
- [x] 优化首屏加载体验

### 7. 样式与还原

- [x] 复用现有 `styles-sporting.css` 作为全局样式基础
- [x] 保持现有深蓝 + 橙色配色方案
- [x] 保持当前 Hero 版式和卡片风格
- [x] 保持响应式布局效果
- [ ] 校验 Vue 版本页面与原静态稿视觉一致

### 8. 验证与交付

- [x] 执行 `npm install`
- [x] 执行 `npm run build`
- [x] 修复构建报错
- [ ] 验证页面运行正常
- [ ] 输出改造结果说明

## 当前说明

当前已经完成 Vue 3 + Vite 改造和生产构建验证，剩余主要是页面视觉回归检查与进一步优化。
