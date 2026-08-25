import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 图片懒加载 Hook：基于 IntersectionObserver
 * @param {Object} options
 * @param {string} options.rootMargin 提前加载的边距
 * @param {number} options.threshold 交叉比例
 */
export function useLazyImage(options = {}) {
  const elRef = ref(null)
  const isVisible = ref(false)
  const hasError = ref(false)

  let observer = null

  onMounted(() => {
    if (!elRef.value) return
    if (!('IntersectionObserver' in window)) {
      // 降级：不支持则直接显示
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0
      }
    )

    observer.observe(elRef.value)
  })

  onUnmounted(() => {
    if (observer && elRef.value) {
      observer.unobserve(elRef.value)
      observer.disconnect()
    }
  })

  const onError = () => {
    hasError.value = true
  }

  return { elRef, isVisible, hasError, onError }
}
