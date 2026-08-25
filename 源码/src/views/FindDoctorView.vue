<template>
  <div class="find-page">
    <!-- 沉浸式头部 -->
    <header class="find-header">
      <button class="header__back" type="button" aria-label="返回" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="header__title">找医生</h1>
      <span class="header__right" aria-hidden="true"></span>
    </header>

    <!-- 搜索框（悬浮在头部下方） -->
    <div class="search-wrap">
      <div class="search" @click="onSearchClick" role="search">
        <span class="search__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
            <path
              d="M16 16l4 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              fill="none"
            />
          </svg>
        </span>
        <input
          ref="searchInputRef"
          v-model="keyword"
          class="search__input"
          type="search"
          enterkeyhint="search"
          :placeholder="searchHint"
          @keyup.enter="onSearch"
        />
      </div>
    </div>

    <!-- 内容区 -->
    <PullToRefresh class="find-pull" @refresh="handleRefresh">
      <!-- 2 个 banner -->
      <section class="banners" aria-label="专题卡片">
        <article
          v-for="b in banners"
          :key="b.id"
          class="banner"
          :style="{ background: b.bg, color: b.fg }"
          @click="onBanner(b)"
        >
          <div class="banner__text">
            <div class="banner__title-row">
              <h2 class="banner__title">{{ b.title }}</h2>
              <span class="banner__tag" :style="{ background: b.tagBg, color: b.tagFg }">
                {{ b.tag }}
              </span>
            </div>
            <p class="banner__desc">{{ b.text }}</p>
          </div>
          <div class="banner__decor" v-html="b.decor" aria-hidden="true"></div>
        </article>
      </section>

      <!-- 热门医院（横向滚动） -->
      <section class="block">
        <header class="block__head">
          <h3 class="block__title">
            <span class="block__bar" aria-hidden="true"></span>
            热门医院
          </h3>
          <button class="block__more" type="button" @click="onMore('hospitals')">
            更多<span aria-hidden="true">››</span>
          </button>
        </header>
        <div class="h-scroll">
          <SwipeItem
            v-for="h in hospitals"
            :key="h.id"
            class="hospital-card-wrap"
            @swipeLeft="onHospitalRemove(h.id)"
          >
            <article class="hospital-card" @click="onHospital(h)">
              <div class="hospital-card__img" v-html="h.svg" aria-hidden="true"></div>
              <h4 class="hospital-card__name ellipsis">{{ h.name }}</h4>
              <div class="hospital-card__tags">
                <span class="h-tag h-tag--rank">
                  <i class="h-tag__dot" aria-hidden="true"></i>
                  {{ h.level }}
                </span>
                <span class="h-tag h-tag--type ellipsis">{{ h.type }}</span>
              </div>
            </article>
          </SwipeItem>
        </div>
      </section>

      <!-- 热门科室（横向滚动 chips） -->
      <section class="block">
        <header class="block__head">
          <h3 class="block__title">
            <span class="block__bar" aria-hidden="true"></span>
            热门科室
          </h3>
          <button class="block__more" type="button" @click="onMore('departments')">
            更多<span aria-hidden="true">››</span>
          </button>
        </header>
        <div class="d-scroll">
          <button
            v-for="d in departments"
            :key="d.key"
            type="button"
            class="dept"
            :style="{ color: d.color }"
            @click="onDept(d)"
          >
            <span class="dept__icon" v-html="d.svg" aria-hidden="true"></span>
            <span class="dept__name">{{ d.name }}</span>
          </button>
        </div>
      </section>

      <!-- 热门医生（3 列 grid） -->
      <section class="block">
        <header class="block__head">
          <h3 class="block__title">
            <span class="block__bar" aria-hidden="true"></span>
            热门医生
          </h3>
          <button class="block__more" type="button" @click="onMore('doctors')">
            更多<span aria-hidden="true">››</span>
          </button>
        </header>
        <div class="doc-grid">
          <SwipeItem
            v-for="d in displayedDoctors"
            :key="d.id"
            class="doc-card-wrap"
            @swipeLeft="onDoctorRemove(d.id)"
          >
            <article class="doc-card" @click="onDoctor(d)">
              <LazyImage class="doc-card__avatar" :src="d.avatar" :alt="d.name" />
              <h4 class="doc-card__name">{{ d.name }}</h4>
              <p class="doc-card__hospital ellipsis">{{ d.hospital }}</p>
              <p class="doc-card__dept ellipsis">{{ d.department }}</p>
              <div class="doc-card__meta">
                <span class="doc-card__star" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path
                      d="M6 1l1.6 3.2 3.6.5-2.6 2.5.6 3.5L6 9.1l-3.2 1.7.6-3.5L.8 4.7l3.6-.5L6 1z"
                      fill="#fbbf24"
                    />
                  </svg>
                </span>
                <span class="doc-card__score">{{ d.score }}</span>
                <span class="doc-card__years">从业{{ d.years }}年</span>
              </div>
            </article>
          </SwipeItem>
        </div>
      </section>

      <div v-if="!hotDoctors.length" class="find-empty">
        <span aria-hidden="true">🩺</span>
        <p>暂无内容，下拉刷新试试</p>
      </div>

      <div class="safe-bottom" aria-hidden="true"></div>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import LazyImage from '@/components/LazyImage.vue'
import { toast } from '@/utils/toast'
import {
  searchHint,
  banners,
  hotHospitals,
  hotDepartments,
  hotDoctors
} from './findDoctorMock'

const router = useRouter()

const morePath = (title) => '/more/' + encodeURIComponent(title)

const keyword = ref('')
const searchInputRef = ref(null)

/* 可变数据 - 用于左滑删除 / 搜索过滤 */
const hospitals = ref([...hotHospitals])
const departments = ref([...hotDepartments])
const doctors = ref([...hotDoctors])

const displayedDoctors = computed(() => {
  if (!keyword.value.trim()) return doctors.value
  const q = keyword.value.trim().toLowerCase()
  return doctors.value.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q)
  )
})

/* 事件 */
function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

function onSearchClick() {
  searchInputRef.value?.focus()
}

function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  toast(`已为你匹配到 ${displayedDoctors.value.length} 位医生`)
}

function onBanner(b) {
  if (b.id === 'b1') router.push({ path: '/appointment', query: { tab: 'vaccine' } })
  else if (b.id === 'b2') router.push({ path: '/appointment', query: { tab: 'checkup' } })
  else router.push(morePath(b.title))
}

function onMore(section) {
  if (section === 'departments') router.push('/inquiry')
  else if (section === 'doctors') router.push('/inquiry')
  else router.push(morePath('热门医院'))
}

function onDept(d) {
  router.push({ path: '/inquiry', query: { dept: d.name } })
}

function onHospital(h) {
  router.push(morePath(h.name))
}

function onDoctor(d) {
  router.push('/doctor/' + d.id)
}

/* 左滑删除 */
function onHospitalRemove(id) {
  const i = hospitals.value.findIndex((x) => x.id === id)
  if (i > -1) hospitals.value.splice(i, 1)
}

function onDoctorRemove(id) {
  const i = doctors.value.findIndex((x) => x.id === id)
  if (i > -1) doctors.value.splice(i, 1)
}

/* 下拉刷新 */
async function handleRefresh(done) {
  await new Promise((r) => setTimeout(r, 600))
  hospitals.value = [...hotHospitals]
  doctors.value = [...hotDoctors]
  done && done()
}
</script>

<style scoped>
.find-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg, #f5f7f8);
}

/* ========== 头部 ========== */
.find-header {
  flex: none;
  height: calc(env(safe-top, 0px) + 48px);
  padding-top: env(safe-top, 0px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header__back,
.header__right {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  color: inherit;
}

.header__back svg {
  width: 22px;
  height: 22px;
}

.header__back:active {
  transform: scale(0.92);
}

.header__title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ========== 搜索框（悬浮） ========== */
.search-wrap {
  padding: 0 16px;
  margin-top: -22px;
  position: relative;
  z-index: 5;
}

@media (min-width: 481px) {
  .search-wrap {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
}

.search__icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  display: inline-flex;
}

.search__icon svg {
  width: 100%;
  height: 100%;
}

.search__input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  color: #0f172a;
}

.search__input::placeholder {
  color: #94a3b8;
}

/* ========== 内容滚动容器 ========== */
.find-pull {
  flex: 1;
  display: block;
  padding: 12px 0 24px;
  background: var(--bg, #f5f7f8);
}

/* ========== Banners ========== */
.banners {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 12px 16px 0;
}

@media (min-width: 481px) {
  .banners {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.banner {
  position: relative;
  height: 96px;
  border-radius: 14px;
  padding: 14px;
  overflow: hidden;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.18s ease;
}

.banner:active {
  transform: scale(0.98);
}

.banner__title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.banner__title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.5px;
}

.banner__tag {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.4px;
}

.banner__desc {
  font-size: 11px;
  margin: 0;
  opacity: 0.7;
  line-height: 1.4;
  padding-right: 36px;
}

.banner__decor {
  position: absolute;
  right: -8px;
  bottom: -4px;
  width: 88px;
  height: 64px;
  pointer-events: none;
}

.banner__decor :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ========== Block（公用） ========== */
.block {
  padding: 16px 0 4px;
}

.block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 8px;
}

@media (min-width: 481px) {
  .block__head {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.block__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.block__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--primary, #2dd4a8);
}

.block__more {
  background: transparent;
  border: 0;
  font-size: 12px;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
}

.block__more:active {
  color: var(--primary, #2dd4a8);
}

/* ========== 热门医院 横向滚动 ========== */
.h-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 0 16px 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.h-scroll::-webkit-scrollbar {
  display: none;
}

@media (min-width: 481px) {
  .h-scroll {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.hospital-card-wrap {
  flex: 0 0 130px;
  background: #fff;
  border-radius: 12px;
  padding: 8px 8px 10px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  text-align: left;
  cursor: pointer;
}

.hospital-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hospital-card__img {
  width: 100%;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
}

.hospital-card__img :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.hospital-card__name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.hospital-card__tags {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  align-items: center;
}

.h-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  flex: 0 1 auto;
  white-space: nowrap;
  min-width: 0;
}

.h-tag--rank {
  background: #dcfce7;
  color: #15803d;
  gap: 3px;
}

.h-tag--rank .h-tag__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #16a34a;
}

.h-tag--type {
  background: #f1f5f9;
  color: #64748b;
}

/* ========== 热门科室 横向滚动 chips ========== */
.d-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 16px 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.d-scroll::-webkit-scrollbar {
  display: none;
}

@media (min-width: 481px) {
  .d-scroll {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.dept {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.dept__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s ease;
}

.dept__icon :deep(svg) {
  width: 28px;
  height: 28px;
  color: #fff;
}

.dept:active .dept__icon {
  transform: scale(0.94);
}

.dept__name {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}

/* ========== 热门医生 3 列 grid ========== */
.doc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 16px;
}

@media (min-width: 481px) {
  .doc-grid {
    padding-left: 24px;
    padding-right: 24px;
  }
}

.doc-card-wrap {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.doc-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
}

.doc-card__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ecfdf5;
  overflow: hidden;
  margin-bottom: 8px;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.08);
}

.doc-card__name {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  line-height: 1.2;
}

.doc-card__hospital,
.doc-card__dept {
  font-size: 11px;
  color: #94a3b8;
  margin: 2px 0 0;
  line-height: 1.4;
  width: 100%;
  padding: 0 4px;
}

.doc-card__meta {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.doc-card__star {
  width: 12px;
  height: 12px;
  display: inline-flex;
}

.doc-card__star svg {
  width: 100%;
  height: 100%;
}

.doc-card__score {
  color: #f59e0b;
  font-weight: 700;
}

/* ========== 空状态 ========== */
.find-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 16px 36px;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

/* ========== 安全区 ========== */
.safe-bottom {
  height: env(safe-bottom, 0px);
}

/* 文本省略工具类 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
