<template>
  <Teleport to="body">
    <transition name="search-panel">
      <div v-if="visible" class="search-panel">
        <!-- 顶部搜索栏（与首页同款渐变） -->
        <header class="search-panel__nav">
          <button class="search-panel__back" type="button" @click="close" aria-label="返回">
            <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 7l-5 5 5 5V7z"/></svg>
          </button>
          <div class="search-panel__bar">
            <svg class="search-panel__bar-icon" viewBox="0 0 24 24">
              <path fill="#9ca3af" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/>
            </svg>
            <input
              ref="inputRef"
              v-model.trim="keyword"
              type="search"
              class="search-panel__input"
              :placeholder="placeholderText"
              @keydown.enter="onSearch"
            />
            <button v-if="keyword" class="search-panel__clear" type="button" @click="keyword = ''" aria-label="清空">
              <svg viewBox="0 0 24 24"><path fill="#9ca3af" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
          <button class="search-panel__btn" type="button" @click="onSearch">搜索</button>
        </header>

        <!-- 滚动内容区 -->
        <div class="search-panel__body scroll-y">
          <!-- 联想提示词（输入中实时显示） -->
          <template v-if="keyword && suggestions.length > 0">
            <section class="sp-section sp-suggest">
              <div
                v-for="s in suggestions"
                :key="s.id"
                class="sp-suggest__item"
                @click="onSuggestionClick(s)"
              >
                <svg class="sp-suggest__search-ico" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/>
                </svg>
                <div class="sp-suggest__main">
                  <p class="sp-suggest__name" v-html="highlight(s.name)"></p>
                  <p class="sp-suggest__sub">{{ typeLabel(s.type) }}{{ s.sub ? ' · ' + s.sub : '' }}</p>
                </div>
                <span class="sp-suggest__type" :class="'sp-suggest__type--' + s.type">{{ typeLabel(s.type) }}</span>
              </div>
            </section>
          </template>

          <!-- 无联想结果 -->
          <template v-else-if="keyword">
            <section class="sp-section sp-empty-suggest">
              <div
                class="sp-suggest__item"
                @click="onSearch"
              >
                <svg class="sp-suggest__search-ico" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/>
                </svg>
                <div class="sp-suggest__main">
                  <p class="sp-suggest__name">搜索"{{ keyword }}"</p>
                  <p class="sp-suggest__sub">在全部结果中查找</p>
                </div>
              </div>
            </section>
          </template>

          <!-- 默认态：搜索历史 + 热门搜索 -->
          <template v-else>
            <!-- 搜索历史 -->
            <section v-if="history.length > 0" class="sp-section">
              <div class="sp-section__head">
                <h3 class="sp-section__title">搜索历史</h3>
                <button class="sp-section__clear" type="button" @click="onClearHistory">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  清除
                </button>
              </div>
              <div class="sp-tags">
                <button
                  v-for="h in history"
                  :key="h"
                  class="sp-tag"
                  type="button"
                  @click="onHistoryClick(h)"
                >{{ h }}</button>
              </div>
            </section>

            <!-- 热门搜索 -->
            <section class="sp-section">
              <h3 class="sp-section__title">热门搜索</h3>
              <div class="sp-hot">
                <div
                  v-for="(item, i) in hotWords"
                  :key="item.text"
                  class="sp-hot__item"
                  @click="onHotWordClick(item.text)"
                >
                  <span class="sp-hot__rank" :class="{ 'sp-hot__rank--top': i < 3 }">{{ i + 1 }}</span>
                  <span class="sp-hot__text">{{ item.text }}</span>
                  <span v-if="item.tag" class="sp-hot__tag" :class="'sp-hot__tag--' + item.tagType">{{ item.tag }}</span>
                </div>
              </div>
            </section>
          </template>

          <div class="search-panel__pad"></div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import {
  getHistory,
  saveHistory,
  clearHistory,
  hotWords,
  getSuggestions,
  typeLabel,
  highlightKeyword
} from '@/utils/searchStore'

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'close'])

const router = useRouter()

const keyword = ref('')
const history = ref([])
const inputRef = ref(null)

/* 轮换的提示词 */
const placeholderPool = [
  '搜索医生、疾病、医院',
  '如：高血压、糖尿病',
  '如：北京协和医院',
  '如：儿科、皮肤科',
  '如：王明钦 主任医师'
]
const placeholderText = ref(placeholderPool[0])
let placeholderTimer = null

const suggestions = computed(() => getSuggestions(keyword.value))

watch(() => props.visible, (v) => {
  if (v) {
    // 打开时：加载历史 + 聚焦 + 启动提示词轮换
    history.value = getHistory()
    keyword.value = ''
    let idx = 0
    placeholderText.value = placeholderPool[idx]
    clearInterval(placeholderTimer)
    placeholderTimer = setInterval(() => {
      idx = (idx + 1) % placeholderPool.length
      placeholderText.value = placeholderPool[idx]
    }, 3000)
    nextTick(() => inputRef.value && inputRef.value.focus())
  } else {
    clearInterval(placeholderTimer)
    placeholderTimer = null
  }
})

function close() {
  emit('update:visible', false)
  emit('close')
}

function highlight(text) {
  return highlightKeyword(text, keyword.value)
}

/* 跳转到搜索页并携带关键词 */
function goSearch(kw) {
  const text = (kw || keyword.value || '').trim()
  if (!text) {
    toast('请输入搜索关键词')
    return
  }
  saveHistory(text)
  close()
  router.push({ path: '/search', query: { kw: text } })
}

function onSearch() {
  goSearch()
}

function onSuggestionClick(s) {
  goSearch(s.name)
}

function onHistoryClick(h) {
  goSearch(h)
}

function onHotWordClick(text) {
  goSearch(text)
}

function onClearHistory() {
  clearHistory()
  history.value = []
  toast('已清除搜索历史')
}
</script>

<style scoped>
.search-panel {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  background: var(--bg, #f6f8fa);
}

/* 进出场动画：从顶部滑入/滑出 */
.search-panel-enter-active,
.search-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s;
}

.search-panel-enter-from,
.search-panel-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* ===== 顶部搜索栏 ===== */
.search-panel__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  height: calc(52px + var(--safe-top, 0px));
  padding: var(--safe-top, 0px) 12px 0;
  background: linear-gradient(135deg, #2dd4a8 0%, #4adebf 100%);
  flex-shrink: 0;
}

.search-panel__back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
}

.search-panel__back svg {
  width: 20px;
  height: 20px;
}

.search-panel__bar {
  flex: 1;
  height: 36px;
  background: #fff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-panel__bar-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.search-panel__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-main, #1f2937);
  min-width: 0;
}

.search-panel__input::placeholder {
  color: var(--text-light, #9ca3af);
  transition: opacity 0.3s;
}

.search-panel__clear {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  display: flex;
}

.search-panel__clear svg {
  width: 18px;
  height: 18px;
}

.search-panel__btn {
  flex-shrink: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  background: none;
  border: none;
  padding: 4px 2px;
}

/* ===== 内容区 ===== */
.search-panel__body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sp-section {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.sp-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sp-section__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
  margin-bottom: 12px;
}

.sp-section__head .sp-section__title {
  margin-bottom: 0;
}

.sp-section__clear {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-sub, #6b7280);
  background: none;
  border: none;
  padding: 0;
}

.sp-section__clear svg {
  width: 14px;
  height: 14px;
}

/* ===== 搜索历史 tags ===== */
.sp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sp-tag {
  padding: 7px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-sub, #6b7280);
  background: #f3f4f6;
  border: none;
  transition: all 0.15s;
}

.sp-tag:active {
  background: rgba(45, 212, 168, 0.15);
  color: #0d9488;
}

/* ===== 热门搜索 ===== */
.sp-hot {
  display: flex;
  flex-direction: column;
}

.sp-hot__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.sp-hot__item:last-child {
  border-bottom: none;
}

.sp-hot__item:active {
  opacity: 0.7;
}

.sp-hot__rank {
  width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-light, #9ca3af);
  font-style: italic;
  flex-shrink: 0;
}

.sp-hot__rank--top {
  color: #ef4444;
}

.sp-hot__text {
  flex: 1;
  font-size: 14px;
  color: var(--text-main, #1f2937);
}

.sp-hot__tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.sp-hot__tag--hot {
  background: #fef2f2;
  color: #ef4444;
}

.sp-hot__tag--new {
  background: #eff6ff;
  color: #2563eb;
}

/* ===== 联想提示词 ===== */
.sp-suggest__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.sp-suggest__item:last-child {
  border-bottom: none;
}

.sp-suggest__item:active {
  background: #f9fafb;
}

.sp-suggest__search-ico {
  width: 18px;
  height: 18px;
  color: var(--text-light, #9ca3af);
  flex-shrink: 0;
}

.sp-suggest__main {
  flex: 1;
  min-width: 0;
}

.sp-suggest__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main, #1f2937);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 命中关键词高亮 */
.sp-suggest__name :deep(.hl) {
  color: #14b8a6;
  font-weight: 700;
}

.sp-suggest__sub {
  font-size: 12px;
  color: var(--text-sub, #6b7280);
  margin-top: 2px;
}

.sp-suggest__type {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
}

.sp-suggest__type--hospital {
  background: #fef2f2;
  color: #ef4444;
}

.sp-suggest__type--department {
  background: #eff6ff;
  color: #2563eb;
}

.sp-suggest__type--doctor {
  background: rgba(45, 212, 168, 0.14);
  color: #0d9488;
}

.sp-suggest__type--disease {
  background: #fff7ed;
  color: #f59e0b;
}

.search-panel__pad {
  height: 20px;
}
</style>
