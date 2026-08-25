<template>
  <div class="page more-page">
    <header class="more-header">
      <button class="more-header__back" type="button" aria-label="返回" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="more-header__title ellipsis">{{ pageTitle }}</h1>
      <span class="more-header__placeholder" aria-hidden="true"></span>
    </header>

    <main class="more-body">
      <div class="placeholder">
        <div class="placeholder__icon flex-center">
          <svg class="icon icon-48" viewBox="0 0 24 24">
            <path fill="#2dd4a8" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 class="placeholder__title">{{ pageTitle }}</h2>
        <p class="placeholder__desc">该功能模块即将上线，敬请期待</p>
        <button class="placeholder__btn" type="button" @click="goBack">返回上一页</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  const t = route.params?.title || route.query?.title
  return t ? decodeURIComponent(t) : '更多'
})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<style scoped>
.more-page {
  min-height: 100vh;
  background: var(--bg, #f5f7f8);
  display: flex;
  flex-direction: column;
}

.more-header {
  height: calc(env(safe-top, 0px) + 48px);
  padding-top: env(safe-top, 0px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.more-header__back {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.more-header__back svg {
  width: 22px;
  height: 22px;
}

.more-header__back:active {
  transform: scale(0.92);
}

.more-header__title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
  max-width: 60vw;
}

.more-header__placeholder {
  width: 36px;
  height: 36px;
}

.more-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  padding: 40px;
}

.placeholder__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: var(--primary-light, #e6faf4);
  border-radius: 50%;
}

.placeholder__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main, #111827);
}

.placeholder__desc {
  font-size: 14px;
  color: var(--text-sub, #6b7280);
}

.placeholder__btn {
  margin-top: 20px;
  padding: 9px 26px;
  border-radius: 999px;
  border: none;
  background: var(--primary-light, #e6faf4);
  color: var(--primary-dark, #0e9f7c);
  font-size: 14px;
  font-weight: 600;
}

.placeholder__btn:active {
  transform: scale(0.95);
}
</style>
