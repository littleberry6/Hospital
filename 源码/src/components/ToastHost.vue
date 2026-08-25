<template>
  <transition-group name="toast" tag="div" class="toast-host">
    <div v-for="t in state.list" :key="t.id" class="toast-host__item" role="status">
      <span>{{ t.message }}</span>
    </div>
  </transition-group>
</template>

<script setup>
import { useToastState } from '@/utils/toast'

const state = useToastState()
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: calc(var(--safe-top, 0px) + 64px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  width: max-content;
  max-width: 80vw;
}

.toast-host__item {
  background: rgba(17, 24, 39, 0.86);
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
  padding: 10px 18px;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  max-width: 80vw;
  word-break: break-all;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
