<template>
  <Teleport to="body">
    <transition name="picker-fade">
      <div v-if="modelValue" class="picker-mask" @click.self="close">
        <transition name="picker-slide">
          <div v-if="modelValue" class="picker-panel" role="dialog" aria-label="选择科室">
            <header class="picker-panel__head">
              <h3 class="picker-panel__title">选择科室</h3>
              <button class="picker-panel__close" type="button" aria-label="关闭" @click="close">×</button>
            </header>

            <div class="picker-panel__grid">
              <button
                v-for="(d, idx) in departments"
                :key="d"
                type="button"
                class="picker-panel__chip"
                :class="{ 'is-selected': current === d }"
                @click="pick(d)"
              >
                {{ d }}
              </button>
            </div>

            <footer class="picker-panel__foot">
              <button class="picker-panel__btn picker-panel__btn--ghost" type="button" @click="clear">不限科室</button>
              <button class="picker-panel__btn picker-panel__btn--primary" type="button" @click="confirm">确认</button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  departments: { type: Array, required: true },
  value: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'clear'])

const current = ref('')

watch(() => props.modelValue, (open) => {
  if (open) current.value = props.value || ''
})

function pick(d) {
  current.value = current.value === d ? '' : d
}

function clear() {
  current.value = ''
  emit('clear')
  emit('confirm', '')
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm', current.value)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.picker-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.picker-panel {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
}

.picker-panel__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.picker-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.picker-panel__close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  font-size: 22px;
  line-height: 1;
  color: var(--text-sub);
}

.picker-panel__grid {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
}

.picker-panel__chip {
  padding: 10px 8px;
  background: #f7f8fa;
  color: var(--text-main);
  border-radius: 10px;
  font-size: 13px;
  text-align: center;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.picker-panel__chip.is-selected {
  background: rgba(45, 212, 168, 0.12);
  color: var(--primary-dark);
  border-color: var(--primary);
  font-weight: 600;
}

.picker-panel__chip:active {
  transform: scale(0.96);
}

.picker-panel__foot {
  display: flex;
  gap: 12px;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid #f3f4f6;
}

.picker-panel__btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.15s;
}

.picker-panel__btn--ghost {
  background: #f3f4f6;
  color: var(--text-sub);
}

.picker-panel__btn--primary {
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  color: #fff;
}

.picker-panel__btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 动画 */
.picker-fade-enter-active,
.picker-fade-leave-active {
  transition: opacity 0.25s;
}

.picker-fade-enter-from,
.picker-fade-leave-to {
  opacity: 0;
}

.picker-slide-enter-active,
.picker-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.picker-slide-enter-from,
.picker-slide-leave-to {
  transform: translateY(100%);
}
</style>