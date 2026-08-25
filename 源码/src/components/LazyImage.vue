<template>
  <div ref="elRef" class="lazy-image" :class="{ 'is-loaded': loaded }">
    <img
      v-if="isVisible && !hasError"
      :src="src"
      :srcset="srcset || undefined"
      :sizes="sizes || undefined"
      :alt="alt"
      loading="lazy"
      decoding="async"
      @error="onError"
      @load="onLoad"
    />
    <div v-else-if="hasError" class="lazy-image__error flex-center">
      <span>加载失败</span>
    </div>
    <div v-else class="lazy-image__placeholder skeleton"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLazyImage } from '@/composables/useIntersectionObserver'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  // 响应式图片：<url> <描述符>，如 "a.jpg 1x, b.jpg 2x, c.jpg 3x"
  srcset: { type: String, default: '' },
  // 视口描述：<长度>，如 "60px" 或 "(min-width:480px) 80px, 60px"
  sizes: { type: String, default: '' }
})

const loaded = ref(false)
const { elRef, isVisible, hasError, onError } = useLazyImage({ rootMargin: '80px' })

const onLoad = () => {
  loaded.value = true
}

// 当前设备像素比（供调试/上报，浏览器会依据 srcset 自动选择最优资源）
const dpr = computed(() => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1))

defineExpose({ dpr })
</script>

<style scoped>
.lazy-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f0f0f0;
}
.lazy-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.lazy-image.is-loaded img {
  opacity: 1;
}
.lazy-image__placeholder,
.lazy-image__error {
  width: 100%;
  height: 100%;
}
.lazy-image__error {
  color: var(--text-light);
  font-size: 12px;
}
</style>
