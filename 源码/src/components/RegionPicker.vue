<template>
  <Teleport to="body">
    <transition name="picker-fade">
      <div v-if="modelValue" class="picker-mask" @click.self="close">
        <transition name="picker-slide">
          <div v-if="modelValue" class="picker-panel" role="dialog" aria-label="选择地区">
            <!-- 顶部：省/市/县 Tab -->
            <header class="picker-panel__head">
              <span class="picker-panel__head-tab" :class="{ 'is-active': stage === 'p' }" @click="stage = 'p'">
                {{ selectedProvince || '请选择' }}
              </span>
              <span class="picker-panel__head-arrow">›</span>
              <span class="picker-panel__head-tab" :class="{ 'is-active': stage === 'c', 'is-disabled': !selectedProvince }" @click="onCityTab">
                {{ selectedCity || '请选择' }}
              </span>
              <span class="picker-panel__head-arrow">›</span>
              <span class="picker-panel__head-tab" :class="{ 'is-active': stage === 'co', 'is-disabled': !selectedCity }" @click="onCountyTab">
                {{ selectedCounty || '请选择' }}
              </span>
              <button class="picker-panel__close" type="button" aria-label="关闭" @click="close">×</button>
            </header>

            <!-- 列表：三列横排；只激活 stage 列可点击 -->
            <div class="picker-panel__lists">
              <ul class="picker-panel__list">
                <li
                  v-for="p in regions"
                  :key="p.name"
                  class="picker-panel__item"
                  :class="{ 'is-selected': p.name === selectedProvince }"
                  @click="pickProvince(p)"
                >
                  {{ p.name }}
                  <svg v-if="p.name === selectedProvince" class="picker-panel__check" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </li>
              </ul>
              <ul class="picker-panel__list">
                <li
                  v-for="city in currentCities"
                  :key="city.name"
                  class="picker-panel__item"
                  :class="{ 'is-selected': city.name === selectedCity, 'is-disabled': !selectedProvince }"
                  @click="pickCity(city)"
                >
                  {{ city.name }}
                  <svg v-if="city.name === selectedCity" class="picker-panel__check" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </li>
                <li v-if="!currentCities.length" class="picker-panel__empty">请先选择省</li>
              </ul>
              <ul class="picker-panel__list">
                <li
                  v-for="county in currentCounties"
                  :key="county"
                  class="picker-panel__item"
                  :class="{ 'is-selected': county === selectedCounty, 'is-disabled': !selectedCity }"
                  @click="pickCounty(county)"
                >
                  {{ county }}
                  <svg v-if="county === selectedCounty" class="picker-panel__check" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </li>
                <li v-if="!currentCounties.length" class="picker-panel__empty">请先选择市</li>
              </ul>
            </div>

            <!-- 底部：清空 / 确认 -->
            <footer class="picker-panel__foot">
              <button class="picker-panel__btn picker-panel__btn--ghost" type="button" @click="clear">不限地区</button>
              <button class="picker-panel__btn picker-panel__btn--primary" type="button" @click="confirm">确认</button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { regions } from '@/data/regions'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // 初始值 { province, city, county }
  value: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'clear'])

const stage = ref('p') // 'p' | 'c' | 'co'
const selectedProvince = ref('')
const selectedCity = ref('')
const selectedCounty = ref('')

// 打开时重置 / 同步外部值
watch(() => props.modelValue, (open) => {
  if (open) {
    selectedProvince.value = props.value.province || ''
    selectedCity.value = props.value.city || ''
    selectedCounty.value = props.value.county || ''
    stage.value = !selectedProvince.value ? 'p'
      : !selectedCity.value ? 'c'
      : !selectedCounty.value ? 'co'
      : 'co'
  }
})

// 当前选中省的城市列表
const currentCities = computed(() => {
  if (!selectedProvince.value) return []
  const p = regions.find((r) => r.name === selectedProvince.value)
  return p ? p.cities : []
})

// 当前选中市的区县列表
const currentCounties = computed(() => {
  if (!selectedCity.value) return []
  const city = currentCities.value.find((c) => c.name === selectedCity.value)
  return city ? city.counties : []
})

function pickProvince(p) {
  if (selectedProvince.value !== p.name) {
    selectedProvince.value = p.name
    selectedCity.value = ''
    selectedCounty.value = ''
  }
  stage.value = 'c'
}

function pickCity(c) {
  if (selectedCity.value !== c.name) {
    selectedCity.value = c.name
    selectedCounty.value = ''
  }
  stage.value = 'co'
}

function pickCounty(co) {
  selectedCounty.value = co
  // 选完县直接确认
  confirm()
}

function onCityTab() {
  if (selectedProvince.value) stage.value = 'c'
}

function onCountyTab() {
  if (selectedCity.value) stage.value = 'co'
}

function clear() {
  selectedProvince.value = ''
  selectedCity.value = ''
  selectedCounty.value = ''
  emit('clear')
  emit('confirm', { province: '', city: '', county: '' })
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm', {
    province: selectedProvince.value,
    city: selectedCity.value,
    county: selectedCounty.value
  })
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
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
}

.picker-panel__head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 40px 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #fafbfc;
}

.picker-panel__head-tab {
  font-size: 13px;
  color: var(--text-sub);
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker-panel__head-tab.is-active {
  color: var(--primary-dark);
  font-weight: 600;
  background: rgba(45, 212, 168, 0.1);
}

.picker-panel__head-tab.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

.picker-panel__head-arrow {
  color: var(--text-light);
  font-size: 12px;
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

.picker-panel__lists {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  overflow: hidden;
}

.picker-panel__list {
  border-right: 1px solid #f3f4f6;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.picker-panel__list:last-child {
  border-right: 0;
}

.picker-panel__item {
  position: relative;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--text-main);
  border-bottom: 1px solid #fafbfc;
  cursor: pointer;
  transition: background 0.15s;
}

.picker-panel__item.is-selected {
  color: var(--primary-dark);
  background: rgba(45, 212, 168, 0.08);
  font-weight: 600;
}

.picker-panel__item.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.picker-panel__check {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.picker-panel__empty {
  padding: 24px 14px;
  font-size: 13px;
  color: var(--text-light);
  text-align: center;
}

.picker-panel__foot {
  display: flex;
  gap: 12px;
  padding: 12px 16px calc(12px + var(--safe-bottom));
  border-top: 1px solid #f3f4f6;
  background: #fff;
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