<template>
  <div class="page archive">
    <PullToRefresh @refresh="handleRefresh">
      <!-- 沉浸式头部 -->
      <header class="archive-header">
        <div class="archive-header__nav">
          <button class="archive-header__back" @click="onBack" aria-label="返回">
            <svg class="icon icon-20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <h1 class="archive-header__title">健康档案</h1>
          <span class="archive-header__placeholder"></span>
        </div>
      </header>

      <!-- 用户信息卡（白底，悬浮在头部下方） -->
      <section class="profile">
        <div class="profile__avatar" :style="{ background: userProfile.avatarColor }">
          <span class="profile__avatar-text">{{ userProfile.avatarText }}</span>
        </div>
        <div class="profile__info">
          <h2 class="profile__name">{{ userProfile.name }}</h2>
          <p class="profile__meta">{{ userProfile.gender }} | {{ userProfile.age }}岁</p>
        </div>
        <button class="profile__btn" type="button" @click="onRecordToday">
          记录今日数据
        </button>
      </section>

      <!-- 核心数据卡（106 斤） -->
      <section class="vital-card">
        <div class="vital-card__top">
          <div class="vital-card__weight">
            <span class="vital-card__value">{{ vitalSigns.weight }}</span>
            <span class="vital-card__unit">斤</span>
          </div>
          <button class="vital-card__compare" type="button" @click="onCompare">
            历史数据对比
            <span class="vital-card__arrow">›</span>
          </button>
        </div>
        <div class="vital-card__metrics">
          <div
            v-for="m in vitalSigns.metrics"
            :key="m.key"
            class="metric"
            :class="`metric--${m.status}`"
          >
            <p class="metric__label">{{ m.label }}</p>
            <p class="metric__value">{{ m.value }}</p>
            <span class="metric__tag">{{ m.statusText }}</span>
          </div>
        </div>
      </section>

      <!-- 血糖 / 血脂 -->
      <section class="lab-row">
        <!-- 血糖折线图 -->
        <article class="lab-card">
          <header class="lab-card__head">
            <h3 class="lab-card__title">{{ bloodGlucose.title }}</h3>
            <span class="lab-card__unit">{{ bloodGlucose.unit }}</span>
          </header>
          <div class="lab-card__chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="chart-svg" aria-hidden="true">
              <!-- 区域填充 -->
              <defs>
                <linearGradient id="glucoseArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2dd4a8" stop-opacity="0.32" />
                  <stop offset="100%" stop-color="#2dd4a8" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path
                :d="areaPath"
                fill="url(#glucoseArea)"
                stroke="none"
              />
              <!-- 折线 -->
              <path
                :d="linePath"
                fill="none"
                stroke="#2dd4a8"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!-- 数据点 -->
              <g v-for="(pt, i) in bloodGlucose.points" :key="i">
                <circle
                  :cx="pt.x"
                  :cy="yScale(pt.value)"
                  r="1.6"
                  fill="#fff"
                  stroke="#2dd4a8"
                  stroke-width="1.4"
                />
              </g>
            </svg>
            <!-- 数值标签（HTML 浮层） -->
            <span
              class="chart-label chart-label--start"
              :style="{ left: bloodGlucose.points[0].x + '%' }"
            >
              {{ bloodGlucose.points[0].value }}
            </span>
            <span
              class="chart-label chart-label--end"
              :style="{ left: bloodGlucose.points[1].x + '%' }"
            >
              {{ bloodGlucose.points[1].value }}
            </span>
            <span
              class="chart-axis chart-axis--start"
              :style="{ left: bloodGlucose.points[0].x + '%' }"
            >
              {{ bloodGlucose.points[0].label }}
            </span>
            <span
              class="chart-axis chart-axis--end"
              :style="{ left: bloodGlucose.points[1].x + '%' }"
            >
              {{ bloodGlucose.points[1].label }}
            </span>
          </div>
        </article>

        <!-- 血脂进度条 -->
        <article class="lab-card">
          <header class="lab-card__head">
            <h3 class="lab-card__title">{{ bloodLipid.title }}</h3>
            <span class="lab-card__unit">{{ bloodLipid.unit }}</span>
          </header>
          <ul class="lipid-list">
            <li
              v-for="item in bloodLipid.items"
              :key="item.key"
              class="lipid-item"
            >
              <div class="lipid-item__row">
                <span class="lipid-item__name">{{ item.name }}</span>
                <span class="lipid-item__value">{{ item.value }}</span>
              </div>
              <div class="lipid-item__bar">
                <span
                  class="lipid-item__fill"
                  :style="{ width: Math.min((item.value / item.max) * 100, 100) + '%' }"
                ></span>
              </div>
            </li>
          </ul>
        </article>
      </section>

      <!-- 健康报告 -->
      <section class="report">
        <header class="report__head">
          <nav class="report__tabs" role="tablist">
            <button
              v-for="(tab, idx) in reportTabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="activeReportTab === tab.key"
              class="report__tab"
              :class="{ 'is-active': activeReportTab === tab.key }"
              :style="{ '--idx': idx }"
              @click="onReportTab(tab)"
            >
              {{ tab.label }}
            </button>
          </nav>
        </header>

        <div class="report__body">
          <button class="report__add" type="button" @click="onAddReport">
            <span>添加新的报告</span>
            <span class="report__add-icon">+</span>
          </button>

          <div
            v-for="group in currentGroups"
            :key="group.id"
            class="report-group"
          >
            <div class="report-group__head">
              <span class="report-group__bar"></span>
              <h4 class="report-group__date">{{ group.date }}</h4>
              <span class="report-group__more" @click="onMore(group)">更多 ››</span>
            </div>
            <SwipeItem
              v-for="item in group.items"
              :key="item.id"
              class="report-item-wrap"
              @delete="removeReport(group, item)"
            >
              <div class="report-item" @click="onReportClick(item)">
                <div
                  class="report-item__cover"
                  :style="{ background: item.accent }"
                >
                  <span
                    class="report-item__icon"
                    :style="{ color: reportIconColor(item.accent) }"
                    v-html="reportIcons[item.iconKey] || reportIcons.blood"
                  ></span>
                </div>
                <p class="report-item__title ellipsis">{{ item.title }}</p>
              </div>
            </SwipeItem>
          </div>

          <div v-if="!currentGroups.length" class="empty flex-center">
            <div class="empty__icon" aria-hidden="true">📋</div>
            <p class="empty__text">暂无相关报告</p>
          </div>
        </div>
      </section>

      <div class="safe-pad"></div>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import { toast } from '@/utils/toast'
import {
  userProfile,
  vitalSigns,
  bloodGlucose,
  bloodLipid,
  reportTabs,
  reportGroups,
  reportIcons
} from './healthMock'

const router = useRouter()
const morePath = (title) => '/more/' + encodeURIComponent(title)

/* ========== 状态 ========== */
const activeReportTab = ref('physical')
const allGroups = ref(JSON.parse(JSON.stringify(reportGroups)))

/* ========== 计算属性 ========== */
const currentGroups = computed(() => allGroups.value)

/* 血糖折线：y 轴按数值范围反算（值越大、点越靠上） */
const yScale = (v) => {
  const { min, max } = bloodGlucose.range
  // 保留顶部底部 5% 内边距
  const top = 12
  const bottom = 88
  const ratio = (v - min) / (max - min)
  return bottom - ratio * (bottom - top)
}

const linePath = computed(() => {
  return bloodGlucose.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${yScale(p.value)}`)
    .join(' ')
})

const areaPath = computed(() => {
  // 闭合到 X 轴（y=88）
  const start = `M ${bloodGlucose.points[0].x} 88`
  const line = bloodGlucose.points
    .map((p) => `L ${p.x} ${yScale(p.value)}`)
    .join(' ')
  const end = `L ${bloodGlucose.points.at(-1).x} 88 Z`
  return `${start} ${line} ${end}`
})

/* ========== 业务逻辑 ========== */
const handleRefresh = (done) => {
  setTimeout(() => {
    allGroups.value = JSON.parse(JSON.stringify(reportGroups))
    done()
  }, 800)
}

const onBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const onRecordToday = () => {
  toast('记录今日数据功能即将上线')
}

const onCompare = () => {
  toast('历史数据对比即将上线')
}

const onReportTab = (tab) => {
  if (activeReportTab.value === tab.key) return
  activeReportTab.value = tab.key
  // 演示用：不同 tab 重置/筛选数据
  if (tab.key === 'allergy') {
    allGroups.value = []
  } else if (tab.key === 'history') {
    allGroups.value = reportGroups.slice(0, 2).map((g) => ({
      ...g,
      items: g.items.slice(0, 3)
    }))
  } else {
    allGroups.value = JSON.parse(JSON.stringify(reportGroups))
  }
}

const onAddReport = () => {
  toast('请上传报告照片以添加')
}

const onMore = (group) => {
  router.push(morePath(`健康报告 · ${group.date}`))
}

const onReportClick = (item) => {
  router.push(morePath(`报告详情 · ${item.title}`))
}

const removeReport = (group, item) => {
  const g = allGroups.value.find((x) => x.id === group.id)
  if (!g) return
  const idx = g.items.findIndex((x) => x.id === item.id)
  if (idx > -1) g.items.splice(idx, 1)
  // 整组为空时移除组
  if (!g.items.length) {
    const gi = allGroups.value.findIndex((x) => x.id === group.id)
    if (gi > -1) allGroups.value.splice(gi, 1)
  }
}

/* 缩略图主色：根据 accent 浅背景选深色描边 */
const reportIconColor = (accent) => {
  const map = {
    '#fecaca': '#dc2626',
    '#bbf7d0': '#15803d',
    '#bae6fd': '#0369a1',
    '#fde68a': '#b45309',
    '#fbcfe8': '#be185d',
    '#a7f3d0': '#0f766e',
    '#c4b5fd': '#6d28d9',
    '#fcd34d': '#a16207',
    '#fed7aa': '#c2410c'
  }
  return map[accent] || '#374151'
}

/* ========== 生命周期 ========== */
onMounted(async () => {
  await nextTick()
})
</script>

<style scoped>
.archive {
  background: var(--bg);
}

/* ========== 头部（薄荷绿沉浸式） ========== */
.archive-header {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  padding: calc(var(--safe-top) + 8px) 16px 32px;
  color: #fff;
}

.archive-header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
}

.archive-header__back {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.95);
  transition: background 0.15s;
}

.archive-header__back:active {
  background: rgba(255, 255, 255, 0.18);
}

.archive-header__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.archive-header__placeholder {
  width: 28px;
  height: 28px;
}

/* ========== 用户信息卡 ========== */
.profile {
  margin: -22px 16px 12px;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
}

.profile__avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
}

.profile__avatar-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.profile__info {
  flex: 1;
  min-width: 0;
}

.profile__name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}

.profile__meta {
  font-size: 12px;
  color: var(--text-sub);
}

.profile__btn {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 18px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.32);
  transition: transform 0.15s;
}

.profile__btn:active {
  transform: scale(0.96);
}

/* ========== 核心数据卡（106 斤） ========== */
.vital-card {
  margin: 0 16px 12px;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  border-radius: var(--radius);
  padding: 18px 16px 16px;
  color: #fff;
  box-shadow: 0 6px 18px rgba(45, 212, 168, 0.32);
}

.vital-card__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 14px;
}

.vital-card__weight {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.vital-card__value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}

.vital-card__unit {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
}

.vital-card__compare {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 5px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.vital-card__arrow {
  font-size: 14px;
  line-height: 1;
  margin-top: -1px;
  opacity: 0.9;
}

.vital-card__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.metric {
  text-align: center;
  padding: 8px 4px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
}

.metric__label {
  font-size: 12px;
  opacity: 0.95;
  margin-bottom: 4px;
}

.metric__value {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: 0.2px;
}

.metric__tag {
  display: inline-block;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  font-weight: 600;
}

.metric--abnormal .metric__value {
  color: #fde68a;
}

.metric--abnormal .metric__tag {
  background: #fb923c;
  color: #fff;
}

/* ========== 血糖 / 血脂 ========== */
.lab-row {
  margin: 0 16px 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.lab-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 12px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}

.lab-card__head {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 10px;
}

.lab-card__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.lab-card__unit {
  font-size: 11px;
  color: var(--text-light);
}

.lab-card__chart {
  position: relative;
  flex: 1;
  min-height: 110px;
  padding-bottom: 18px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.chart-label {
  position: absolute;
  font-size: 11px;
  font-weight: 700;
  color: #2dd4a8;
  transform: translateX(-50%);
  white-space: nowrap;
}

.chart-label--start {
  top: 10%;
}

.chart-label--end {
  top: 0;
}

.chart-axis {
  position: absolute;
  bottom: 0;
  font-size: 11px;
  color: var(--text-sub);
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 血脂 */
.lipid-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.lipid-item__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-sub);
}

.lipid-item__value {
  font-weight: 700;
  color: var(--text-main);
}

.lipid-item__bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.lipid-item__fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2dd4a8 0%, #14b8a6 100%);
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 健康报告 ========== */
.report {
  margin: 0 16px 12px;
  background: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.report__head {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  padding: 14px 12px 0;
  position: relative;
}

.report__tabs {
  display: flex;
  gap: 18px;
  position: relative;
}

.report__tab {
  padding: 6px 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  cursor: pointer;
  transition: color 0.2s;
}

.report__tab.is-active {
  color: #fff;
}

.report__tab.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 22px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
}

.report__body {
  padding: 12px 12px 14px;
}

.report__add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 0;
  margin-bottom: 14px;
  border-radius: 18px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(45, 212, 168, 0.2);
  transition: transform 0.15s;
}

.report__add:active {
  transform: scale(0.98);
}

.report__add-icon {
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
}

/* 报告分组 */
.report-group {
  margin-bottom: 14px;
}

.report-group__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.report-group__bar {
  width: 3px;
  height: 12px;
  background: var(--primary);
  border-radius: 2px;
  flex-shrink: 0;
}

.report-group__date {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.report-group__more {
  font-size: 12px;
  color: var(--text-sub);
  cursor: pointer;
}

.report-item-wrap {
  border-radius: 10px;
  overflow: hidden;
}

.report-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  cursor: pointer;
}

.report-item__cover {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.report-item__cover::before {
  content: '';
  position: absolute;
  inset: 8px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.report-item__icon {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-item__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.report-item__title {
  font-size: 11px;
  color: var(--text-sub);
  text-align: center;
  max-width: 100%;
}

/* 报告 4 列网格：让 SwipeItem 横向排列 */
.report-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.report-group__head {
  grid-column: 1 / -1;
  margin-bottom: 0;
}

/* ========== 空状态 ========== */
.empty {
  flex-direction: column;
  padding: 40px 20px 24px;
}

.empty__icon {
  font-size: 44px;
  margin-bottom: 10px;
  opacity: 0.7;
}

.empty__text {
  font-size: 14px;
  color: var(--text-sub);
}

/* ========== 底部安全区 ========== */
.safe-pad {
  height: 16px;
}

/* ========== 大屏适配 ========== */
@media (min-width: 481px) {
  .profile,
  .vital-card,
  .lab-row,
  .report {
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>
