<template>
  <div
    ref="containerRef"
    class="pull-refresh"
    :class="{ 'pull-refresh--refreshing': state === 'refreshing' }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div class="pull-refresh__track" :style="trackStyle">
      <div class="pull-refresh__head flex-center">
        <span class="pull-refresh__spinner" :class="{ 'is-spinning': state === 'refreshing' }"></span>
        <span class="pull-refresh__text">{{ statusText }}</span>
      </div>
      <div class="pull-refresh__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { rafThrottle } from '@/utils/debounceThrottle'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  distance: { type: Number, default: 70 },
  maxDistance: { type: Number, default: 120 }
})

const emit = defineEmits(['refresh'])

const containerRef = ref(null)
const state = ref('normal') // normal | pulling | loosing | refreshing
const startY = ref(0)
const currentY = ref(0)
const canPull = ref(false)

const trackStyle = computed(() => ({
  transform: `translate3d(0, ${currentY.value}px, 0)`,
  transition: state.value === 'refreshing' ? 'transform 0.2s' : 'none'
}))

const statusText = computed(() => {
  switch (state.value) {
    case 'pulling': return '下拉刷新'
    case 'loosing': return '释放刷新'
    case 'refreshing': return '刷新中...'
    default: return '下拉刷新'
  }
})

function isTop() {
  if (!containerRef.value) return false
  return containerRef.value.scrollTop <= 1
}

const onTouchStart = (e) => {
  if (props.disabled || state.value === 'refreshing') return
  if (!isTop()) return
  canPull.value = true
  startY.value = e.touches[0].clientY
  state.value = 'pulling'
}

const onTouchMove = rafThrottle((e) => {
  if (!canPull.value || props.disabled || state.value === 'refreshing') return
  const y = e.touches[0].clientY
  const diff = y - startY.value

  if (diff < 0) {
    canPull.value = false
    currentY.value = 0
    state.value = 'normal'
    return
  }

  // 阻尼
  const damped = Math.min(diff * 0.55, props.maxDistance)
  currentY.value = damped
  state.value = damped >= props.distance ? 'loosing' : 'pulling'
})

const onTouchEnd = () => {
  if (!canPull.value || props.disabled) return
  canPull.value = false

  if (state.value === 'loosing') {
    state.value = 'refreshing'
    currentY.value = props.distance
    emit('refresh', finishRefresh)
  } else {
    state.value = 'normal'
    currentY.value = 0
  }
}

function finishRefresh() {
  state.value = 'normal'
  currentY.value = 0
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
})
</script>

<style scoped>
.pull-refresh {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}
.pull-refresh__track {
  min-height: 100%;
  position: relative;
}
.pull-refresh__head {
  position: absolute;
  left: 0;
  top: -50px;
  width: 100%;
  height: 50px;
  color: var(--text-sub);
  font-size: 13px;
  gap: 8px;
}
.pull-refresh__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: var(--primary);
  border-radius: 50%;
}
.pull-refresh__spinner.is-spinning {
  animation: rotate 0.8s linear infinite;
}
@keyframes rotate {
  to { transform: rotate(360deg); }
}
</style>
