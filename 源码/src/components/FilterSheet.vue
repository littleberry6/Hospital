<template>
  <Teleport to="body">
    <transition name="filter-fade">
      <div v-if="modelValue" class="filter-mask" @click.self="close">
        <transition name="filter-slide">
          <div v-if="modelValue" class="filter-panel" role="dialog" aria-label="筛选条件">
            <header class="filter-panel__head">
              <h3 class="filter-panel__title">筛选</h3>
              <button class="filter-panel__close" type="button" aria-label="关闭" @click="close">×</button>
            </header>

            <div class="filter-panel__body">
              <!-- 距离 -->
              <section class="filter-panel__section">
                <h4 class="filter-panel__label">距离</h4>
                <div class="filter-panel__chips">
                  <button
                    v-for="d in distances"
                    :key="d.key"
                    type="button"
                    class="filter-panel__chip"
                    :class="{ 'is-selected': d.key === form.distance }"
                    @click="form.distance = d.key"
                  >
                    {{ d.label }}
                  </button>
                </div>
              </section>

              <!-- 评分 -->
              <section class="filter-panel__section">
                <h4 class="filter-panel__label">赞评</h4>
                <div class="filter-panel__chips">
                  <button
                    v-for="r in ratings"
                    :key="r.key"
                    type="button"
                    class="filter-panel__chip"
                    :class="{ 'is-selected': r.key === form.rating }"
                    @click="form.rating = r.key"
                  >
                    {{ r.label }}
                  </button>
                </div>
              </section>

              <!-- 医院等级 -->
              <section class="filter-panel__section">
                <h4 class="filter-panel__label">医院等级</h4>
                <div class="filter-panel__chips">
                  <button
                    v-for="lv in levels"
                    :key="lv.key"
                    type="button"
                    class="filter-panel__chip"
                    :class="{ 'is-selected': lv.key === form.level }"
                    @click="form.level = lv.key"
                  >
                    {{ lv.label }}
                  </button>
                </div>
              </section>
            </div>

            <footer class="filter-panel__foot">
              <button class="filter-panel__btn filter-panel__btn--ghost" type="button" @click="reset">重置</button>
              <button class="filter-panel__btn filter-panel__btn--primary" type="button" @click="confirm">确认</button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { distanceOptions, ratingOptions, hospitalLevels } from '@/data/regions'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // 初始值
  value: {
    type: Object,
    default: () => ({ distance: 'all', rating: 'all', level: 'all' })
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'reset'])

const distances = distanceOptions
const ratings = ratingOptions
const levels = hospitalLevels

const form = reactive({
  distance: 'all',
  rating: 'all',
  level: 'all'
})

watch(() => props.modelValue, (open) => {
  if (open) {
    form.distance = props.value?.distance ?? 'all'
    form.rating = props.value?.rating ?? 'all'
    form.level = props.value?.level ?? 'all'
  }
})

function reset() {
  form.distance = 'all'
  form.rating = 'all'
  form.level = 'all'
  emit('reset')
}

function confirm() {
  emit('confirm', { ...form })
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.filter-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.filter-panel {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
}

.filter-panel__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.filter-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.filter-panel__close {
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

.filter-panel__body {
  padding: 8px 16px 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
}

.filter-panel__section {
  padding: 12px 0;
  border-bottom: 1px solid #f5f6f8;
}

.filter-panel__section:last-child {
  border-bottom: 0;
}

.filter-panel__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 12px;
}

.filter-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-panel__chip {
  padding: 7px 14px;
  background: #f7f8fa;
  color: var(--text-sub);
  border-radius: 18px;
  font-size: 13px;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.filter-panel__chip.is-selected {
  background: rgba(45, 212, 168, 0.12);
  color: var(--primary-dark);
  border-color: var(--primary);
  font-weight: 600;
}

.filter-panel__chip:active {
  transform: scale(0.96);
}

.filter-panel__foot {
  display: flex;
  gap: 12px;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid #f3f4f6;
}

.filter-panel__btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.15s;
}

.filter-panel__btn--ghost {
  background: #f3f4f6;
  color: var(--text-sub);
}

.filter-panel__btn--primary {
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  color: #fff;
}

.filter-panel__btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 动画 */
.filter-fade-enter-active,
.filter-fade-leave-active {
  transition: opacity 0.25s;
}

.filter-fade-enter-from,
.filter-fade-leave-to {
  opacity: 0;
}

.filter-slide-enter-active,
.filter-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.filter-slide-enter-from,
.filter-slide-leave-to {
  transform: translateY(100%);
}
</style>