<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive include="HomeView">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <nav class="tabbar">
      <router-link
        v-for="item in tabs"
        :key="item.name"
        :to="item.path"
        class="tabbar__item"
        :class="{ 'is-active': $route.path === item.path }"
      >
        <span class="tabbar__icon" v-html="item.icon"></span>
        <span class="tabbar__label">{{ item.label }}</span>
      </router-link>
    </nav>
    <ToastHost />
  </div>
</template>

<script setup>
import ToastHost from '@/components/ToastHost.vue'

// 图标 svg 不带固定宽高（尺寸由 CSS 控制，随设备 rem 缩放）
const tabs = [
  {
    name: 'home',
    path: '/',
    label: '首页',
    icon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3L4 9v12h6v-7h4v7h6V9z"/></svg>`
  },
  {
    name: 'inquiry',
    path: '/inquiry',
    label: '问诊',
    icon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>`
  },
  {
    name: 'message',
    path: '/message',
    label: '消息',
    icon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`
  },
  {
    name: 'mine',
    path: '/mine',
    label: '我的',
    icon: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
  }
]
</script>

<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: calc(56px + var(--safe-bottom));
  background: var(--bg);
}

/* 平板/桌面预览：限制最大宽度并居中 */
@media (min-width: 481px) {
  .app {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }
}

.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(56px + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  max-width: 480px; /* 与 .app 对齐，宽屏时居中 */
  margin: 0 auto;
}

.tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-sub);
  transition: color 0.2s;
}

.tabbar__item.is-active {
  color: var(--primary);
}

/* 图标尺寸：px -> rem，随设备宽度等比缩放 */
.tabbar__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabbar__icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.tabbar__label {
  font-size: 11px;
}
</style>
