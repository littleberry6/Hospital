<template>
  <div class="page discover">
    <PullToRefresh @refresh="handleRefresh">
      <!-- 沉浸式头部：薄荷绿渐变 + 搜索图标 + 内部子 tab -->
      <header class="discover-header">
        <div class="discover-header__top">
          <button class="discover-header__search" type="button" aria-label="搜索" @click="onSearch">
            <svg class="icon icon-20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"
              />
            </svg>
          </button>
          <span class="discover-header__spacer"></span>
        </div>

        <nav class="subtabs" role="tablist" aria-label="发现子分类">
          <button
            v-for="tab in subTabs"
            :key="tab.key"
            type="button"
            role="tab"
            class="subtabs__item"
            :class="{ 'is-active': activeSubTab === tab.key }"
            :aria-selected="activeSubTab === tab.key"
            @click="activeSubTab = tab.key"
          >
            <span class="subtabs__label">{{ tab.label }}</span>
            <span class="subtabs__indicator" aria-hidden="true"></span>
          </button>
        </nav>
      </header>

      <!-- 主体内容 -->
      <main class="discover-main">
        <!-- 关注 tab -->
        <section v-if="activeSubTab === 'follow'" class="block" aria-label="关注的圈子">
          <header class="block__head">
            <h2 class="block__title">
              <svg class="icon block__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#fb923c"
                  d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"
                />
                <path
                  fill="#f97316"
                  d="M11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                />
              </svg>
              我的关注
            </h2>
            <button class="block__more" type="button" @click="onMore('circles')">更多››</button>
          </header>
          <div v-if="followCircles.length" class="circles-grid">
            <article
              v-for="(c, idx) in followCircles"
              :key="c.id"
              class="circle-card"
              :style="{ '--splash': c.color, '--anim-delay': idx * 60 + 'ms' }"
              @click="onCircle(c)"
            >
              <div class="circle-card__splash">
                <span class="circle-card__tag"># {{ c.title }}</span>
              </div>
              <div class="circle-card__body">
                <span class="circle-card__heat">{{ c.heat }}热度</span>
                <span class="circle-card__arrow" aria-hidden="true">↑</span>
              </div>
            </article>
          </div>
          <div v-else class="empty">
            <p class="empty__text">还没有关注的内容，去发现看看 ›</p>
          </div>
        </section>

        <!-- 发现 tab -->
        <section v-else-if="activeSubTab === 'discover'" aria-label="热门话题与圈子">
          <!-- 热门话题 -->
          <header class="block__head">
            <h2 class="block__title">
              <svg class="icon block__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#fb923c"
                  d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"
                />
                <path
                  fill="#f97316"
                  d="M11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                />
              </svg>
              热门话题
            </h2>
            <button class="block__more" type="button" @click="onMore('topics')">更多››</button>
          </header>

          <div class="topics-card">
            <SwipeItem
              v-for="(t, idx) in displayedTopics"
              :key="t.id"
              class="topic-wrap"
              :class="{ 'is-first': idx === 0, 'is-last': idx === displayedTopics.length - 1 }"
              @delete="removeTopic(t.id)"
            >
              <div class="topic" @click="onTopic(t)">
                <span class="topic__rank"># {{ t.rank }}</span>
                <span class="topic__title ellipsis">{{ t.title }}</span>
                <span v-if="t.hot" class="topic__hot" aria-label="热门">热</span>
              </div>
            </SwipeItem>
            <div v-if="!displayedTopics.length" class="topic-empty">
              <p class="topic-empty__text">话题已清空，下拉刷新试试</p>
            </div>
          </div>

          <!-- 热门圈子 -->
          <header class="block__head block__head--mt">
            <h2 class="block__title">
              <svg class="icon block__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#fb923c"
                  d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"
                />
                <path
                  fill="#f97316"
                  d="M11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                />
              </svg>
              热门圈子
            </h2>
            <button class="block__more" type="button" @click="onMore('circles')">更多››</button>
          </header>

          <div class="circles-grid">
            <article
              v-for="(c, idx) in hotCircles"
              :key="c.id"
              class="circle-card"
              :style="{ '--splash': c.color, '--anim-delay': idx * 60 + 'ms' }"
              @click="onCircle(c)"
            >
              <div class="circle-card__splash">
                <span class="circle-card__tag"># {{ c.title }}</span>
              </div>
              <div class="circle-card__body">
                <span class="circle-card__heat">{{ c.heat }}热度</span>
                <span class="circle-card__arrow" aria-hidden="true">↑</span>
              </div>
            </article>
          </div>
        </section>

        <!-- 医生说 tab -->
        <section v-else aria-label="医生观点">
          <header class="block__head">
            <h2 class="block__title">
              <svg class="icon block__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#fb923c"
                  d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"
                />
                <path
                  fill="#f97316"
                  d="M11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"
                />
              </svg>
              医生说
            </h2>
            <button class="block__more" type="button" @click="onMore('talks')">更多››</button>
          </header>

          <div class="talks">
            <SwipeItem
              v-for="(d, idx) in doctorTalks"
              :key="d.id"
              class="talk-wrap"
              :class="{ 'is-first': idx === 0, 'is-last': idx === doctorTalks.length - 1 }"
              @delete="removeTalk(d.id)"
            >
              <article class="talk">
                <div class="talk__avatar">
                  <LazyImage :src="d.avatar" sizes="40px" :alt="d.name" />
                </div>
                <div class="talk__body">
                  <header class="talk__head">
                    <span class="talk__name">{{ d.name }}</span>
                    <span class="talk__role">{{ d.title }}</span>
                    <span class="talk__time">{{ d.time }}</span>
                  </header>
                  <p class="talk__content ellipsis-2">{{ d.content }}</p>
                  <div class="talk__foot">
                    <button class="talk__action" type="button" @click.stop="onLike(d)">
                      <svg class="icon icon-14" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
                        />
                      </svg>
                      <span>{{ d.like }}</span>
                    </button>
                    <button class="talk__action" type="button" @click.stop="onComment(d)">
                      <svg class="icon icon-14" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16z"
                        />
                      </svg>
                      <span>评论</span>
                    </button>
                  </div>
                </div>
              </article>
            </SwipeItem>
          </div>
        </section>
      </main>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import LazyImage from '@/components/LazyImage.vue'
import { toast } from '@/utils/toast'
import { subTabs, hotTopics, hotCircles, followCircles, doctorTalks } from './discoverMock'

const router = useRouter()
const morePath = (title) => '/more/' + encodeURIComponent(title)

// 内部子 tab：follow / discover / doctor
const activeSubTab = ref('discover')

// 浅拷贝，方便做下拉刷新/左滑删除的本地数据
const topics = ref([...hotTopics])
const talks = ref([...doctorTalks])

// 给动画 / 空状态用
const displayedTopics = computed(() => topics.value)

/* ========== 事件 ========== */
function onSearch() {
  router.push('/find')
}

function onMore(type) {
  const tab = activeSubTab.value
  let title = '更多'
  if (type === 'topics') title = '热门话题'
  else if (type === 'circles') title = tab === 'follow' ? '我的关注' : '热门圈子'
  else if (type === 'talks') title = '医生说'
  router.push(morePath(title))
}

function onCircle(c) {
  router.push(morePath('圈子 · ' + c.title))
}

function onTopic(t) {
  router.push(morePath('话题 · ' + t.title))
}

function onLike(d) {
  d.like += 1
}

function onComment(d) {
  toast('评论列表即将上线')
}

/* ========== 列表操作 ========== */
function removeTopic(id) {
  const idx = topics.value.findIndex((t) => t.id === id)
  if (idx > -1) topics.value.splice(idx, 1)
}

function removeTalk(id) {
  const idx = talks.value.findIndex((d) => d.id === id)
  if (idx > -1) talks.value.splice(idx, 1)
}

/* ========== 下拉刷新 ========== */
const isRefreshing = ref(false)
async function handleRefresh(done) {
  if (isRefreshing.value) return done && done()
  isRefreshing.value = true
  // 模拟网络延迟；真实场景里换成 fetch('/api/...')
  await new Promise((r) => setTimeout(r, 600))
  topics.value = [...hotTopics]
  talks.value = [...doctorTalks]
  isRefreshing.value = false
  done && done()
}

/* ========== 生命周期：避免 iOS 橡皮筋影响内部滚动 ========== */
function onTouchMove(e) {
  // 简单方向锁：在顶部不再向下传递，避免双层滚动穿透
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
 * DiscoverView
 * 设计语言：与首页一致（薄荷绿 #2dd4a8、12px 圆角、4×16 阴影、rem 缩放）
 * ============================================================ */
.discover {
  background: var(--bg);
  min-height: 100vh;
  padding-bottom: calc(20px + var(--safe-bottom));
}

/* ========== 头部 ========== */
.discover-header {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  padding-top: calc(14px + var(--safe-top));
  padding-bottom: 4px;
  color: #fff;
}

.discover-header__top {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
}

.discover-header__search {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  transition: transform 0.15s;
}

.discover-header__search:active {
  transform: scale(0.92);
}

.discover-header__spacer {
  flex: 1;
}

/* ========== 子 tab ========== */
.subtabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  height: 44px;
}

.subtabs__item {
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 500;
  transition: color 0.2s;
}

.subtabs__item.is-active {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.subtabs__indicator {
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  border-radius: 2px;
  background: #fff;
  transition: width 0.25s ease;
}

.subtabs__item.is-active .subtabs__indicator {
  width: 22px;
}

/* ========== 主体 ========== */
.discover-main {
  padding: 12px 14px 0;
}

.block {
  margin-bottom: 18px;
}

.block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px 10px;
}

.block__head--mt {
  margin-top: 4px;
}

.block__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.block__icon {
  width: 16px;
  height: 16px;
}

.block__more {
  font-size: 12px;
  color: var(--text-sub);
  padding: 4px 2px;
}

/* ========== 热门话题（5 条 # 序号 + 标题 + 热 标签，整组一张卡片） ========== */
.topics-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin: 0 2px;
}

.topic-wrap {
  display: block;
  position: relative;
  background: #fff;
  /* 上下相邻两条用细分割线，避免圆角拼接时的 1px 错位 */
  border-bottom: 1px solid #f2f3f5;
  transition: background 0.2s;
}

.topic-wrap.is-first {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.topic-wrap.is-last {
  border-bottom: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.topic {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px;
  background: #fff;
}

.topic__rank {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  min-width: 28px;
  font-variant-numeric: tabular-nums;
}

.topic__title {
  flex: 1;
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.4;
}

.topic__hot {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.topic-empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--text-sub);
  font-size: 13px;
}

/* ========== 热门圈子（2 列 grid） ========== */
.circles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 2px;
}

.circle-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: fadeUp 0.4s ease both;
  animation-delay: var(--anim-delay, 0ms);
  transition: transform 0.15s, box-shadow 0.2s;
}

.circle-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.circle-card__splash {
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--splash, var(--primary));
  color: #fff;
}

.circle-card__splash::after {
  /* 右侧高光：与首页 quick-card 风格统一 */
  content: '';
  position: absolute;
  right: -8px;
  top: -8px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  pointer-events: none;
}

.circle-card__tag {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
}

.circle-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 10px;
}

.circle-card__heat {
  font-size: 12px;
  color: var(--text-sub);
}

.circle-card__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 11px;
  font-weight: 700;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 医生说 ========== */
.talks {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0 2px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow);
}

.talk-wrap {
  display: block;
  background: #fff;
  border-bottom: 1px solid #f2f3f5;
  transition: background 0.2s;
}

.talk-wrap.is-first {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.talk-wrap.is-last {
  border-bottom: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.talk {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
}

.talk__avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary-light);
}

.talk__body {
  flex: 1;
  min-width: 0;
}

.talk__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 4px;
}

.talk__name {
  color: var(--text-main);
  font-weight: 600;
  font-size: 14px;
}

.talk__role {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.talk__time {
  flex-shrink: 0;
  color: var(--text-light);
}

.talk__content {
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.5;
  margin-bottom: 6px;
}

.talk__foot {
  display: flex;
  align-items: center;
  gap: 16px;
}

.talk__action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-sub);
  padding: 4px 0;
  transition: color 0.15s;
}

.talk__action:active {
  color: var(--primary);
}

/* ========== 空状态 ========== */
.empty {
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 32px 16px;
  text-align: center;
}

.empty__text {
  font-size: 13px;
  color: var(--text-sub);
}

/* ========== 响应式 / 大屏收紧 ========== */
@media (min-width: 481px) {
  .discover-main {
    padding-left: 24px;
    padding-right: 24px;
  }
  .subtabs {
    gap: 36px;
  }
}
</style>
