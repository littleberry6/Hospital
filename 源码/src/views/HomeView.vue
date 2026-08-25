<template>
  <div class="page home">
    <PullToRefresh @refresh="handleRefresh">
      <!-- 顶部 Header -->
      <header class="home-header">
        <div class="home-header__top">
          <h1 class="home-header__title">
            绿芽健康
            <span class="home-header__city" @click="openRegion">· {{ cityShort }}</span>
          </h1>
          <svg class="icon icon-16 home-header__loc" viewBox="0 0 24 24" @click="openRegion">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 10-2.13-2.81-5-7.12-5-10z"/>
            <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
          </svg>
        </div>

        <div class="home-header__search" @click="openSearchPanel">
          <svg class="icon icon-18 home-header__search-icon" viewBox="0 0 24 24">
            <path fill="#9ca3af" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/>
          </svg>
          <input
            type="search"
            readonly
            class="home-header__input"
            placeholder="搜索医生、疾病、医院"
          />
          <!-- 热词快速入口 -->
          <button class="home-header__hot-pill" type="button" @click.stop="openSearchPanel">
            <svg class="home-header__hot-flame" viewBox="0 0 24 24">
              <path fill="#f97316" d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
            {{ hotWord }}
          </button>
        </div>
      </header>

      <!-- 金刚区卡片 -->
      <section class="quick-cards">
        <div class="quick-cards__main" @click="onCardClick('expert')">
          <div class="quick-cards__info">
            <h3 class="quick-cards__title">专家问诊</h3>
            <p class="quick-cards__desc">名医在线，快速问诊</p>
          </div>
          <div class="quick-cards__icon quick-cards__icon--ask">
            <svg viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.25)" />
              <text x="32" y="44" text-anchor="middle" fill="#fff" font-size="34" font-weight="bold">?</text>
            </svg>
          </div>
        </div>
        <div class="quick-cards__sub">
          <div class="quick-cards__sub-item quick-cards__sub-item--blue" @click="onCardClick('doctor')">
            <div>
              <h3 class="quick-cards__title">找医生</h3>
              <p class="quick-cards__desc">海量专家医生</p>
            </div>
            <svg class="quick-cards__sub-icon" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="rgba(255,255,255,0.2)" />
              <path fill="#fff" d="M32 14a10 10 0 0 0-10 10c0 4.97 4.5 9 10 9s10-4.03 10-9a10 10 0 0 0-10-10zm-16 28c0 4 8 8 16 8s16-4 16-8v-4H16v4z"/>
              <circle cx="48" cy="20" r="8" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
          <div class="quick-cards__sub-item quick-cards__sub-item--green" @click="onCardClick('medicine')">
            <div>
              <h3 class="quick-cards__title">在线买药</h3>
              <p class="quick-cards__desc">处方送到家</p>
            </div>
            <svg class="quick-cards__sub-icon" viewBox="0 0 64 64">
              <rect x="14" y="18" width="36" height="40" rx="6" fill="rgba(255,255,255,0.2)" />
              <rect x="22" y="28" width="20" height="6" rx="3" fill="#fff" />
              <rect x="29" y="21" width="6" height="20" rx="3" fill="#fff" />
            </svg>
          </div>
        </div>
      </section>

      <!-- 功能入口：单行横向滚动 -->
      <section class="feature-grid">
        <div class="feature-grid__track">
          <div
            v-for="item in features"
            :key="item.name"
            class="feature-grid__item"
            @click="onFeatureClick(item)"
          >
            <div class="feature-grid__icon" :style="{ background: item.bg }">
              <svg viewBox="0 0 48 48" v-html="item.svg"></svg>
            </div>
            <span class="feature-grid__label">{{ item.name }}</span>
          </div>
        </div>
        <div class="feature-grid__fade" aria-hidden="true"></div>
      </section>

      <!-- 热门科室 -->
      <section class="section departments">
        <div class="section__header">
          <h2 class="section__title">热门科室</h2>
          <span class="section__more" @click="onMoreClick">更多 ></span>
        </div>
        <div class="departments__grid">
          <div
            v-for="dept in departments"
            :key="dept.name"
            class="departments__item"
            @click="onDeptClick(dept)"
          >
            <div class="departments__icon" :style="{ color: dept.color }">
              <svg viewBox="0 0 48 48" v-html="dept.svg"></svg>
            </div>
            <span class="departments__name">{{ dept.name }}</span>
          </div>
        </div>
      </section>

      <!-- 医生/医院 Tab -->
      <section class="section doctor-section">
        <div class="tabs">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="tabs__item"
            :class="{ 'is-active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-bar__item" @click="openRegion">
            {{ regionLabel }}
            <svg class="icon icon-12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div class="filter-bar__item" @click="openDepartment">
            {{ departmentLabel }}
            <svg class="icon icon-12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div class="filter-bar__item" @click="cycleSort">
            {{ sortLabel }}
            <svg class="icon icon-12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div class="filter-bar__item" :class="{ 'is-active': filterActive }" @click="openFilter">
            筛选
            <span v-if="filterActive" class="filter-bar__dot" aria-hidden="true"></span>
            <svg v-if="!filterActive" class="icon icon-12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>

        <!-- 当前已选条件 chips -->
        <div v-if="activeChips.length" class="active-chips">
          <button
            v-for="c in activeChips"
            :key="c.key"
            type="button"
            class="active-chip"
            @click="c.onClear"
          >
            {{ c.label }}
            <svg class="icon icon-10" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="doctor-list">
          <SwipeItem
            v-for="(doctor, index) in displayedDoctors"
            :key="doctor.id"
            class="doctor-card-wrap"
            @delete="removeDoctor(index)"
          >
            <div class="doctor-card" @click="onDoctorCard(doctor)">
              <div class="doctor-card__avatar">
                <Avatar
                  :src="doctor.avatar"
                  :alt="doctor.name"
                />
              </div>
              <div class="doctor-card__info">
                <div class="doctor-card__row">
                  <h3 class="doctor-card__name">{{ doctor.name }}</h3>
                  <span class="doctor-card__star">
                    <svg class="icon icon-12" viewBox="0 0 24 24">
                      <path fill="#fbbf24" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {{ doctor.score }}
                  </span>
                </div>
                <p class="doctor-card__meta">
                  {{ doctor.hospital.name }}
                  <span class="doctor-card__level" :class="`is-${doctor.hospital.level}`">
                    {{ doctor.hospital.levelLabel }}
                  </span>
                </p>
                <p class="doctor-card__meta">
                  {{ doctor.hospital.city }} {{ doctor.hospital.county }} · {{ doctor.distance }} km
                </p>
                <p class="doctor-card__meta">
                  {{ doctor.department }} · {{ doctor.title }} · {{ doctor.age }}岁 · 从业{{ doctor.years }}年
                </p>
              </div>
              <button class="doctor-card__btn" @click.stop="onBook(doctor)">预约</button>
            </div>
          </SwipeItem>
        </div>

        <div v-if="!displayedDoctors.length" class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="28" fill="#f3f4f6"/>
            <path d="M22 32h20" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 22v20" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <p class="empty-state__text">未找到符合条件的医生</p>
          <p class="empty-state__hint">试试调整筛选条件或地区</p>
        </div>

        <div v-if="loadingMore" class="load-more flex-center">
          <span class="load-more__spinner"></span>
          <span>加载中...</span>
        </div>
        <div v-else-if="noMore && displayedDoctors.length" class="no-more">没有更多了 · 共 {{ displayedDoctors.length }} 位</div>
      </section>

      <!-- 底部占位，避免被 Tabbar 遮挡 -->
      <div class="safe-pad"></div>
    </PullToRefresh>

    <!-- 省/市/县三级级联选择器 -->
    <RegionPicker
      v-model="showRegionPicker"
      :value="region"
      @confirm="onRegionConfirm"
      @clear="onRegionClear"
    />

    <!-- 科室下拉选择器 -->
    <DepartmentPicker
      v-model="showDeptPicker"
      :departments="commonDepartments"
      :value="department"
      @confirm="onDeptConfirm"
      @clear="onDeptClear"
    />

    <!-- 多维筛选面板 -->
    <FilterSheet
      v-model="showFilterSheet"
      :value="filterForm"
      @confirm="onFilterConfirm"
      @reset="onFilterReset"
    />

    <!-- 首页搜索面板（热词 + 提示词 + 搜索历史） -->
    <HomeSearchPanel v-model:visible="showSearchPanel" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import Avatar from '@/components/Avatar.vue'
import RegionPicker from '@/components/RegionPicker.vue'
import DepartmentPicker from '@/components/DepartmentPicker.vue'
import FilterSheet from '@/components/FilterSheet.vue'
import HomeSearchPanel from '@/components/HomeSearchPanel.vue'
import { debounce, throttle } from '@/utils/debounceThrottle'
import { toast } from '@/utils/toast'
import { hotWords } from '@/utils/searchStore'
import { regions, commonDepartments, distanceOptions, ratingOptions, hospitalLevels } from '@/data/regions'
import { generateHospitals } from '@/data/hospitals'

import avatarMale45 from '@/assets/avatars/doctor-male-45.png'
import avatarFemale35 from '@/assets/avatars/doctor-female-35.png'
import avatarMale55 from '@/assets/avatars/doctor-male-55.png'
import avatarFemale50 from '@/assets/avatars/doctor-female-50.png'
import avatarMale30 from '@/assets/avatars/doctor-male-30.png'
import avatarFemale42 from '@/assets/avatars/doctor-female-42.png'

const searchText = ref('')
const activeTab = ref('doctor')
const loadingMore = ref(false)
const noMore = ref(false)

const router = useRouter()

/* ========== 首页搜索面板 ========== */
const showSearchPanel = ref(false)

/* 顶部搜索框热词轮换 */
const hotWordList = hotWords.map(w => w.text)
const hotWordIdx = ref(0)
const hotWord = ref(hotWordList[0] || '热门搜索')
let hotWordTimer = null

function startHotWordRotation() {
  stopHotWordRotation()
  hotWordTimer = setInterval(() => {
    hotWordIdx.value = (hotWordIdx.value + 1) % hotWordList.length
    hotWord.value = hotWordList[hotWordIdx.value]
  }, 3500)
}

function stopHotWordRotation() {
  if (hotWordTimer) {
    clearInterval(hotWordTimer)
    hotWordTimer = null
  }
}

/* 点击搜索栏打开搜索面板（热词 + 提示词 + 搜索历史） */
function openSearchPanel() {
  showSearchPanel.value = true
}

// 筛选器状态
const region = ref({ province: '', city: '', county: '' })
const department = ref('')
const filterForm = ref({ distance: 'all', rating: 'all', level: 'all' })

// 选择器显示态
const showRegionPicker = ref(false)
const showDeptPicker = ref(false)
const showFilterSheet = ref(false)

// 排序
const sortList = [
  { key: 'default', label: '综合' },
  { key: 'score', label: '评分' },
  { key: 'years', label: '资历' }
]
const sortIdx = ref(0)

const tabs = [
  { key: 'doctor', label: '医生' },
  { key: 'hospital', label: '医院' }
]

const features = [
  {
    name: '预约挂号',
    bg: '#f0fdf9',
    svg: '<rect x="8" y="10" width="32" height="30" rx="4" fill="none" stroke="#2dd4a8" stroke-width="3"/><path d="M8 20h32M16 6v8M32 6v8" stroke="#2dd4a8" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="30" r="5" fill="#2dd4a8"/>'
  },
  {
    name: '疾病百科',
    bg: '#e6faf4',
    svg: '<circle cx="24" cy="24" r="18" fill="none" stroke="#2dd4a8" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="#2dd4a8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6" stroke="#2dd4a8" stroke-width="3" stroke-linecap="round"/>'
  },
  {
    name: '疫苗预约',
    bg: '#eff6ff',
    svg: '<path d="M30 8L40 18 18 40 8 30l22-22z" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/><path d="M14 34l4 4M20 16l12 12" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="14" r="4" fill="#3b82f6"/>'
  },
  {
    name: '体检预约',
    bg: '#fff7ed',
    svg: '<rect x="10" y="6" width="28" height="36" rx="4" fill="none" stroke="#f97316" stroke-width="3"/><path d="M16 16h16M16 24h12M16 32h8" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>'
  },
  {
    name: '药品百科',
    bg: '#f0fdf4',
    svg: '<rect x="14" y="10" width="20" height="28" rx="6" fill="none" stroke="#22c55e" stroke-width="3"/><path d="M24 18v12M18 24h12" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>'
  }
]

const departments = [
  { name: '皮肤科', color: '#2dd4a8', svg: '<path d="M24 6c-8 8-8 20 0 28M24 6c8 8 8 20 0 28" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="24" cy="20" r="3" fill="currentColor"/>' },
  { name: '呼吸内科', color: '#60a5fa', svg: '<path d="M28 6c8 4 10 14 4 20-4 4-8 4-8 10M20 6c-8 4-10 14-4 20 4 4 8 4 8 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { name: '儿科', color: '#fbbf24', svg: '<circle cx="24" cy="18" r="8" fill="currentColor"/><path d="M12 42c0-8 5-14 12-14s12 6 12 14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { name: '口腔科', color: '#a78bfa', svg: '<path d="M16 14c0-4 4-6 8-6s8 2 8 6c0 6-4 10-4 16 0 4-2 8-4 8s-4-4-4-8c0-6-4-10-4-16z" fill="currentColor"/>' },
  { name: '妇产科', color: '#f472b6', svg: '<circle cx="24" cy="16" r="8" fill="currentColor"/><path d="M24 26v14M18 36h12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  { name: '眼科', color: '#38bdf8', svg: '<path d="M8 24c8-10 24-10 32 0-8 10-24 10-32 0z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="currentColor"/>' },
  { name: '消化内科', color: '#fb923c', svg: '<path d="M14 10c12 0 18 8 14 18-2 6-8 8-8 8" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { name: '耳鼻喉科', color: '#34d399', svg: '<path d="M24 8v28M18 14c-6 0-10 6-6 12M30 14c6 0 10 6 6 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { name: '心脏内科', color: '#f87171', svg: '<path d="M24 42s-16-10-16-20c0-6 4-10 10-10 4 0 6 2 6 2s2-2 6-2c6 0 10 4 10 10 0 10-16 20-16 20z" fill="currentColor"/>' },
  { name: '传染内科', color: '#a3e635', svg: '<circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="3"/><path d="M16 16l16 16M32 16L16 32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' }
]

const localAvatars = [
  avatarMale45,
  avatarFemale35,
  avatarMale55,
  avatarFemale50,
  avatarMale30,
  avatarFemale42
]

/* ========== 数据生成 ========== */

// 全部医院（一次性生成）
const allHospitals = ref([])

// 全部医生：每个医院绑定 1-4 名医生
const allDoctors = ref([])

function regenerateDoctors() {
  // 生成医院（首次慢一些，之后缓存）
  if (!allHospitals.value.length) {
    allHospitals.value = generateHospitals()
  }
  const hospitals = allHospitals.value
  const names = ['王明钦', '秦冉', '覃议江', '李思远', '张晓峰', '陈雨桐', '刘浩然', '赵静怡', '周明辉', '吴若兰', '郑子轩', '黄嘉怡', '孙若曦', '徐子涵', '马宇辰']
  const titles = ['住院医师', '主治医师', '副主任医师', '主任医师']
  const list = []
  hospitals.forEach((h, hi) => {
    // 每家医院 1-4 位医生
    const docCount = 1 + Math.floor(Math.random() * 4)
    for (let i = 0; i < docCount; i++) {
      const age = 30 + Math.floor(Math.random() * 31)
      const maxYears = Math.max(3, age - 26)
      const years = 3 + Math.floor(Math.random() * (maxYears - 3 + 1))
      // 每个医院的科室从 commonDepartments 里取
      const dept = commonDepartments[Math.floor(Math.random() * commonDepartments.length)]
      // 医生个人评分（4.5-5.0 之间）
      const score = (4.5 + Math.random() * 0.5).toFixed(1)
      list.push({
        id: `doc_${list.length}_${hi}_${i}`,
        name: names[(hi + i) % names.length],
        hospital: h,
        department: dept,
        title: titles[Math.min(3, Math.floor(years / 5))],
        score,
        age,
        years,
        distance: h.distance,
        avatar: localAvatars[(hi + i) % localAvatars.length]
      })
    }
  })
  return list
}

/* ========== 筛选计算 ========== */

const regionLabel = computed(() => {
  if (!region.value.province) return '全国'
  if (region.value.county) return region.value.county
  if (region.value.city) return region.value.city
  return region.value.province
})

const departmentLabel = computed(() => {
  return department.value || '科室'
})

const sortLabel = computed(() => sortList[sortIdx.value].label)

const cityShort = computed(() => {
  return region.value.city || region.value.province || '深圳'
})

const filterActive = computed(() => {
  const f = filterForm.value
  return f.distance !== 'all' || f.rating !== 'all' || f.level !== 'all'
})

// 已选条件 chip
const activeChips = computed(() => {
  const chips = []
  if (region.value.province) {
    const label = region.value.county
      ? `${region.value.province} ${region.value.city} ${region.value.county}`
      : region.value.city
        ? `${region.value.province} ${region.value.city}`
        : region.value.province
    chips.push({
      key: 'region',
      label,
      onClear: () => (region.value = { province: '', city: '', county: '' })
    })
  }
  if (department.value) {
    chips.push({
      key: 'dept',
      label: department.value,
      onClear: () => (department.value = '')
    })
  }
  const f = filterForm.value
  const distOpt = distanceOptions.find((d) => d.key === f.distance)
  if (distOpt && distOpt.key !== 'all') {
    chips.push({ key: 'dist', label: distOpt.label, onClear: () => (filterForm.value.distance = 'all') })
  }
  const rateOpt = ratingOptions.find((r) => r.key === f.rating)
  if (rateOpt && rateOpt.key !== 'all') {
    chips.push({ key: 'rate', label: rateOpt.label, onClear: () => (filterForm.value.rating = 'all') })
  }
  const lvOpt = hospitalLevels.find((l) => l.key === f.level)
  if (lvOpt && lvOpt.key !== 'all') {
    chips.push({ key: 'level', label: lvOpt.label, onClear: () => (filterForm.value.level = 'all') })
  }
  return chips
})

// 过滤后的医生
const filteredDoctors = computed(() => {
  let list = allDoctors.value
  // 地区
  if (region.value.county) {
    list = list.filter((d) => d.hospital.county === region.value.county)
  } else if (region.value.city) {
    list = list.filter((d) => d.hospital.city === region.value.city)
  } else if (region.value.province) {
    list = list.filter((d) => d.hospital.province === region.value.province)
  }
  // 科室
  if (department.value) {
    list = list.filter((d) => d.department === department.value)
  }
  // 多维筛选
  const f = filterForm.value
  if (f.distance !== 'all') {
    const max = distanceOptions.find((d) => d.key === f.distance)?.max ?? Infinity
    list = list.filter((d) => d.hospital.distance <= max)
  }
  if (f.rating !== 'all') {
    const min = ratingOptions.find((r) => r.key === f.rating)?.min ?? 0
    list = list.filter((d) => +d.score >= min)
  }
  if (f.level !== 'all') {
    list = list.filter((d) => d.hospital.level === f.level)
  }
  // 关键词
  if (searchText.value.trim()) {
    const kw = searchText.value.trim().toLowerCase()
    list = list.filter((d) =>
      d.name.includes(kw) ||
      d.department.includes(kw) ||
      d.hospital.name.toLowerCase().includes(kw)
    )
  }
  // 排序
  const sortKey = sortList[sortIdx.value].key
  if (sortKey === 'score') {
    list = [...list].sort((a, b) => +b.score - +a.score)
  } else if (sortKey === 'years') {
    list = [...list].sort((a, b) => b.years - a.years)
  }
  return list
})

const displayedDoctors = computed(() => {
  // 应用分页
  return filteredDoctors.value.slice(0, page.value * pageSize)
})

/* ========== 状态 ========== */
const page = ref(1)
const pageSize = 8

watch(filteredDoctors, () => {
  // 过滤条件变了，重置分页
  page.value = 1
  noMore.value = false
})

/* ========== 事件 ========== */

const morePath = (title) => '/more/' + encodeURIComponent(title)

const onCardClick = (type) => {
  if (type === 'expert') router.push('/inquiry')
  else if (type === 'doctor') router.push('/find')
  else if (type === 'medicine') toast('在线买药功能即将上线')
}

const onFeatureClick = (item) => {
  if (item.name === '预约挂号') return router.push('/booking')
  if (item.name === '疫苗预约') return router.push({ path: '/appointment', query: { tab: 'vaccine' } })
  if (item.name === '体检预约') return router.push({ path: '/appointment', query: { tab: 'checkup' } })
  router.push(morePath(item.name))
}

const onDeptClick = (dept) => {
  router.push({ path: '/inquiry', query: { dept: dept.name } })
}

const onBook = (doctor) => {
  router.push({ path: '/appointment', query: { tab: 'inquiry' } })
}

const onDoctorCard = (doctor) => {
  router.push('/doctor/' + encodeURIComponent(doctor.id))
}

const onMoreClick = () => {
  router.push('/find')
}

// 打开省/市/县选择器
function openRegion() {
  showRegionPicker.value = true
}

// 打开科室选择器
function openDepartment() {
  showDeptPicker.value = true
}

// 切换排序
function cycleSort() {
  sortIdx.value = (sortIdx.value + 1) % sortList.length
  toast('排序：' + sortList[sortIdx.value].label)
}

// 打开筛选
function openFilter() {
  showFilterSheet.value = true
}

// 地区选择回调
function onRegionConfirm(v) {
  region.value = { ...v }
  if (v.county) {
    toast('已定位：' + v.province + ' ' + v.city + ' ' + v.county)
  } else if (v.city) {
    toast('已定位：' + v.province + ' ' + v.city)
  } else if (v.province) {
    toast('已定位：' + v.province)
  } else {
    toast('已切换：全国')
  }
}

function onRegionClear() {
  region.value = { province: '', city: '', county: '' }
  toast('已切换：全国')
}

// 科室选择回调
function onDeptConfirm(v) {
  department.value = v
  if (v) toast('已选择：' + v)
  else toast('已取消科室筛选')
}

function onDeptClear() {
  department.value = ''
}

// 筛选面板回调
function onFilterConfirm(v) {
  filterForm.value = { ...v }
  const count = ['distance', 'rating', 'level'].filter((k) => v[k] !== 'all').length
  toast(count > 0 ? `已应用 ${count} 项筛选条件` : '已重置筛选')
}

function onFilterReset() {
  filterForm.value = { distance: 'all', rating: 'all', level: 'all' }
  toast('筛选已重置')
}

/* ========== 搜索 ========== */

const onSearchInput = debounce(() => {
  // 触发 filteredDoctors 重算（依赖 searchText）
}, 300)

/* ========== 列表分页与下拉刷新 ========== */

const handleRefresh = (done) => {
  setTimeout(() => {
    page.value = 1
    noMore.value = false
    allDoctors.value = regenerateDoctors()
    done()
  }, 800)
}

const loadMore = throttle(() => {
  if (loadingMore.value || noMore.value) return
  const total = filteredDoctors.value.length
  if (page.value * pageSize >= total) {
    noMore.value = true
    return
  }
  loadingMore.value = true
  setTimeout(() => {
    page.value += 1
    loadingMore.value = false
  }, 600)
}, 300)

const onScroll = () => {
  const scrollEl = document.querySelector('.pull-refresh')
  if (!scrollEl) return
  const { scrollTop, scrollHeight, clientHeight } = scrollEl
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore()
  }
}

const removeDoctor = (index) => {
  // 计算全局索引（分页后）
  const realIndex = (page.value - 1) * pageSize + index
  if (realIndex < allDoctors.value.length) {
    allDoctors.value.splice(realIndex, 1)
  }
}

onMounted(() => {
  // 初始化数据
  if (!allDoctors.value.length) {
    allDoctors.value = regenerateDoctors()
  }
  // 启动搜索框热词轮换
  startHotWordRotation()
  const scrollEl = document.querySelector('.pull-refresh')
  if (scrollEl) {
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  stopHotWordRotation()
  const scrollEl = document.querySelector('.pull-refresh')
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.home {
  background: var(--bg);
}

.home-header {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  padding: calc(var(--safe-top) + 12px) 16px 20px;
  color: #fff;
}

.home-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.home-header__title {
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-header__city {
  font-size: 15px;
  font-weight: 500;
  opacity: 0.95;
  cursor: pointer;
  transition: opacity 0.15s;
}

.home-header__city:active {
  opacity: 0.7;
}

.home-header__loc {
  opacity: 0.9;
  cursor: pointer;
}

.home-header__search {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 8px 14px;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.home-header__search-icon {
  flex-shrink: 0;
}

.home-header__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-main);
  background: transparent;
}

.home-header__input::placeholder {
  color: var(--text-light);
}

/* 热词快速入口 pill */
.home-header__hot-pill {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  max-width: 132px;
  padding: 3px 10px;
  border: none;
  background: rgba(45, 212, 168, 0.12);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: var(--primary-dark);
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}

.home-header__hot-pill:active {
  background: rgba(45, 212, 168, 0.22);
}

.home-header__hot-flame {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* 金刚区卡片 */
.quick-cards {
  margin: -10px 16px 16px;
  display: flex;
  gap: 10px;
  height: 170px;
}

.quick-cards__main {
  flex: 1;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.quick-cards__title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}

.quick-cards__desc {
  font-size: 12px;
  opacity: 0.9;
}

.quick-cards__icon--ask svg {
  width: 64px;
  height: 64px;
}

.quick-cards__icon--ask {
  align-self: flex-end;
  margin-bottom: -8px;
}

.quick-cards__sub {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-cards__sub-item {
  flex: 1;
  border-radius: var(--radius);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.quick-cards__sub-item--blue {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.quick-cards__sub-item--green {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.quick-cards__sub-icon {
  flex-shrink: 0;
  opacity: 0.95;
  width: 48px;
  height: 48px;
}

.quick-cards__sub-icon svg {
  width: 48px;
  height: 48px;
}

/* 功能入口：单行横向滚动（一次显示 4 个，第 5 个左滑露出） */
.feature-grid {
  margin: 0 16px 16px;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 18px 0;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.feature-grid__track {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 0 8px;
}

.feature-grid__track::-webkit-scrollbar {
  display: none;
}

.feature-grid__item {
  flex: 0 0 25%;          /* 每个 item 占可视区 1/4，4 个铺满 */
  min-width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  scroll-snap-align: start;
  cursor: pointer;
}

.feature-grid__item:active {
  opacity: 0.75;
}

/* 右侧渐隐蒙层，提示可横向滚动 */
.feature-grid__fade {
  position: absolute;
  top: 0;
  right: 0;
  width: 56px;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    var(--card-bg) 100%
  );
  pointer-events: none;
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
}

.feature-grid__icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-grid__icon :deep(svg) {
  width: 28px;
  height: 28px;
}

.feature-grid__label {
  font-size: 12px;
  color: var(--text-main);
}

/* 通用 Section */
.section {
  margin: 0 16px 16px;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow);
}

.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section__title {
  font-size: 16px;
  font-weight: 700;
}

.section__more {
  font-size: 13px;
  color: var(--text-sub);
}

/* 热门科室 */
.departments__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px 8px;
}

.departments__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.departments__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.departments__icon :deep(svg) {
  width: 28px;
  height: 28px;
}

.departments__name {
  font-size: 11px;
  color: var(--text-main);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 10px;
}

.tabs__item {
  font-size: 16px;
  color: var(--text-sub);
  font-weight: 600;
  position: relative;
}

.tabs__item.is-active {
  color: var(--text-main);
}

.tabs__item.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
}

/* 筛选器 */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--text-sub);
}

.filter-bar__item {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 4px 2px;
  border-radius: 4px;
  transition: color 0.15s;
}

.filter-bar__item.is-active {
  color: var(--primary-dark);
  font-weight: 600;
}

.filter-bar__item:active {
  opacity: 0.7;
}

.filter-bar__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  margin-left: 4px;
}

/* 已选条件 chips */
.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.active-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(45, 212, 168, 0.12);
  color: var(--primary-dark);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.active-chip .icon-10 {
  width: 10px;
  height: 10px;
  opacity: 0.7;
}

.active-chip:active {
  background: rgba(45, 212, 168, 0.18);
}

/* 医生列表 */
.doctor-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.doctor-card-wrap {
  background: var(--card-bg);
}

.doctor-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  margin: 0 14px;
}

.doctor-card__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}

.doctor-card__info {
  flex: 1;
  min-width: 0;
}

.doctor-card__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.doctor-card__name {
  font-size: 15px;
  font-weight: 600;
}

.doctor-card__star {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: var(--text-sub);
}

.doctor-card__meta {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.6;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.doctor-card__level {
  display: inline-block;
  padding: 0 6px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

.doctor-card__level.is-3A {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.doctor-card__level.is-3B {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.doctor-card__level.is-2A {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.doctor-card__level.is-2B {
  background: linear-gradient(135deg, #a3e635 0%, #84cc16 100%);
}

.doctor-card__btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 16px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 13px;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  padding: 40px 16px 30px;
  text-align: center;
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}

.empty-state__text {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 4px;
}

.empty-state__hint {
  font-size: 12px;
  color: var(--text-light);
}

/* 加载/没有更多 */
.load-more,
.no-more {
  padding: 16px 0;
  color: var(--text-light);
  font-size: 13px;
  text-align: center;
}

.load-more__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e5e7eb;
  border-top-color: var(--primary);
  border-radius: 50%;
  margin-right: 6px;
  animation: rotate 0.8s linear infinite;
}

.safe-pad {
  height: 30px;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* flex-center 工具 */
:deep(.flex-center) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>