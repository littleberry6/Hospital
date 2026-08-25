<template>
  <div ref="elRef" class="avatar" :class="{ 'is-loaded': loaded }">
    <!-- 真实图片 -->
    <img
      v-if="isVisible && src && !hasError"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      @error="onError"
      @load="onLoad"
    />
    <!-- 默认头像 fallback（inline SVG 人物剪影）：加载失败或未传 src -->
    <div v-else-if="hasError || !src" class="avatar__default" aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" :fill="bgColor" />
        <circle cx="40" cy="30" r="13" :fill="iconColor" />
        <path
          d="M16 72c0-13.255 10.745-24 24-24s24 10.745 24 24"
          :fill="iconColor"
        />
      </svg>
    </div>
    <!-- 加载中骨架 -->
    <div v-else class="avatar__placeholder skeleton"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLazyImage } from '@/composables/useIntersectionObserver'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  // 默认头像背景色（薄荷绿浅色）
  defaultBg: { type: String, default: '#e8fbf5' },
  // 默认头像图标色
  defaultIcon: { type: String, default: '#a3ddd0' }
})

const loaded = ref(false)
const { elRef, isVisible, hasError, onError } = useLazyImage({ rootMargin: '80px' })

const bgColor = props.defaultBg
const iconColor = props.defaultIcon

const onLoad = () => {
  loaded.value = true
}
</script>

<style scoped>
.avatar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  background: #f0f0f0;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.avatar.is-loaded img {
  opacity: 1;
}
.avatar__default {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar__default svg {
  width: 100%;
  height: 100%;
  display: block;
}
.avatar__placeholder {
  width: 100%;
  height: 100%;
}
</style>
