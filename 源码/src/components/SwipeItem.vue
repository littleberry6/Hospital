<template>
  <div class="swipe-item">
    <div
      ref="trackRef"
      class="swipe-item__track"
      :style="trackStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="swipe-item__content">
        <slot />
      </div>
      <div class="swipe-item__actions" :style="{ width: `${actionWidth}px` }">
        <button class="swipe-item__btn swipe-item__btn--delete" @click="onDelete">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  actionWidth: { type: Number, default: 70 }
})

const emit = defineEmits(['delete'])

const trackRef = ref(null)
const translateX = ref(0)
const isOpen = ref(false)
const isDragging = ref(false)

const trackStyle = computed(() => ({
  transform: `translate3d(${-translateX.value}px, 0, 0)`,
  transition: isDragging.value ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
}))

let startX = 0
let startY = 0
let currentX = 0
let isHorizontal = null

const reset = () => {
  translateX.value = 0
  isOpen.value = false
}

const open = () => {
  translateX.value = props.actionWidth
  isOpen.value = true
}

const onTouchStart = (e) => {
  if (e.touches.length !== 1) return
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  currentX = translateX.value
  isDragging.value = true
  isHorizontal = null
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  const deltaX = startX - x
  const deltaY = startY - y

  // 方向锁：首次移动时判断
  if (isHorizontal === null) {
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
      isHorizontal = true
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
      isHorizontal = false
    }
  }

  if (isHorizontal === false) return
  if (isHorizontal === true) {
    e.preventDefault()
  }

  let next = currentX + deltaX
  if (next < 0) next = 0
  if (next > props.actionWidth) next = props.actionWidth
  translateX.value = next
}

const onTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (translateX.value >= props.actionWidth * 0.5) {
    open()
  } else {
    reset()
  }
}

const onDelete = () => {
  reset()
  emit('delete')
}

// 点击页面其他地方关闭
const closeOnDocClick = (e) => {
  if (trackRef.value && !trackRef.value.contains(e.target) && isOpen.value) {
    reset()
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnDocClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnDocClick, true)
})

defineExpose({ reset, open })
</script>

<style scoped>
.swipe-item {
  position: relative;
  overflow: hidden;
  background: var(--card-bg);
}
.swipe-item__track {
  display: flex;
  align-items: stretch;
  position: relative;
}
.swipe-item__content {
  flex: 1;
  min-width: 0;
  background: var(--card-bg);
  position: relative;
  z-index: 1;
}
.swipe-item__actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 0;
}
.swipe-item__btn {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swipe-item__btn--delete {
  background: var(--danger);
}
</style>
