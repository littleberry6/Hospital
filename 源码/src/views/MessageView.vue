<template>
  <div class="page message">
    <PullToRefresh @refresh="handleRefresh">
      <!-- 沉浸式头部：薄荷绿渐变 + 标题 + 设置图标 -->
      <header class="message-header">
        <span class="message-header__spacer" aria-hidden="true"></span>
        <h1 class="message-header__title">消息</h1>
        <button
          class="message-header__setting"
          type="button"
          aria-label="设置"
          @click="onSetting"
        >
          <svg class="icon icon-22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
            />
          </svg>
        </button>
      </header>

      <!-- 四宫格分类卡（白底悬浮） -->
      <section class="categories" aria-label="消息分类">
        <button
          v-for="(c, idx) in categories"
          :key="c.key"
          type="button"
          class="categories__item"
          :style="{ '--cat-color': c.color, '--cat-bg': c.bg, '--anim-delay': idx * 50 + 'ms' }"
          @click="onCategory(c)"
        >
          <span class="categories__icon" v-html="c.svg"></span>
          <span class="categories__label">{{ c.label }}</span>
        </button>
      </section>

      <!-- 预约提醒（预约完成后自动生成，含约号/日期/时段） -->
      <section v-if="bookings.length" class="group" aria-label="预约提醒">
        <header class="group__head">
          <h2 class="group__title">
            预约提醒
            <span v-if="unreadBookings > 0" class="group__badge">{{ unreadBookings }}</span>
          </h2>
          <span class="group__more">约号通知</span>
        </header>
        <div class="group__list">
          <SwipeItem
            v-for="(b, idx) in bookings"
            :key="b.id"
            class="msg-wrap"
            :class="{ 'is-first': idx === 0, 'is-last': idx === bookings.length - 1 }"
            @delete="removeBookingMsg(b.id)"
          >
            <article class="msg" @click="onBookingClick(b)">
              <div class="msg__avatar msg__avatar--cal" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10z"
                  />
                </svg>
              </div>
              <div class="msg__body">
                <header class="msg__head">
                  <span class="msg__name ellipsis">预约成功 · {{ b.dept }}</span>
                  <span class="msg__time">{{ formatTime(b.createdAt) }}</span>
                </header>
                <p class="msg__preview ellipsis">
                  约号 {{ b.serialNo }} · {{ b.dateLabel }}（{{ b.weekday }}）{{ b.timeText }}
                </p>
              </div>
              <span v-if="!b.read" class="msg__badge">1</span>
            </article>
          </SwipeItem>
        </div>
      </section>

      <!-- 我的问诊 -->
      <section class="group" aria-label="我的问诊">
        <header class="group__head">
          <h2 class="group__title">我的问诊</h2>
          <button class="group__more" type="button" @click="onMore('我的问诊')">
            全部&gt;&gt;
          </button>
        </header>
        <div class="group__list">
          <SwipeItem
            v-for="(m, idx) in displayedInquiries"
            :key="m.id"
            class="msg-wrap"
            :class="{ 'is-first': idx === 0, 'is-last': idx === displayedInquiries.length - 1 }"
            @delete="removeInquiry(m.id)"
          >
            <article class="msg" @click="onItemClick(m, 'inquiry')">
              <div class="msg__avatar">
                <Avatar :src="m.avatar" :alt="m.name" />
              </div>
              <div class="msg__body">
                <header class="msg__head">
                  <span class="msg__name ellipsis">{{ m.name }}</span>
                  <span class="msg__time">{{ m.time }}</span>
                </header>
                <p class="msg__role ellipsis">{{ m.role }}</p>
                <p class="msg__preview ellipsis">{{ m.preview }}</p>
              </div>
              <span v-if="m.unread > 0" class="msg__badge">{{ m.unread }}</span>
            </article>
          </SwipeItem>
          <div v-if="!displayedInquiries.length" class="msg-empty">
            <p class="msg-empty__text">暂无问诊消息</p>
          </div>
        </div>
      </section>

      <!-- 私信 -->
      <section class="group" aria-label="私信">
        <header class="group__head">
          <h2 class="group__title">私信</h2>
          <button class="group__more" type="button" @click="onMore('私信')">
            全部&gt;&gt;
          </button>
        </header>
        <div class="group__list">
          <SwipeItem
            v-for="(m, idx) in displayedMessages"
            :key="m.id"
            class="msg-wrap"
            :class="{ 'is-first': idx === 0, 'is-last': idx === displayedMessages.length - 1 }"
            @delete="removeMessage(m.id)"
          >
            <article class="msg" @click="onItemClick(m, 'pm')">
              <div class="msg__avatar">
                <Avatar :src="m.avatar" :alt="m.name" />
              </div>
              <div class="msg__body">
                <header class="msg__head">
                  <span class="msg__name ellipsis">{{ m.name }}</span>
                  <span class="msg__time">{{ m.time }}</span>
                </header>
                <p class="msg__preview ellipsis">{{ m.preview }}</p>
              </div>
              <span v-if="m.unread > 0" class="msg__badge">{{ m.unread }}</span>
            </article>
          </SwipeItem>
          <div v-if="!displayedMessages.length" class="msg-empty">
            <p class="msg-empty__text">暂无私信</p>
          </div>
        </div>
      </section>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import Avatar from '@/components/Avatar.vue'
import { toast } from '@/utils/toast'
import { categories, myInquiries, privateMessages } from './messageMock'
import {
  listBookings,
  markBookingRead,
  removeBooking
} from '@/utils/bookingStore'
import { formatTime } from '@/utils/chatStore'

const router = useRouter()
const morePath = (title) => '/more/' + encodeURIComponent(title)

// 本地可写副本（支持下拉刷新 / 左滑删除）
const inquiries = ref([...myInquiries])
const messages = ref([...privateMessages])

/* 预约提醒：从预约记录读取（预约完成后自动出现） */
const bookings = ref([])
const unreadBookings = ref(0)

function reloadBookings() {
  bookings.value = listBookings().slice().reverse()
  unreadBookings.value = bookings.value.filter((b) => !b.read).length
}
reloadBookings()

function onBookingClick(b) {
  if (!b.read) {
    markBookingRead(b.id)
    b.read = true
    unreadBookings.value = Math.max(0, unreadBookings.value - 1)
  }
  router.push(morePath(`预约 · ${b.serialNo}`))
}

function removeBookingMsg(id) {
  removeBooking(id)
  reloadBookings()
  toast('已删除该条预约提醒')
}

const displayedInquiries = computed(() => inquiries.value)
const displayedMessages = computed(() => messages.value)

/* ========== 事件 ========== */
function onSetting() {
  router.push(morePath('消息设置'))
}

function onCategory(c) {
  router.push(morePath(c.label + '消息'))
}

function onItemClick(m, type) {
  // 进入已读：清掉未读
  m.unread = 0
  if (type === 'inquiry') router.push(morePath(`问诊 · ${m.name}`))
  else router.push(morePath(`私信 · ${m.name}`))
}

function onMore(groupName) {
  router.push(morePath(groupName))
}

/* ========== 列表操作 ========== */
function removeInquiry(id) {
  const idx = inquiries.value.findIndex((m) => m.id === id)
  if (idx > -1) inquiries.value.splice(idx, 1)
}
function removeMessage(id) {
  const idx = messages.value.findIndex((m) => m.id === id)
  if (idx > -1) messages.value.splice(idx, 1)
}

/* ========== 下拉刷新 ========== */
const isRefreshing = ref(false)
async function handleRefresh(done) {
  if (isRefreshing.value) return done && done()
  isRefreshing.value = true
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 600))
  inquiries.value = [...myInquiries]
  messages.value = [...privateMessages]
  reloadBookings()
  isRefreshing.value = false
  done && done()
}

/* ========== 生命周期：避免 iOS 橡皮筋影响内部滚动 ========== */
function onTouchMove(e) {
  if (e.touches && e.touches[0].clientY < 0) e.preventDefault?.()
}
onMounted(() => {
  document.addEventListener('touchmove', onTouchMove, { passive: false })
})
onUnmounted(() => {
  document.removeEventListener('touchmove', onTouchMove)
})
</script>

<style scoped>
/* ============================================================
 * MessageView
 * 设计语言：与首页一致（薄荷绿 #2dd4a8、12px 圆角、4×16 阴影、rem 缩放）
 * ============================================================ */
.message {
  background: var(--bg);
  min-height: 100vh;
  padding-bottom: calc(20px + var(--safe-bottom));
}

/* ========== 头部 ========== */
.message-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding-top: var(--safe-top);
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
}

.message-header__spacer {
  flex: 1;
}

.message-header__title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.message-header__setting {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  transition: transform 0.15s;
}

.message-header__setting:active {
  transform: translateY(-50%) scale(0.9);
}

/* ========== 四宫格分类卡 ========== */
.categories {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: -16px 14px 14px;
  padding: 14px 8px 12px;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.categories__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px 4px;
  color: var(--cat-color, var(--primary));
  transition: transform 0.15s;
  animation: catPop 0.4s ease both;
  animation-delay: var(--anim-delay, 0ms);
}

.categories__item:active {
  transform: scale(0.94);
}

.categories__icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--cat-bg, rgba(45, 212, 168, 0.12));
  color: var(--cat-color, var(--primary));
}

.categories__icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.categories__label {
  font-size: 12px;
  color: var(--text-main);
  font-weight: 500;
}

@keyframes catPop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========== 分组（我的问诊 / 私信） ========== */
.group {
  margin: 0 14px 16px;
}

.group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 4px 10px;
}

.group__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.group__more {
  font-size: 12px;
  color: var(--text-sub);
  padding: 4px 2px;
}

.group__list {
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* ========== 消息行（SwipeItem 子项） ========== */
.msg-wrap {
  display: block;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  transition: background 0.2s;
}

.msg-wrap.is-first {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.msg-wrap.is-last {
  border-bottom: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.msg {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #fff;
  position: relative;
}

.msg:active {
  background: #fafafa;
}

.msg__avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary-light);
}

/* 预约提醒：日历图标头像 */
.msg__avatar--cal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e8fbf5;
  color: #0e9f7c;
}

.msg__avatar--cal svg {
  width: 22px;
  height: 22px;
}

/* 分组标题未读徽标 */
.group__badge {
  display: inline-block;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  margin-left: 6px;
  border-radius: 8px;
  background: var(--danger, #ff4d4f);
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  font-weight: 600;
  vertical-align: 2px;
}

.msg__body {
  flex: 1;
  min-width: 0;
  padding-right: 28px; /* 给未读红点留位 */
}

.msg__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.msg__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  flex: 1;
  min-width: 0;
}

.msg__time {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-light);
}

.msg__role {
  font-size: 11px;
  color: var(--text-sub);
  margin-bottom: 2px;
}

.msg__preview {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.4;
}

/* 未读红点（右上角，绝对定位，避免影响 flex 布局） */
.msg__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--danger, #ff4d4f);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  font-weight: 600;
  box-sizing: border-box;
}

/* ========== 空状态 ========== */
.msg-empty {
  padding: 28px 16px;
  text-align: center;
  color: var(--text-sub);
  font-size: 13px;
}

.msg-empty__text {
  line-height: 1.4;
}

/* ========== 响应式 / 大屏收紧 ========== */
@media (min-width: 481px) {
  .group,
  .categories {
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>