<template>
  <Teleport to="body">
    <transition name="tslot-fade">
      <div v-if="modelValue" class="tslot-mask" @click.self="close">
        <transition name="tslot-slide">
          <div v-if="modelValue" class="tslot-panel" role="dialog" aria-label="选择时间段">
            <header class="tslot-panel__head">
              <h3 class="tslot-panel__title">选择时间段</h3>
              <button class="tslot-panel__close" type="button" aria-label="关闭" @click="close">×</button>
            </header>

            <div class="tslot-panel__body">
              <!-- 上午 -->
              <p class="tslot-panel__period">上午</p>
              <div class="tslot-panel__grid">
                <button
                  v-for="s in morningSlots"
                  :key="s.label"
                  type="button"
                  class="tslot"
                  :class="{
                    'is-selected': current && current.label === s.label,
                    'is-full': s.rem === 0
                  }"
                  :disabled="s.rem === 0"
                  @click="pick(s)"
                >
                  <span class="tslot__time">{{ s.label }}</span>
                  <span class="tslot__rem" :class="{ 'tslot__rem--full': s.rem === 0 }">
                    {{ s.rem === 0 ? '约满' : '余 ' + s.rem }}
                  </span>
                </button>
              </div>

              <!-- 下午 -->
              <p class="tslot-panel__period">下午</p>
              <div class="tslot-panel__grid">
                <button
                  v-for="s in afternoonSlots"
                  :key="s.label"
                  type="button"
                  class="tslot"
                  :class="{
                    'is-selected': current && current.label === s.label,
                    'is-full': s.rem === 0
                  }"
                  :disabled="s.rem === 0"
                  @click="pick(s)"
                >
                  <span class="tslot__time">{{ s.label }}</span>
                  <span class="tslot__rem" :class="{ 'tslot__rem--full': s.rem === 0 }">
                    {{ s.rem === 0 ? '约满' : '余 ' + s.rem }}
                  </span>
                </button>
              </div>
            </div>

            <footer class="tslot-panel__foot">
              <button class="tslot-panel__btn tslot-panel__btn--ghost" type="button" @click="clear">
                清除选择
              </button>
              <button
                class="tslot-panel__btn tslot-panel__btn--primary"
                type="button"
                :disabled="!current"
                @click="confirm"
              >
                确认时段
              </button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  value: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const current = ref(null)

watch(
  () => props.modelValue,
  (open) => {
    if (open) current.value = props.value || null
  }
)

/* ========== 时段生成（30 分钟一档，余号确定性伪随机） ========== */
function pad(n) {
  return String(n).padStart(2, '0')
}

function genSlots(startH, startM, endH, endM, period) {
  const out = []
  let h = startH
  let m = startM
  let i = 0
  while (h < endH || (h === endH && m < endM)) {
    const nh = m + 30 >= 60 ? h + 1 : h
    const nm = (m + 30) % 60
    out.push({
      label: `${pad(h)}:${pad(m)}-${pad(nh)}:${pad(nm)}`,
      period,
      rem: ((i + 2) * 3) % 8 // 0 表示约满
    })
    h = nh
    m = nm
    i++
  }
  return out
}

const morningSlots = computed(() => genSlots(8, 0, 11, 30, '上午'))
const afternoonSlots = computed(() => genSlots(13, 30, 17, 0, '下午'))

function pick(s) {
  current.value = current.value && current.value.label === s.label ? null : s
}

function clear() {
  current.value = null
  emit('confirm', null)
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
.tslot-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.tslot-panel {
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

.tslot-panel__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.tslot-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main, #1f2937);
}

.tslot-panel__close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  font-size: 22px;
  line-height: 1;
  color: var(--text-sub, #6b7280);
}

.tslot-panel__body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 14px 16px 6px;
}

.tslot-panel__period {
  margin: 6px 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main, #1f2937);
}

.tslot-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 8px;
}

.tslot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px;
  background: #f7f8fa;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.tslot:active {
  transform: scale(0.96);
}

.tslot__time {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main, #1f2937);
}

.tslot__rem {
  font-size: 10px;
  color: #0e9f7c;
}

.tslot__rem--full {
  color: #9ca3af;
}

.tslot.is-selected {
  background: rgba(45, 212, 168, 0.12);
  border-color: var(--primary, #2dd4a8);
}

.tslot.is-selected .tslot__time {
  color: #0e9f7c;
}

.tslot.is-full {
  opacity: 0.55;
  cursor: not-allowed;
}

.tslot-panel__foot {
  display: flex;
  gap: 12px;
  padding: 12px 16px calc(12px + var(--safe-bottom, 0px));
  border-top: 1px solid #f3f4f6;
}

.tslot-panel__btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.15s;
}

.tslot-panel__btn--ghost {
  background: #f3f4f6;
  color: var(--text-sub, #6b7280);
}

.tslot-panel__btn--primary {
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  color: #fff;
}

.tslot-panel__btn--primary:disabled {
  opacity: 0.5;
}

.tslot-panel__btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 动画 */
.tslot-fade-enter-active,
.tslot-fade-leave-active {
  transition: opacity 0.25s;
}
.tslot-fade-enter-from,
.tslot-fade-leave-to {
  opacity: 0;
}
.tslot-slide-enter-active,
.tslot-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
}
.tslot-slide-enter-from,
.tslot-slide-leave-to {
  transform: translateY(100%);
}
</style>
