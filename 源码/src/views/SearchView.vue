<template>
  <div class="page search">
    <!-- 搜索栏 -->
    <header class="search__nav">
      <button class="search__back" type="button" @click="goBack">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 7l-5 5 5 5V7z"/></svg>
      </button>
      <div class="search__bar">
        <svg class="search__bar-icon" viewBox="0 0 24 24">
          <path fill="#9ca3af" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/>
        </svg>
        <input
          ref="searchInputRef"
          v-model.trim="keyword"
          type="search"
          class="search__input"
          placeholder="搜索医院、科室、医生、疾病"
          @keydown.enter="onSearch"
        />
        <button v-if="keyword" class="search__clear" type="button" @click="keyword = ''">
          <svg viewBox="0 0 24 24"><path fill="#9ca3af" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <button class="search__btn" type="button" @click="onSearch">搜索</button>
    </header>

    <div class="search__scroll scroll-y">
      <!-- 智能导诊入口 -->
      <section class="search__triage">
        <div class="search__triage-card" @click="goTriage">
          <div class="search__triage-icon">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="rgba(45,212,168,0.12)" />
              <path fill="#2dd4a8" d="M24 12a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 18a8 8 0 0 1-7-4 5 5 0 0 1 7-3 5 5 0 0 1 7 3 8 8 0 0 1-7 4z"/>
            </svg>
          </div>
          <div class="search__triage-info">
            <h3 class="search__triage-title">智能导诊</h3>
            <p class="search__triage-desc">输入症状，AI 推荐就诊科室</p>
          </div>
          <svg class="search__triage-arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M9 6l6 6-6 6"/></svg>
        </div>
      </section>

      <!-- 搜索结果 -->
      <template v-if="searchResults.length > 0">
        <section class="search__results">
          <h3 class="search__results-title">搜索结果</h3>
          <div
            v-for="r in searchResults"
            :key="r.id"
            class="result-item"
            @click="onResultClick(r)"
          >
            <div class="result-item__icon" :class="'result-item__icon--' + r.type">
              <svg viewBox="0 0 24 24"><path fill="currentColor" :d="iconPath(r.type)" /></svg>
            </div>
            <div class="result-item__main">
              <p class="result-item__name" v-html="highlight(r.name)"></p>
              <p class="result-item__sub">{{ typeLabel(r.type) }}{{ r.sub ? ' · ' + r.sub : '' }}</p>
            </div>
            <svg class="result-item__arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M9 6l6 6-6 6"/></svg>
          </div>
        </section>
      </template>

      <!-- 智能导诊面板 -->
      <template v-else-if="triageMode">
        <section class="search__triage-panel">
          <h3 class="search__section-title">请描述您的症状</h3>
          <div class="triage-input">
            <textarea
              v-model.trim="symptom"
              class="triage-input__area"
              placeholder="例如：头痛、发烧、咳嗽、腹泻..."
              rows="3"
            ></textarea>
            <button class="triage-input__btn" type="button" @click="doTriage">智能导诊</button>
          </div>

          <!-- 推荐科室结果 -->
          <div v-if="triageResults.length > 0" class="triage-result">
            <p class="triage-result__title">根据症状推荐就诊科室：</p>
            <div class="triage-result__chips">
              <button
                v-for="dept in triageResults"
                :key="dept.name"
                class="triage-result__chip"
                type="button"
                @click="goDept(dept)"
              >
                <span class="triage-result__chip-name">{{ dept.name }}</span>
                <span class="triage-result__chip-rate">匹配度 {{ dept.rate }}%</span>
              </button>
            </div>
            <p class="triage-result__tip">以上推荐仅供参考，具体请以医生诊断为准</p>
          </div>

          <!-- 常见症状快捷入口 -->
          <div class="triage-quick">
            <p class="triage-quick__title">常见症状</p>
            <div class="triage-quick__grid">
              <button
                v-for="s in commonSymptoms"
                :key="s"
                class="triage-quick__chip"
                type="button"
                @click="quickSymptom(s)"
              >{{ s }}</button>
            </div>
          </div>
        </section>
      </template>

      <!-- 默认页：搜索历史 + 热门搜索 -->
      <template v-else>
        <!-- 搜索历史 -->
        <section v-if="history.length > 0" class="search__section">
          <div class="search__section-head">
            <h3 class="search__section-title">搜索历史</h3>
            <button class="search__clear-history" type="button" @click="clearHistory">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              清除
            </button>
          </div>
          <div class="search__tags">
            <button
              v-for="h in history"
              :key="h"
              class="search__tag"
              type="button"
              @click="tagSearch(h)"
            >{{ h }}</button>
          </div>
        </section>

        <!-- 热门搜索 -->
        <section class="search__section">
          <h3 class="search__section-title">热门搜索</h3>
          <div class="search__hot">
            <div
              v-for="(item, i) in hotSearch"
              :key="item.text"
              class="search__hot-item"
              @click="tagSearch(item.text)"
            >
              <span class="search__hot-rank" :class="{ 'search__hot-rank--top': i < 3 }">{{ i + 1 }}</span>
              <span class="search__hot-text">{{ item.text }}</span>
              <span v-if="item.tag" class="search__hot-tag" :class="'search__hot-tag--' + item.tagType">{{ item.tag }}</span>
            </div>
          </div>
        </section>

        <!-- 按分类浏览 -->
        <section class="search__section">
          <h3 class="search__section-title">按分类浏览</h3>
          <div class="search__cats">
            <button
              v-for="c in categories"
              :key="c.name"
              class="search__cat"
              type="button"
              @click="tagSearch(c.name)"
            >
              <span class="search__cat-icon" :style="{ background: c.bg, color: c.color }">
                <svg viewBox="0 0 24 24"><path fill="currentColor" :d="c.icon" /></svg>
              </span>
              <span class="search__cat-label">{{ c.name }}</span>
            </button>
          </div>
        </section>
      </template>

      <div class="search__safe-space"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

const keyword = ref('')
const triageMode = ref(false)
const symptom = ref('')
const triageResults = ref([])
const searchInputRef = ref(null)

const history = ref([])
const hotSearch = ref([
  { text: '北京协和医院', tag: '热', tagType: 'hot' },
  { text: '心血管内科', tag: '荐', tagType: 'new' },
  { text: '王明钦', tag: '', tagType: '' },
  { text: '儿童发烧', tag: '', tagType: '' },
  { text: '高血压', tag: '', tagType: '' },
  { text: '糖尿病', tag: '', tagType: '' },
  { text: '皮肤病', tag: '', tagType: '' },
  { text: '口腔溃疡', tag: '', tagType: '' }
])

const categories = ref([
  { name: '内科', bg: '#dbeafe', color: '#2563eb', icon: 'M3 12h18M12 3v18' },
  { name: '外科', bg: '#dcfce7', color: '#16a34a', icon: 'M19 8l-4 4 4 4M11 8l-4 4 4 4' },
  { name: '儿科', bg: '#fce7f3', color: '#db2777', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z' },
  { name: '妇产科', bg: '#fde68a', color: '#d97706', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10' },
  { name: '眼科', bg: '#e0e7ff', color: '#4f46e5', icon: 'M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C21.3 7.6 17 4.5 12 4.5z' },
  { name: '口腔科', bg: '#ffedd6', color: '#ea580c', icon: 'M3 12h18M12 3v18' },
  { name: '皮肤科', bg: '#f3e8ff', color: '#9333ea', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z' },
  { name: '骨科', bg: '#cffafe', color: '#0891b2', icon: 'M19 8l-4 4 4 4M11 8l-4 4 4 4' }
])

const commonSymptoms = ['头痛头晕', '发烧发热', '咳嗽咳痰', '腹痛腹泻', '胸闷气短', '皮疹瘙痒', '视力模糊', '关节疼痛']

/* ========== 模拟数据库 ========== */
const mockDB = [
  { id: 'h1', type: 'hospital', name: '北京协和医院', sub: '三级甲等 · 东城区' },
  { id: 'h2', type: 'hospital', name: '北京儿童医院', sub: '三级甲等 · 西城区' },
  { id: 'h3', type: 'hospital', name: '北京大学口腔医院', sub: '三级甲等 · 海淀区' },
  { id: 'h4', type: 'hospital', name: '北京大学第一医院', sub: '三级甲等 · 西城区' },
  { id: 'd1', type: 'department', name: '心血管内科', sub: '内科' },
  { id: 'd2', type: 'department', name: '消化内科', sub: '内科' },
  { id: 'd3', type: 'department', name: '儿科', sub: '儿科' },
  { id: 'd4', type: 'department', name: '口腔科', sub: '口腔' },
  { id: 'd5', type: 'department', name: '皮肤科', sub: '皮肤' },
  { id: 'd6', type: 'department', name: '骨科', sub: '外科' },
  { id: 'd7', type: 'department', name: '眼科', sub: '眼科' },
  { id: 'doc1', type: 'doctor', name: '王明钦', sub: '心血管内科 · 主任医师' },
  { id: 'doc2', type: 'doctor', name: '秦申', sub: '儿科 · 主治医师' },
  { id: 'doc3', type: 'doctor', name: '覃识江', sub: '口腔科 · 副主任医师' },
  { id: 'dis1', type: 'disease', name: '高血压', sub: '心血管内科' },
  { id: 'dis2', type: 'disease', name: '糖尿病', sub: '内分泌科' },
  { id: 'dis3', type: 'disease', name: '感冒', sub: '呼吸内科' },
  { id: 'dis4', type: 'disease', name: '口腔溃疡', sub: '口腔科' }
]

/* ========== 症状→科室 智能匹配 ========== */
const triageMap = [
  { keywords: ['头痛', '头晕', '头疼', '偏头痛', '眩晕'], depts: ['神经内科', '心血管内科'] },
  { keywords: ['发烧', '发热', '高烧', '低烧'], depts: ['呼吸内科', '感染科', '急诊科'] },
  { keywords: ['咳嗽', '咳痰', '干咳', '痰多', '气喘'], depts: ['呼吸内科'] },
  { keywords: ['腹痛', '腹泻', '拉肚子', '肚子痛', '胃痛', '恶心', '呕吐'], depts: ['消化内科'] },
  { keywords: ['胸闷', '气短', '心悸', '胸痛', '心慌'], depts: ['心血管内科', '呼吸内科'] },
  { keywords: ['皮疹', '瘙痒', '湿疹', '荨麻疹', '痘痘'], depts: ['皮肤科'] },
  { keywords: ['视力', '模糊', '眼痛', '流泪', '红眼'], depts: ['眼科'] },
  { keywords: ['牙痛', '牙龈', '溃疡', '口臭', '牙齿'], depts: ['口腔科'] },
  { keywords: ['关节', '腰痛', '颈椎', '骨折', '扭伤'], depts: ['骨科', '外科'] },
  { keywords: ['儿童', '小孩', '宝宝', '婴儿'], depts: ['儿科'] },
  { keywords: ['月经', '妇科', '白带', '怀孕'], depts: ['妇产科'] },
  { keywords: ['失眠', '焦虑', '抑郁', '多梦'], depts: ['精神心理科', '神经内科'] }
]

const searchResults = computed(() => {
  if (!keyword.value || keyword.value.length < 1) return []
  const kw = keyword.value.toLowerCase()
  return mockDB.filter(item =>
    item.name.toLowerCase().includes(kw) ||
    (item.sub && item.sub.toLowerCase().includes(kw))
  ).slice(0, 10)
})

function onSearch() {
  if (!keyword.value) return toast('请输入搜索关键词')
  saveHistory(keyword.value)
  if (searchResults.value.length === 0) {
    toast('未找到相关结果')
  }
}

function saveHistory(text) {
  if (!text) return
  history.value = history.value.filter(h => h !== text)
  history.value.unshift(text)
  if (history.value.length > 10) history.value.pop()
  localStorage.setItem('luya_search_history', JSON.stringify(history.value))
}

function clearHistory() {
  history.value = []
  localStorage.removeItem('luya_search_history')
  toast('已清除搜索历史')
}

function tagSearch(text) {
  keyword.value = text
  saveHistory(text)
}

function goTriage() {
  triageMode.value = true
  keyword.value = ''
  searchResults.value  // trigger computed
}

function doTriage() {
  if (!symptom.value) return toast('请描述您的症状')
  const matched = []
  triageMap.forEach(rule => {
    rule.keywords.forEach(kw => {
      if (symptom.value.includes(kw)) {
        rule.depts.forEach(d => {
          if (!matched.find(m => m.name === d)) {
            matched.push({ name: d, rate: Math.floor(Math.random() * 20 + 80) })
          }
        })
      }
    })
  })
  if (matched.length === 0) {
    matched.push({ name: '全科', rate: 65 }, { name: '内科', rate: 58 })
  }
  // 按匹配度排序
  matched.sort((a, b) => b.rate - a.rate)
  triageResults.value = matched
  toast('智能导诊分析完成')
}

function quickSymptom(s) {
  symptom.value = s
  doTriage()
}

function goDept(dept) {
  toast('正在跳转：' + dept.name)
  setTimeout(() => router.push('/find?q=' + encodeURIComponent(dept.name)), 500)
}

function onResultClick(r) {
  saveHistory(keyword.value)
  if (r.type === 'doctor') {
    router.push('/doctor')
  } else if (r.type === 'hospital') {
    toast('查看医院：' + r.name)
  } else if (r.type === 'department') {
    router.push('/find?q=' + encodeURIComponent(r.name))
  } else {
    toast('查看疾病：' + r.name)
  }
}

function goBack() { router.back() }

function typeLabel(t) {
  return { hospital: '医院', department: '科室', doctor: '医生', disease: '疾病' }[t] || ''
}

function iconPath(t) {
  const paths = {
    hospital: 'M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
    department: 'M19 8l-4 4 4 4M11 8l-4 4 4 4',
    doctor: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    disease: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
  }
  return paths[t] || paths.disease
}

function highlight(text) {
  if (!keyword.value) return text
  const kw = keyword.value
  const idx = text.toLowerCase().indexOf(kw.toLowerCase())
  if (idx === -1) return text
  return text.slice(0, idx) + '<span style="color:var(--primary);font-weight:700">' + text.slice(idx, idx + kw.length) + '</span>' + text.slice(idx + kw.length)
}

onMounted(() => {
  try {
    history.value = JSON.parse(localStorage.getItem('luya_search_history') || '[]')
  } catch {
    history.value = []
  }
  // 从首页搜索面板跳转过来时，带入关键词
  const kw = route.query.kw
  if (kw && typeof kw === 'string') {
    keyword.value = kw
  }
  nextTick(() => {
    if (searchInputRef.value) searchInputRef.value.focus()
  })
})
</script>

<style scoped>
.search {
  background: var(--bg);
  min-height: 100vh;
}

/* ========== 搜索栏 ========== */
.search__nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  height: calc(52px + var(--safe-top));
  padding: var(--safe-top) 12px 0;
  background: linear-gradient(135deg, #2dd4a8 0%, #4adebf 100%);
}

.search__back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search__back svg { width: 20px; height: 20px; }

.search__bar {
  flex: 1;
  height: 36px;
  background: #fff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
}

.search__bar-icon { width: 18px; height: 18px; flex-shrink: 0; }

.search__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-main);
}

.search__clear { width: 18px; height: 18px; flex-shrink: 0; }
.search__clear svg { width: 18px; height: 18px; }

.search__btn {
  flex-shrink: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

/* ========== 滚动区 ========== */
.search__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ========== 智能导诊入口 ========== */
.search__triage {
  margin: 0;
}

.search__triage-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #e6faf4 0%, #d1fae5 100%);
  border: 1px solid #a7f3d0;
  cursor: pointer;
  transition: transform 0.15s;
}

.search__triage-card:active { transform: scale(0.98); }

.search__triage-icon { width: 48px; height: 48px; flex-shrink: 0; }
.search__triage-icon svg { width: 48px; height: 48px; }

.search__triage-info { flex: 1; }

.search__triage-title {
  font-size: 15px;
  font-weight: 700;
  color: #065f46;
}

.search__triage-desc {
  font-size: 12px;
  color: #047857;
  margin-top: 2px;
}

.search__triage-arrow { width: 20px; height: 20px; color: #0e9f7c; flex-shrink: 0; }

/* ========== 通用 section ========== */
.search__section {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: var(--shadow);
}

.search__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.search__section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
}

.search__clear-history {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-sub);
}

.search__clear-history svg { width: 14px; height: 14px; }

/* ========== 搜索标签 ========== */
.search__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search__tag {
  padding: 7px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-sub);
  background: #f3f4f6;
  transition: all 0.15s;
}

.search__tag:active { background: var(--primary-light); color: var(--primary); }

/* ========== 热门搜索 ========== */
.search__hot {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search__hot-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.search__hot-item:last-child { border-bottom: none; }

.search__hot-rank {
  width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-light);
  font-style: italic;
  flex-shrink: 0;
}

.search__hot-rank--top { color: #ef4444; }

.search__hot-text {
  flex: 1;
  font-size: 14px;
  color: var(--text-main);
}

.search__hot-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.search__hot-tag--hot { background: #fef2f2; color: #ef4444; }
.search__hot-tag--new { background: #eff6ff; color: #2563eb; }

/* ========== 分类浏览 ========== */
.search__cats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.search__cat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: 10px;
  transition: background 0.15s;
}

.search__cat:active { background: #f6f8fa; }

.search__cat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search__cat-icon svg { width: 20px; height: 20px; }

.search__cat-label { font-size: 12px; color: var(--text-sub); }

/* ========== 搜索结果 ========== */
.search__results {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: var(--shadow);
}

.search__results-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
}

.result-item:last-child { border-bottom: none; }
.result-item:active { background: #f9fafb; }

.result-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-item__icon svg { width: 20px; height: 20px; }

.result-item__icon--hospital { background: #fef2f2; color: #ef4444; }
.result-item__icon--department { background: #eff6ff; color: #2563eb; }
.result-item__icon--doctor { background: #e6faf4; color: #2dd4a8; }
.result-item__icon--disease { background: #fff7ed; color: #f59e0b; }

.result-item__main { flex: 1; min-width: 0; }

.result-item__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-item__sub {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}

.result-item__arrow { width: 18px; height: 18px; color: var(--text-light); flex-shrink: 0; }

/* ========== 智能导诊面板 ========== */
.search__triage-panel {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.triage-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.triage-input__area {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  resize: none;
  outline: none;
  color: var(--text-main);
  transition: border-color 0.2s;
}

.triage-input__area:focus { border-color: var(--primary); }

.triage-input__btn {
  height: 42px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  box-shadow: 0 3px 12px rgba(45, 212, 168, 0.3);
  transition: transform 0.15s;
}

.triage-input__btn:active { transform: scale(0.97); }

.triage-result {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.triage-result__title {
  font-size: 13px;
  color: var(--text-sub);
  margin-bottom: 10px;
}

.triage-result__chips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.triage-result__chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e6faf4 0%, #d1fae5 100%);
  border: 1px solid #a7f3d0;
  transition: transform 0.15s;
}

.triage-result__chip:active { transform: scale(0.97); }

.triage-result__chip-name {
  font-size: 15px;
  font-weight: 700;
  color: #065f46;
}

.triage-result__chip-rate {
  font-size: 12px;
  color: #0e9f7c;
  font-weight: 600;
}

.triage-result__tip {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-light);
}

.triage-quick {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.triage-quick__title {
  font-size: 13px;
  color: var(--text-sub);
  margin-bottom: 10px;
}

.triage-quick__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.triage-quick__chip {
  padding: 7px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-sub);
  background: #f3f4f6;
  transition: all 0.15s;
}

.triage-quick__chip:active { background: var(--primary-light); color: var(--primary); }

.search__safe-space { height: 20px; }
</style>
