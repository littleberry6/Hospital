<template>
  <div class="doctor-page">
    <!-- 沉浸式头部 -->
    <header class="doctor-header">
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
      <h1 class="header__title">医生主页</h1>
      <button class="header__star" type="button" :class="{ 'header__star--on': isFavorited }" @click="toggleFavorite" aria-label="收藏">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            :fill="isFavorited ? '#fbbf24' : 'none'"
            :stroke="isFavorited ? '#fbbf24' : '#fff'"
            stroke-width="2"
            stroke-linejoin="round"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
          />
        </svg>
      </button>
    </header>

    <!-- 内容区，下拉刷新包裹 -->
    <PullToRefresh class="doctor-pull" @refresh="handleRefresh">
      <!-- 名片 / 概览 -->
      <section class="card profile">
        <LazyImage class="profile__avatar" :src="doctor.avatar" :alt="doctor.name" />
        <div class="profile__row">
          <div class="profile__name-wrap">
            <h2 class="profile__name">{{ doctor.name }}</h2>
            <span class="profile__title">{{ doctor.title }}</span>
          </div>
          <button
            class="profile__follow"
            type="button"
            :class="{ 'profile__follow--on': doctor.followed }"
            @click="toggleFollow"
          >
            <span v-if="doctor.followed" class="profile__follow-dot" aria-hidden="true"></span>
            {{ doctor.followed ? '已关注' : '+ 关注' }}
          </button>
        </div>

        <div class="profile__meta">
          <span class="tag tag--rank">{{ doctor.hospitalTag }}</span>
          <span class="profile__inst">
            {{ doctor.hospital }}
            <i class="profile__divider">|</i>
            {{ doctor.department }}
          </span>
          <span v-if="doctor.online" class="badge badge--online">
            <i class="badge__dot" aria-hidden="true"></i>
            在线
          </span>
        </div>

        <div class="profile__stats">
          <div class="stat">
            <div class="stat__num">{{ doctor.consultations }}</div>
            <div class="stat__label">接诊量</div>
          </div>
          <div class="stat">
            <div class="stat__num stat__num--em">{{ doctor.satisfaction }}</div>
            <div class="stat__label">好评率</div>
          </div>
        </div>

        <div class="profile__cta">
          <button class="cta cta--chat" type="button" @click="onConsult">
            <span class="cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 5h16v11H8l-4 4V5z"
                  fill="currentColor"
                  opacity="0.95"
                />
              </svg>
            </span>
            线上咨询
          </button>
          <button class="cta cta--call" type="button" @click="onCall">
            <span class="cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 4h3l2 5-2 1c1 2.5 3 4.5 5.5 5.5l1-2 5 2v3c0 .6-.4 1-1 1C9.7 19.5 4.5 14.3 4 5z"
                  fill="currentColor"
                  opacity="0.95"
                />
              </svg>
            </span>
            电话咨询
          </button>
        </div>
      </section>

      <!-- 医生擅长 -->
      <section class="card section">
        <header class="section__head">
          <h3 class="section__title">
            <span class="section__bar" aria-hidden="true"></span>
            医生擅长
          </h3>
          <span class="section__arrow" aria-hidden="true">›</span>
        </header>
        <p class="expertise">{{ doctor.expertise }}</p>
      </section>

      <!-- 热度咨询（1685） -->
      <section class="card section">
        <header class="section__head">
          <h3 class="section__title">
            <span class="section__bar" aria-hidden="true"></span>
            热度咨询
            <span class="section__count">({{ doctor.hotCount }})</span>
          </h3>
          <span class="section__arrow" aria-hidden="true">›</span>
        </header>

        <div class="chips">
          <span
            v-for="t in doctor.tags"
            :key="t.key"
            class="chip"
            :style="{ background: t.bg, color: t.fg }"
          >
            {{ t.name }}
          </span>
        </div>

        <ul class="reviews">
          <SwipeItem
            v-for="r in displayedReviews"
            :key="r.id"
            class="review"
            @swipeLeft="removeReview(r.id)"
          >
            <div class="review__row">
              <span class="review__name">{{ r.name }}</span>
              <span class="review__time">{{ r.time }}</span>
            </div>
            <p class="review__content">{{ r.content }}</p>
          </SwipeItem>

          <div v-if="!reviews.length" class="reviews__empty">
            <span class="reviews__empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M3 7h18v10H7l-4 4V7z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <p>评价已清空，下拉刷新试试</p>
          </div>
        </ul>
      </section>

      <div class="safe-bottom" aria-hidden="true"></div>
    </PullToRefresh>

    <!-- 线上咨询对话框（直接打开，即时与医生沟通） -->
    <ChatDialog
      :visible="chatVisible"
      :session-id="chatSessionId"
      :peer="{
        name: doctor.name,
        avatar: doctor.avatar,
        sub: `${doctor.title} · ${doctor.hospital} · ${doctor.department}`
      }"
      :booking="null"
      @close="onChatClose"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import LazyImage from '@/components/LazyImage.vue'
import ChatDialog from '@/components/ChatDialog.vue'
import { toast } from '@/utils/toast'
import { doctorProfile, doctorReviews } from './doctorMock'

const router = useRouter()
const route = useRoute()

// 简单医生库：当前只有一个医生，可按 :id 切换
const doctor = ref(doctorProfile)

const reviews = ref([...doctorReviews])
const displayedReviews = computed(() => reviews.value)

/* 收藏/关注状态持久化（按医生 ID 分 key） */
const FAV_KEY = 'luya_favorites'
const FOLLOW_KEY = 'luya_follows'

function readSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')) }
  catch { return new Set() }
}
function writeSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]))
}

const favSet = readSet(FAV_KEY)
const followSet = readSet(FOLLOW_KEY)

const isFavorited = ref(favSet.has(doctor.value.id))

function toggleFavorite() {
  if (isFavorited.value) {
    favSet.delete(doctor.value.id)
    isFavorited.value = false
    toast('已取消收藏')
  } else {
    favSet.add(doctor.value.id)
    isFavorited.value = true
    toast('已收藏 ' + doctor.value.name + ' 医生')
  }
  writeSet(FAV_KEY, favSet)
}

/* 同步关注状态 */
doctor.value.followed = followSet.has(doctor.value.id)

/* 线上咨询：直接打开对话窗口（沿用 app 薄荷绿 / 聊天气泡默认样式） */
const chatVisible = ref(false)
const chatSessionId = computed(() => 'doctor-' + (doctor.value?.id || 'default'))
function onConsult() {
  chatVisible.value = true
}
function onChatClose() {
  chatVisible.value = false
}

/* ========== 行为 ========== */
function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

function toggleFollow() {
  doctor.value.followed = !doctor.value.followed
  if (doctor.value.followed) {
    followSet.add(doctor.value.id)
    toast('已关注 ' + doctor.value.name + ' 医生')
  } else {
    followSet.delete(doctor.value.id)
    toast('已取消关注')
  }
  writeSet(FOLLOW_KEY, followSet)
}

function onCall() {
  const phone = doctor.value?.phone
  if (!phone) {
    toast('暂未提供医生联系电话')
    return
  }
  /* H5 唤起手机拨号界面：tel: 协议由系统处理
   *  - 移动端（iOS/Android）：弹出系统拨号盘并自动填入号码
   *  - 桌面端浏览器：通常静默无响应（属预期行为）
   */
  window.location.href = 'tel:' + phone
}

function removeReview(id) {
  const idx = reviews.value.findIndex((r) => r.id === id)
  if (idx > -1) reviews.value.splice(idx, 1)
}

/* ========== 下拉刷新 ========== */
async function handleRefresh(done) {
  await new Promise((r) => setTimeout(r, 600))
  reviews.value = [...doctorReviews]
  done && done()
}

// 用于路由参数：'/doctor/wang-mingqin' 这种；当前只有一个，简单读一下
;(() => {
  const id = route.params?.id
  if (id && id !== doctor.value.id) {
    // eslint-disable-next-line no-console
    console.log('[Doctor] unknown doctor id:', id)
  }
})()
</script>

<style scoped>
.doctor-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg, #f5f7f8);
}

/* ========== 头部 ========== */
.doctor-header {
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
.header__star {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  color: inherit;
}

.header__back svg,
.header__star svg {
  width: 22px;
  height: 22px;
}

.header__back:active,
.header__star:active {
  transform: scale(0.92);
}

.header__star--on svg {
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.5));
}

.header__title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ========== 内容滚动容器 ========== */
.doctor-pull {
  flex: 1;
  display: block;
  padding: 0 16px 24px;
  background: var(--bg, #f5f7f8);
}

@media (min-width: 481px) {
  .doctor-pull {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* ========== 公用卡片样式 ========== */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(45, 212, 168, 0.08);
  padding: 16px;
  margin-bottom: 12px;
}

/* ========== 名片卡 ========== */
.profile {
  position: relative;
  margin-top: -10px;
}

.profile__avatar {
  position: absolute;
  top: -10px;
  right: 16px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #ecfdf5;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.profile__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 84px;
}

.profile__name-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.profile__name {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.profile__title {
  font-size: 12px;
  color: #475569;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
}

.profile__follow {
  flex: none;
  background: var(--primary, #2dd4a8);
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(45, 212, 168, 0.32);
  transition: transform 0.18s ease;
}

.profile__follow:active {
  transform: scale(0.94);
}

.profile__follow--on {
  background: #f1f5f9;
  color: #64748b;
  box-shadow: none;
}

.profile__follow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2dd4a8;
  display: inline-block;
}

.profile__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
}

.tag {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag--rank {
  background: #fde68a;
  color: #b45309;
}

.profile__divider {
  margin: 0 4px;
  color: #cbd5e1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dcfce7;
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}

.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
}

/* ========== 接诊量 / 好评率 ========== */
.profile__stats {
  display: flex;
  margin: 14px 0 12px;
  background: linear-gradient(180deg, #f0fdfa 0%, #ecfeff 100%);
  border-radius: 10px;
  padding: 14px 0;
}

.stat {
  flex: 1;
  text-align: center;
  position: relative;
}

.stat + .stat::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: rgba(45, 212, 168, 0.18);
}

.stat__num {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.stat__num--em {
  color: var(--primary, #2dd4a8);
}

.stat__label {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
}

/* ========== 线上 / 电话 CTA ========== */
.profile__cta {
  display: flex;
  gap: 10px;
}

.cta {
  flex: 1;
  height: 38px;
  border-radius: 10px;
  border: 0;
  background: linear-gradient(180deg, #2dd4a8 0%, #14b890 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 6px 16px rgba(45, 212, 168, 0.32);
  transition: transform 0.18s ease;
}

.cta:active {
  transform: scale(0.97);
}

.cta__icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
}

.cta__icon svg {
  width: 100%;
  height: 100%;
}

/* ========== section 标题 ========== */
.section {
  padding: 0;
  overflow: hidden;
}

.section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.section__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.section__bar {
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--primary, #2dd4a8);
}

.section__count {
  color: #94a3b8;
  font-weight: 500;
  margin-left: 4px;
}

.section__arrow {
  color: #cbd5e1;
  font-size: 22px;
  line-height: 1;
  transform: translateY(-1px);
}

/* ========== 擅长描述 ========== */
.expertise {
  font-size: 14px;
  line-height: 1.7;
  color: #475569;
  margin: 0;
  padding: 0 16px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ========== chips ========== */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 16px 12px;
}

.chip {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ========== 评价列表 ========== */
.reviews {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #f1f5f9;
}

.review {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fff;
}

.review:last-child {
  border-bottom: 0;
}

.review__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
  margin-bottom: 4px;
}

.review__name {
  color: #0f172a;
  font-weight: 600;
}

.review__time {
  color: #94a3b8;
  font-size: 12px;
}

.review__content {
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reviews__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px 36px;
  color: #94a3b8;
  font-size: 13px;
}

.reviews__empty-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 50%;
  color: #cbd5e1;
}

.reviews__empty-icon svg {
  width: 20px;
  height: 20px;
}

/* ========== 安全区 ========== */
.safe-bottom {
  height: env(safe-bottom, 0px);
}
</style>
