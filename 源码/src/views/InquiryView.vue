<template>
  <div class="page inquiry">
    <PullToRefresh @refresh="handleRefresh">
      <!-- 沉浸式头部：薄荷绿背景 -->
      <header class="inquiry-header">
        <div class="inquiry-header__nav">
          <button class="inquiry-header__back" @click="onBack" aria-label="返回">
            <svg class="icon icon-20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <h1 class="inquiry-header__title">专家问诊</h1>
          <span class="inquiry-header__placeholder"></span>
        </div>

        <div class="inquiry-header__search">
          <svg class="icon icon-18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#9ca3af"
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"
            />
          </svg>
          <input
            v-model="searchText"
            type="search"
            class="inquiry-header__input"
            placeholder="搜索医生、疾病或症状"
            enterkeyhint="search"
            @input="onSearchInput"
          />
        </div>
      </header>

      <!-- 科室分类：横向滚动 -->
      <section class="dept-section" aria-label="科室分类">
        <div class="dept-scroll" ref="deptScrollRef">
          <button
            v-for="dept in departments"
            :key="dept.key"
            type="button"
            class="dept-item"
            :class="{ 'is-active': activeDept === dept.key }"
            :style="{ '--dept-color': dept.color }"
            @click="onDeptClick(dept)"
          >
            <span
              class="dept-item__icon"
              :style="{ color: activeDept === dept.key ? dept.color : '' }"
              v-html="dept.svg"
            ></span>
            <span class="dept-item__name">{{ dept.name }}</span>
          </button>
          <button type="button" class="dept-item dept-item--more" @click="onMoreDept">
            <span class="dept-item__icon dept-item__icon--more">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="14" cy="24" r="3" fill="#9ca3af" />
                <circle cx="24" cy="24" r="3" fill="#9ca3af" />
                <circle cx="34" cy="24" r="3" fill="#9ca3af" />
              </svg>
            </span>
            <span class="dept-item__name">更多</span>
          </button>
        </div>
      </section>

      <!-- 医生列表 -->
      <section class="doctor-section" aria-label="医生列表">
        <SwipeItem
          v-for="(doctor, index) in displayedDoctors"
          :key="doctor.id"
          class="doctor-card-wrap"
          @delete="removeDoctor(index)"
        >
          <article class="doctor-card" @click="onDoctorCard(doctor)">
            <div class="doctor-card__avatar">
              <LazyImage :src="doctor.avatar" sizes="72px" :alt="doctor.name" />
            </div>
            <div class="doctor-card__info">
              <div class="doctor-card__row">
                <h3 class="doctor-card__name">{{ doctor.name }}</h3>
                <span class="doctor-card__role">
                  {{ doctor.deptName }} <span class="doctor-card__divider">·</span> {{ doctor.title }}
                </span>
              </div>
              <div class="doctor-card__hospital">
                <span class="doctor-card__level">{{ doctor.level }}</span>
                <span class="doctor-card__hospital-name ellipsis">{{ doctor.hospital }}</span>
              </div>
              <p class="doctor-card__skill ellipsis-2">
                擅长：{{ doctor.skill }}
              </p>
              <div class="doctor-card__meta">
                <span class="doctor-card__star">
                  <svg class="icon icon-12" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#fbbf24"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                  {{ doctor.score }}
                </span>
                <span class="doctor-card__years">从业{{ doctor.years }}年</span>
              </div>
            </div>
            <button
              class="doctor-card__btn"
              type="button"
              @click.stop="onConsult(doctor)"
            >
              立即咨询
              <span class="doctor-card__chevron">›</span>
            </button>
          </article>
        </SwipeItem>

        <div v-if="loading && !allDoctors.length" class="skeleton-list" aria-hidden="true">
          <div v-for="n in 4" :key="n" class="skeleton-card">
            <div class="skeleton skeleton-card__avatar"></div>
            <div class="skeleton-card__body">
              <div class="skeleton skeleton-card__line skeleton-card__line--lg"></div>
              <div class="skeleton skeleton-card__line skeleton-card__line--md"></div>
              <div class="skeleton skeleton-card__line skeleton-card__line--sm"></div>
            </div>
          </div>
        </div>

        <div v-if="loadingMore" class="load-more flex-center">
          <span class="load-more__spinner"></span>
          <span>加载中...</span>
        </div>
        <div v-else-if="noMore && displayedDoctors.length" class="no-more">没有更多了</div>

        <div
          v-if="!displayedDoctors.length && !loading && !loadingMore"
          class="empty flex-center"
        >
          <div class="empty__icon" aria-hidden="true">🩺</div>
          <p class="empty__text">
            {{ searchText ? `没有找到与 “${searchText}” 相关的医生` : '暂无相关医生' }}
          </p>
          <button v-if="searchText" class="empty__btn" type="button" @click="clearSearch">
            清空搜索
          </button>
        </div>
      </section>

      <div class="safe-pad"></div>
    </PullToRefresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import LazyImage from '@/components/LazyImage.vue'
import { debounce, throttle } from '@/utils/debounceThrottle'
import { toast } from '@/utils/toast'
import { departments, generateDoctors } from './inquiryMock'

const route = useRoute()
const router = useRouter()

/* ========== 状态 ========== */
const activeDept = ref('stomatology')
const searchText = ref('')
const loading = ref(false)
const loadingMore = ref(false)
const noMore = ref(false)
const allDoctors = ref([])

const page = ref(1)
const pageSize = 6

/* ========== 计算属性 ========== */
const displayedDoctors = computed(() =>
  allDoctors.value.slice(0, page.value * pageSize)
)

/* ========== 业务逻辑 ========== */
async function fetchInitial() {
  loading.value = true
  // 模拟首屏异步加载，便于演示骨架屏
  await new Promise((r) => setTimeout(r, 200))
  allDoctors.value = generateDoctors(20, activeDept.value)
  loading.value = false
  noMore.value = allDoctors.value.length <= pageSize
}

const handleRefresh = (done) => {
  setTimeout(() => {
    page.value = 1
    noMore.value = false
    allDoctors.value = generateDoctors(20, activeDept.value)
    done()
  }, 800)
}

const loadMore = throttle(() => {
  if (loadingMore.value || noMore.value || loading.value) return
  if (page.value * pageSize >= allDoctors.value.length) {
    noMore.value = true
    return
  }
  loadingMore.value = true
  setTimeout(() => {
    page.value += 1
    loadingMore.value = false
    if (page.value * pageSize >= allDoctors.value.length) noMore.value = true
  }, 400)
}, 200)

const onScroll = () => {
  const scrollEl = document.querySelector('.pull-refresh')
  if (!scrollEl) return
  const { scrollTop, scrollHeight, clientHeight } = scrollEl
  if (scrollTop + clientHeight >= scrollHeight - 80) {
    loadMore()
  }
}

const onSearchInput = debounce(() => {
  // 真实场景：触发接口搜索；当前用本地过滤做演示
  const key = searchText.value.trim().toLowerCase()
  page.value = 1
  noMore.value = false
  if (!key) {
    allDoctors.value = generateDoctors(20, activeDept.value)
  } else {
    const base = generateDoctors(20, activeDept.value)
    allDoctors.value = base.filter(
      (d) =>
        d.name.includes(searchText.value.trim()) ||
        d.deptName.includes(searchText.value.trim()) ||
        d.skill.includes(searchText.value.trim())
    )
    if (!allDoctors.value.length) noMore.value = true
  }
}, 300)

const clearSearch = () => {
  searchText.value = ''
  onSearchInput()
}

const onDeptClick = (dept) => {
  if (activeDept.value === dept.key) return
  activeDept.value = dept.key
  page.value = 1
  noMore.value = false
  allDoctors.value = generateDoctors(20, dept.key)
}

const onMoreDept = () => {
  router.push('/find')
}

const onDoctorCard = (doctor) => {
  router.push(`/doctor/${encodeURIComponent(doctor.id)}`)
}

const onBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const removeDoctor = (index) => {
  allDoctors.value.splice(index, 1)
  if (allDoctors.value.length <= page.value * pageSize) {
    noMore.value = true
  }
}

const onConsult = (doctor) => {
  router.push(`/doctor/${doctor.id}`)
}

/* ========== 生命周期 ========== */
onMounted(async () => {
  const q = route.query.dept
  if (q) {
    const hit = departments.find((d) => d.name === String(q))
    if (hit) activeDept.value = hit.key
  }
  await nextTick()
  fetchInitial()
  const scrollEl = document.querySelector('.pull-refresh')
  if (scrollEl) {
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  const scrollEl = document.querySelector('.pull-refresh')
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', onScroll)
  }
})
</script>

<style scoped>
.inquiry {
  background: var(--bg);
}

/* ========== 头部（薄荷绿沉浸式） ========== */
.inquiry-header {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  padding: calc(var(--safe-top) + 8px) 16px 22px;
  color: #fff;
}

.inquiry-header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  margin-bottom: 14px;
}

.inquiry-header__back {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.95);
  transition: background 0.15s;
}

.inquiry-header__back:active {
  background: rgba(255, 255, 255, 0.18);
}

.inquiry-header__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.inquiry-header__placeholder {
  width: 28px;
  height: 28px;
}

.inquiry-header__search {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 8px 14px;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.inquiry-header__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--text-main);
  background: transparent;
}

.inquiry-header__input::placeholder {
  color: var(--text-light);
}

/* ========== 科室分类 ========== */
.dept-section {
  margin: -10px 16px 12px;
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 14px 4px 10px;
  box-shadow: var(--shadow);
}

.dept-scroll {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 0 12px 6px;
  scroll-snap-type: x proximity;
  /* 让滚动体验更好：隐藏滚动条 */
  scrollbar-width: none;
}
.dept-scroll::-webkit-scrollbar {
  display: none;
}

.dept-item {
  flex: 0 0 auto;
  min-width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  scroll-snap-align: start;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.dept-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(45, 212, 168, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dept-color);
  transition: background 0.2s, transform 0.2s;
}

.dept-item__icon :deep(svg) {
  width: 28px;
  height: 28px;
}

.dept-item.is-active .dept-item__icon {
  background: var(--dept-color);
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.dept-item__icon--more {
  background: #f3f4f6;
  color: #9ca3af;
}

.dept-item__name {
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 500;
  white-space: nowrap;
}

.dept-item.is-active .dept-item__name {
  color: var(--text-main);
  font-weight: 600;
}

.dept-item--more .dept-item__icon :deep(svg) {
  width: 22px;
  height: 22px;
}

/* ========== 医生列表 ========== */
.doctor-section {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: transparent;
}

.doctor-card-wrap {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 12px;
  overflow: hidden;
}

.doctor-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.doctor-card__avatar {
  width: 64px;
  height: 64px;
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
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.doctor-card__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
}

.doctor-card__role {
  font-size: 12px;
  color: var(--text-sub);
}

.doctor-card__divider {
  margin: 0 2px;
  opacity: 0.6;
}

.doctor-card__hospital {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-sub);
}

.doctor-card__level {
  flex-shrink: 0;
  padding: 1px 5px;
  background: #fde68a;
  color: #b45309;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.doctor-card__hospital-name {
  flex: 1;
  min-width: 0;
}

.doctor-card__skill {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doctor-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--text-sub);
}

.doctor-card__star {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f59e0b;
  font-weight: 600;
}

.doctor-card__years {
  color: var(--text-sub);
}

.doctor-card__btn {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 18px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 2px;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.32);
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
}

.doctor-card__btn:active {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(249, 115, 22, 0.32);
}

.doctor-card__chevron {
  font-size: 14px;
  line-height: 1;
  margin-top: -1px;
  opacity: 0.9;
}

/* ========== 骨架屏 ========== */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.skeleton-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-card__line {
  height: 12px;
  border-radius: 4px;
}

.skeleton-card__line--lg {
  width: 40%;
  height: 16px;
}

.skeleton-card__line--md {
  width: 65%;
}

.skeleton-card__line--sm {
  width: 50%;
}

/* ========== 加载更多 / 空状态 ========== */
.load-more,
.no-more {
  padding: 18px 0 8px;
  color: var(--text-light);
  font-size: 13px;
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

.empty {
  flex-direction: column;
  padding: 60px 20px 40px;
}

.empty__icon {
  font-size: 52px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.empty__text {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 16px;
}

.empty__btn {
  padding: 7px 18px;
  border-radius: 18px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-size: 13px;
  font-weight: 600;
}

/* ========== 底部安全区 ========== */
.safe-pad {
  height: 16px;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

/* ========== 大屏适配（窄屏平板：拉宽最大宽度） ========== */
@media (min-width: 481px) {
  .dept-section,
  .doctor-section {
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>
