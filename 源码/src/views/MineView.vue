<template>
  <div class="page mine">
    <PullToRefresh :on-refresh="handleRefresh" class="mine__scroll">
      <!-- 沉浸式头部（沉浸薄荷绿） -->
      <header class="mine__header">
        <div class="mine__header-bg"></div>

        <div class="mine__top" @click="onProfileClick">
          <div class="mine__avatar">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient :id="'mineAvatar' + uid" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#fde68a" />
                  <stop offset="100%" stop-color="#f59e0b" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="32" :fill="'url(#mineAvatar' + uid + ')'" />
              <text
                x="50%"
                y="50%"
                dominant-baseline="central"
                text-anchor="middle"
                fill="#fff"
                font-size="22"
                font-weight="700"
                font-family="-apple-system, sans-serif"
                letter-spacing="0.5"
              >
                {{ profile.avatarSeed }}
              </text>
            </svg>
          </div>

          <div class="mine__id">
            <h1 class="mine__name">
              {{ loggedIn ? profile.nickname : '点击登录' }}<span class="mine__emoji">{{ loggedIn ? profile.emoji : '' }}</span>
            </h1>
            <span class="mine__uid">ID：{{ loggedIn ? profile.id : '未登录' }}</span>
            <span v-if="loggedIn && verified" class="mine__verify">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-1.6 15L6 11.6l1.4-1.4 3 3 6.2-6.2 1.4 1.4-7.6 7.6z"/></svg>
              已实名
            </span>
            <span v-else-if="loggedIn && !verified" class="mine__verify mine__verify--warn">
              未实名认证
            </span>
            <p class="mine__sig">{{ loggedIn ? profile.signature : '登录后享受更多服务' }}</p>
          </div>

          <button class="mine__gear" type="button" @click="onSettings" aria-label="设置">
            <svg viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32a.47.47 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.46.46 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .32.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"
              />
            </svg>
          </button>
        </div>
      </header>

      <!-- 内容容器：相对头部位移 -->
      <main class="mine__main">
        <!-- 顶部统计卡 -->
        <section class="stats-card" aria-label="个人统计">
          <div
            v-for="(s, i) in stats"
            :key="s.id"
            class="stats-card__item"
            :class="{ 'stats-card__item--last': i === stats.length - 1 }"
            @click="onStat(s)"
          >
            <span class="stats-card__count">{{ s.count }}</span>
            <span class="stats-card__label">{{ s.label }}</span>
          </div>
        </section>

        <!-- 我的预约（最新约号信息，随预约实时更新） -->
        <section
          v-if="latestBooking"
          class="booking-card"
          aria-label="我的预约"
          @click="goAppointment"
        >
          <div class="booking-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
          </div>
          <div class="booking-card__main">
            <div class="booking-card__head">
              <span class="booking-card__dept">{{ latestBooking.dept }}</span>
              <span class="booking-card__status">已预约</span>
            </div>
            <p class="booking-card__hospital ellipsis">
              {{ latestBooking.name }} · {{ latestBooking.hospital }}
            </p>
            <p class="booking-card__meta">
              {{ latestBooking.dateLabel }}（{{ latestBooking.weekday }}）{{ latestBooking.timeText }}
            </p>
          </div>
          <div class="booking-card__serial">
            <span class="booking-card__serial-label">约号</span>
            <span class="booking-card__serial-no">{{ latestBooking.serialNo }}</span>
          </div>
        </section>

        <!-- 待付款药品订单卡 -->
        <section
          v-if="pendingOrder"
          class="order-card"
          aria-label="待付款订单"
          @click="onOrderCard"
        >
          <div class="order-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.5 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4.5" />
              <path d="M3 10h18" />
              <circle cx="17" cy="17" r="3" />
              <path d="M17 15v4l2-2" />
            </svg>
          </div>
          <div class="order-card__main">
            <div class="order-card__head">
              <span class="order-card__drug">{{ pendingOrder.drug }}</span>
              <span class="order-card__status">{{ pendingOrder.status }}</span>
            </div>
            <p class="order-card__spec ellipsis">{{ pendingOrder.spec }}</p>
            <p class="order-card__no">订单号 {{ pendingOrder.orderNo }}</p>
          </div>
          <div class="order-card__side">
            <span class="order-card__amount">
              <i class="order-card__yen">¥</i>{{ pendingOrder.amount.toFixed(2) }}
            </span>
            <button class="order-card__pay" type="button" @click.stop="onPay">去支付</button>
          </div>
        </section>

        <!-- 我的问诊 -->
        <SectionGroup title="我的问诊">
          <template #more>
            <span @click="onMore('inquiry')">全部&gt;&gt;</span>
          </template>
          <div class="entry-grid entry-grid--4">
            <button
              v-for="e in inquiryEntries"
              :key="e.id"
              class="entry"
              type="button"
              @click="onEntry(e, 'inquiry')"
            >
              <span class="entry__icon">
                <span v-if="e.count" class="entry__badge">{{ badgeText(e.count) }}</span>
                <svg class="entry__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="iconPathFor(e.icon)"></svg>
              </span>
              <span class="entry__label">{{ e.label }}</span>
            </button>
          </div>
        </SectionGroup>

        <!-- 药品订单 -->
        <SectionGroup title="药品订单">
          <template #more>
            <span @click="onMore('order')">全部&gt;&gt;</span>
          </template>
          <div class="entry-grid entry-grid--4">
            <button
              v-for="e in orderEntries"
              :key="e.id"
              class="entry"
              type="button"
              @click="onEntry(e, 'order')"
            >
              <span class="entry__icon">
                <span v-if="e.count" class="entry__badge">{{ badgeText(e.count) }}</span>
                <svg class="entry__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="iconPathFor(e.icon)"></svg>
              </span>
              <span class="entry__label">{{ e.label }}</span>
            </button>
          </div>
        </SectionGroup>

        <!-- 常用服务（4 列 × 2 行） -->
        <SectionGroup title="常用服务">
          <div class="entry-grid entry-grid--4">
            <button
              v-for="e in serviceEntries"
              :key="e.id"
              class="entry"
              type="button"
              @click="onService(e)"
            >
              <span class="entry__icon">
                <svg class="entry__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="iconPathFor(e.icon)"></svg>
              </span>
              <span class="entry__label">{{ e.label }}</span>
            </button>
          </div>
        </SectionGroup>

        <!-- 最近问诊（演示左滑删除） -->
        <SectionGroup title="最近问诊">
          <ul class="records">
            <SwipeItem v-for="r in records" :key="r.id" @remove="removeRecord(r.id)">
              <div class="record">
                <div class="record__avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                  </svg>
                </div>
                <div class="record__main">
                  <div class="record__head">
                    <span class="record__dept">{{ r.dept }}</span>
                    <span
                      class="record__status"
                      :style="{ color: r.statusColor, background: r.statusBg }"
                    >
                      {{ r.status }}
                    </span>
                  </div>
                  <p class="record__sub">
                    {{ r.doctor }} · {{ r.hospital }}
                  </p>
                  <p class="record__time">{{ r.time }}</p>
                </div>
                <button class="record__arrow" type="button" @click.stop="onRecord(r)" aria-label="查看">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </SwipeItem>
          </ul>
        </SectionGroup>

        <!-- 底部安全占位 -->
        <div class="mine__safe-space"></div>
      </main>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import SectionGroup from '@/components/SectionGroup.vue'
import { toast } from '@/utils/toast'
import { latestBooking as fetchLatestBooking } from '@/utils/bookingStore'
import {
  userProfile as profile,
  stats,
  inquiryEntries,
  orderEntries,
  serviceEntries,
  recentRecords,
  pendingOrder as fetchPendingOrder
} from './mineMock'
import { isLoggedIn, isVerified, getAuth } from '@/utils/authStore'

const router = useRouter()
const morePath = (title) => '/more/' + encodeURIComponent(title)

// 用于 SVG gradient id 唯一化，避免批量渲染冲突
const uid = Math.random().toString(36).slice(2, 8)

// 数据浅拷贝便于下拉刷新
const records = ref([...recentRecords])

/* 最新预约约号（预约完成后实时更新） */
const latestBooking = ref(fetchLatestBooking())

/* 最新待付款订单 */
const pendingOrder = ref(fetchPendingOrder)

/* 登录 & 实名认证状态 */
const loggedIn = ref(isLoggedIn())
const verified = ref(isVerified())
const authInfo = ref(getAuth())

function onProfileClick() {
  if (!loggedIn.value) {
    router.push('/login')
  } else if (!verified.value) {
    router.push('/auth')
  }
}

function goAppointment() {
  router.push('/appointment')
}

/* 角标文案：超过 99 显示 99+ */
function badgeText(count) {
  return count > 99 ? '99+' : String(count)
}

/* 待付款订单：点击卡片查看订单详情，支付按钮拉起支付 */
function onOrderCard() {
  router.push(morePath('订单详情 · ' + pendingOrder.value.orderNo))
}
function onPay() {
  toast(`正在为订单 ${pendingOrder.value.orderNo} 拉起支付…`)
}

/* ========== 事件 ========== */
function onSettings() {
  router.push(morePath('设置'))
}
function onStat(s) {
  router.push(s.to)
}
function onMore(group) {
  if (group === 'inquiry') router.push(morePath('我的问诊'))
  else router.push(morePath('药品订单'))
}
function onEntry(e, group) {
  // 我的问诊入口：问诊中 → 消息；其他 → 详情占位
  if (group === 'inquiry' && e.id === 'in-progress') return router.push('/message')
  router.push(morePath(group === 'inquiry' ? '问诊 · ' + e.label : '订单 · ' + e.label))
}
function onService(e) {
  if (e.id === 'booking') return router.push('/booking')
  if (e.id === 'archive') return router.push('/archive')
  if (e.id === 'vaccine') return router.push({ path: '/appointment', query: { tab: 'vaccine' } })
  if (e.id === 'records') return router.push('/message')
  if (e.id === 'settings') return router.push(morePath('设置'))
  router.push(morePath(e.label))
}
function onRecord(r) {
  router.push(morePath(`问诊记录 · ${r.dept}`))
}

function removeRecord(id) {
  const idx = records.value.findIndex((r) => r.id === id)
  if (idx > -1) records.value.splice(idx, 1)
}

/* ========== 下拉刷新 ========== */
async function handleRefresh(done) {
  await new Promise((r) => setTimeout(r, 600))
  records.value = [...recentRecords]
  latestBooking.value = fetchLatestBooking()
  loggedIn.value = isLoggedIn()
  verified.value = isVerified()
  authInfo.value = getAuth()
  done && done()
}

/* ========== 内联 SVG 图标库（统一薄荷绿描线风格） ==========
 * 全部图标都用 stroke-only，统一 stroke-width 1.8 + round caps/joins。
 * 仅返回 <path>/<circle>/<rect> 子元素，由模板外的 <svg> 容器统一套 stroke。
 */
const ICONS = {
  /* 钱包 / 待付款（圆角矩形 + 内芯） */
  wallet:
    '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.5"/>',
  /* 对话气泡 + 三个点（问诊中） */
  'chat-active':
    '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/><circle cx="9" cy="12" r="0.6" fill="currentColor"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/><circle cx="15" cy="12" r="0.6" fill="currentColor"/>',
  /* 铅笔（待评价） */
  edit:
    '<path d="M14 4l6 6L9 21H3v-6L14 4z"/><path d="M13 5l6 6"/>',
  /* 胶囊（处方药） */
  pill:
    '<rect x="2.5" y="9" width="19" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="M8.5 7.5l8 13"/>',
  /* 包裹 + 顶部胶带（待发货） */
  box:
    '<path d="M3 8l9-5 9 5v11l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v11"/>',
  /* 卡车（待收货） */
  truck:
    '<rect x="2" y="6" width="11" height="10" rx="1"/><path d="M13 9h5l3 3v4h-8"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  /* 圆圈 ¥ 退款 */
  refund:
    '<circle cx="12" cy="12" r="9"/><path d="M9 8h4.5a2 2 0 0 1 0 4H9.5h3a2 2 0 0 1 0 4H9M10 6l-1 2M10 18l-1-2"/>',
  /* 日历（预约表单） */
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  /* 文件夹（健康档案） */
  folder:
    '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
  /* 注射器（疫苗订单） */
  vaccine:
    '<path d="M18 2l4 4M16 4l4 4M11 9l4 4-7 7a2.83 2.83 0 0 1-4-4l7-7z"/><path d="M9 11l4 4"/>',
  /* 放大镜（问诊记录） */
  search:
    '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  /* 耳机（在线客服） */
  headset:
    '<path d="M4 13a8 13 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/><path d="M19 19v1a2 2 0 0 1-2 2h-3"/>',
  /* 齿轮（设置） */
  cog:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
}

function iconPathFor(name) {
  return ICONS[name] || ''
}
</script>

<style scoped>
.mine {
  background: var(--bg);
  min-height: 100vh;
}

.mine__scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* ========== 头部 ========== */
.mine__header {
  position: relative;
  padding: calc(var(--safe-top) + 16px) 16px 0;
  color: #fff;
  z-index: 1;
}

.mine__header-bg {
  position: absolute;
  inset: 0 0 auto 0;
  height: 220px;
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  z-index: -1;
}

.mine__top {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.mine__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  background: linear-gradient(135deg, #fde68a, #f59e0b);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.mine__avatar svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mine__id {
  flex: 1;
  min-width: 0;
}

.mine__name {
  margin: 4px 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mine__emoji {
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
}

.mine__uid {
  display: inline-block;
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.mine__sig {
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mine__verify {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
}

.mine__verify svg {
  width: 12px;
  height: 12px;
}

.mine__verify--warn {
  background: rgba(251, 146, 60, 0.35);
}

.mine__gear {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s, background 0.18s;
  border: 0;
}

.mine__gear svg {
  width: 22px;
  height: 22px;
}

.mine__gear:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.3);
}

/* ========== 内容容器 ========== */
.mine__main {
  margin-top: -34px;
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.mine__safe-space {
  height: 16px;
}

/* ========== 统计卡 ========== */
.stats-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 14px 0;
}

.stats-card__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: opacity 0.2s;
}

.stats-card__item:not(.stats-card__item--last)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 18%;
  bottom: 18%;
  width: 1px;
  background: #eef2f7;
}

.stats-card__item:active {
  opacity: 0.7;
}

.stats-card__count {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
}

.stats-card__label {
  font-size: 12px;
  color: var(--text-sub);
}

/* ========== 入口网格（4 列薄荷绿描线） ========== */
.entry-grid {
  display: grid;
  gap: 10px 6px;
}

.entry-grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

.entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px 2px;
  background: transparent;
  border: 0;
  border-radius: 10px;
  transition: transform 0.15s, background 0.15s;
}

.entry:active {
  transform: scale(0.94);
  background: #f6f8fa;
}

.entry__icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2dd4a8;
}

.entry__ico {
  display: block;
  width: 26px;
  height: 26px;
}

/* 状态数量角标 */
.entry__badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: #f43f5e;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  border: 1.5px solid #fff;
  box-shadow: 0 2px 6px rgba(244, 63, 94, 0.35);
  pointer-events: none;
}

.entry__label {
  font-size: 12px;
  color: var(--text-main);
}

/* ========== 最近问诊时间线 ========== */
.records {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 6px;
  border-radius: 10px;
  background: #fff;
  transition: background 0.15s;
}

.record:active {
  background: #f6f8fa;
}

.record__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e6faf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #2dd4a8;
}

.record__avatar svg {
  width: 22px;
  height: 22px;
}

.record__main {
  flex: 1;
  min-width: 0;
}

.record__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.record__dept {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.record__status {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 8px;
  font-weight: 600;
}

.record__sub {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record__time {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--text-light);
}

.record__arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  flex-shrink: 0;
  background: transparent;
  border: 0;
}

.record__arrow svg {
  width: 16px;
  height: 16px;
}

/* ========== 我的预约约号卡 ========== */
.booking-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--shadow);
  border: 1px solid #e6f7f1;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.booking-card:active {
  transform: scale(0.98);
}

.booking-card__icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e6faf4;
  color: #2dd4a8;
}

.booking-card__icon svg {
  width: 22px;
  height: 22px;
}

.booking-card__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.booking-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.booking-card__dept {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
}

.booking-card__status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d1fae5;
  color: #047857;
  font-weight: 600;
}

.booking-card__hospital {
  margin: 0;
  font-size: 11px;
  color: var(--text-sub, #6b7280);
}

.booking-card__meta {
  margin: 0;
  font-size: 12px;
  color: #0e9f7c;
  font-weight: 600;
}

.booking-card__serial {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.booking-card__serial-label {
  font-size: 10px;
  color: var(--text-light, #9ca3af);
}

.booking-card__serial-no {
  font-size: 13px;
  font-weight: 700;
  color: #0e9f7c;
  font-family: 'SF Mono', Consolas, monospace;
  letter-spacing: 0.3px;
}

/* ========== 待付款订单卡 ========== */
.order-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--shadow);
  border: 1px solid #fff3e8;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.order-card:active {
  transform: scale(0.98);
}

.order-card__icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff7ed;
  color: #fb923c;
}

.order-card__icon svg {
  width: 22px;
  height: 22px;
}

.order-card__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.order-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-card__drug {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-card__status {
  flex-shrink: 0;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff7ed;
  color: #ea580c;
  font-weight: 600;
}

.order-card__spec {
  margin: 0;
  font-size: 11px;
  color: var(--text-sub, #6b7280);
}

.order-card__no {
  margin: 0;
  font-size: 11px;
  color: var(--text-light, #9ca3af);
}

.order-card__side {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.order-card__amount {
  font-size: 15px;
  font-weight: 700;
  color: #ea580c;
  font-family: 'SF Mono', Consolas, monospace;
}

.order-card__yen {
  font-style: normal;
  font-size: 11px;
  margin-right: 1px;
}

.order-card__pay {
  border: none;
  height: 26px;
  padding: 0 14px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fb923c 0%, #f59e0b 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(251, 146, 60, 0.32);
  transition: transform 0.15s ease;
}

.order-card__pay:active {
  transform: scale(0.92);
}

/* ========== 大屏适配 ========== */
@media (min-width: 481px) {
  .mine__main {
    padding: 0 24px 12px;
  }
  .mine__header-bg {
    height: 240px;
  }
}
</style>