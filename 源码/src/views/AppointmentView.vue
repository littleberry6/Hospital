<template>
  <div class="appointment">
    <!-- 沉浸式薄荷绿头部 -->
    <header class="appt-header">
      <button class="appt-header__back" type="button" @click="goBack" aria-label="返回">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="appt-header__title">预约表单</h1>
      <span class="appt-header__placeholder" aria-hidden="true"></span>
    </header>

    <!-- 主体白卡 -->
    <div class="appt-body">
      <PullToRefresh :max-distance="80" @refresh="handleRefresh">
        <main class="appt-main">
          <!-- Tab 切换 -->
          <nav class="tabs" role="tablist">
            <button
              v-for="tab in appointmentTabs"
              :key="tab.id"
              type="button"
              class="tabs__item"
              :class="{ 'tabs__item--active': activeTab === tab.id }"
              role="tab"
              :aria-selected="activeTab === tab.id"
              @click="switchTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          </nav>

          <!-- 月份 + 横向日期 chips -->
          <div class="calendar">
            <p class="calendar__month">{{ currentMonthLabel }}</p>
            <div class="calendar__rail" ref="dateRail">
              <button
                v-for="(d, idx) in currentDates"
                :key="`${currentMonthId}-${d.day}`"
                type="button"
                class="date"
                :class="{
                  'date--selected': isSelected(d),
                  'date--disabled': !d.available
                }"
                :disabled="!d.available"
                @click="pickDate(d, idx)"
              >
                <span class="date__day">{{ d.day }}</span>
                <span class="date__week">{{ d.weekday }}</span>
                <span v-if="isSelected(d)" class="date__dot date__dot--top" aria-hidden="true"></span>
                <span v-if="isSelected(d)" class="date__dot date__dot--bottom" aria-hidden="true"></span>
              </button>
            </div>
          </div>

          <!-- 预约流程：科室 → 时段 -->
          <div class="flow">
            <button
              class="flow__chip"
              :class="{ 'flow__chip--active': selectedDept }"
              type="button"
              @click="deptOpen = true"
            >
              {{ selectedDept || '选择科室' }}
            </button>
            <span class="flow__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <button
              class="flow__chip"
              :class="{ 'flow__chip--active': selectedSlot }"
              type="button"
              @click="slotOpen = true"
            >
              {{ selectedSlot ? selectedSlot.label : '选择时段' }}
            </button>
          </div>

          <!-- 内容列表（按 Tab 类型渲染） -->
          <div class="list">
            <SwipeItem
              v-for="(item, idx) in displayedList"
              :key="`${activeTab}-${item.id}`"
              class="list__item-wrap"
              @delete="removeItem(item.id)"
            >
              <!-- 问诊 Tab -->
              <article
                v-if="activeTab === 'inquiry'"
                class="schedule"
                :class="{ 'is-selected': isSelectedCard(item), 'is-booked': isBooked(item) }"
                @click="onSchedule(item)"
              >
                <LazyImage :src="item.avatar" :alt="item.name" class="schedule__avatar" />
                <div class="schedule__main">
                  <div class="schedule__line">
                    <span class="schedule__name">{{ item.name }}</span>
                    <span class="schedule__dept">{{ item.dept }} {{ item.title }}</span>
                  </div>
                  <p class="schedule__hospital">{{ item.hospital }}</p>
                  <div class="schedule__footer">
                    <span class="schedule__time">{{ item.timeText }}</span>
                    <button
                      v-if="isBooked(item)"
                      class="schedule__action"
                      type="button"
                      @click.stop="onCancel(item, idx)"
                    >
                      取消预约
                    </button>
                    <button
                      v-else-if="item.status === 'available'"
                      class="schedule__action"
                      type="button"
                      @click.stop="selectCard(item)"
                    >
                      {{ isSelectedCard(item) ? '已选' : '可约' }}
                    </button>
                    <span v-else class="schedule__action schedule__action--full">约满</span>
                  </div>
                </div>
              </article>

              <!-- 疫苗 Tab -->
              <article
                v-else-if="activeTab === 'vaccine'"
                class="vaccine"
                :class="{ 'is-selected': isSelectedCard(item), 'is-booked': isBooked(item) }"
                @click="onVaccine(item)"
              >
                <div class="vaccine__tag" :style="{ background: item.tagBg }">
                  <span class="vaccine__tag-text">{{ item.tag }}</span>
                </div>
                <div class="vaccine__main">
                  <div class="vaccine__line">
                    <h3 class="vaccine__name">{{ item.name }}</h3>
                    <span class="vaccine__doses">{{ item.doses }}</span>
                  </div>
                  <p class="vaccine__hospital">{{ item.hospital }}</p>
                  <span class="vaccine__time">{{ item.timeText }}</span>
                  <span v-if="isBooked(item)" class="booked-tag">已预约 · 点击沟通</span>
                </div>
              </article>

              <!-- 体检 Tab -->
              <article
                v-else
                class="checkup"
                :class="{ 'is-selected': isSelectedCard(item), 'is-booked': isBooked(item) }"
                @click="onCheckup(item)"
              >
                <div class="checkup__tag" :style="{ background: item.tagBg }">
                  <span class="checkup__tag-text">{{ item.tag }}</span>
                </div>
                <div class="checkup__main">
                  <div class="checkup__line">
                    <h3 class="checkup__name">{{ item.name }}</h3>
                    <span class="checkup__meta">{{ item.meta }}</span>
                  </div>
                  <p class="checkup__hospital">{{ item.hospital }}</p>
                  <span class="checkup__time">{{ item.timeText }}</span>
                  <span v-if="isBooked(item)" class="booked-tag">已预约 · 点击沟通</span>
                </div>
              </article>
            </SwipeItem>

            <!-- 空状态 -->
            <div v-if="displayedList.length === 0" class="empty">
              <svg viewBox="0 0 64 64" class="empty__icon" aria-hidden="true">
                <circle cx="32" cy="32" r="28" fill="#d1fae5" />
                <path d="M22 32h20M32 22v20" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
              </svg>
              <p class="empty__text">当日暂无{{ activeTabLabel }}排班</p>
              <p class="empty__hint">试试切换其他日期或月份</p>
            </div>

            <!-- 列表结尾 -->
            <div v-else class="end">
              <span class="end__line"></span>
              <span class="end__text">没有更多了</span>
              <span class="end__line"></span>
            </div>
          </div>
        </main>
      </PullToRefresh>

      <!-- 底部确认预约栏 -->
      <footer v-if="confirmInfo" class="confirm-bar">
        <div class="confirm-bar__info">
          <span class="confirm-bar__name">{{ confirmInfo.name }}</span>
          <span class="confirm-bar__meta">{{ confirmInfo.meta }}</span>
        </div>
        <button class="confirm-bar__btn" type="button" @click="onConfirmBooking">
          确认预约
        </button>
      </footer>
    </div>

    <!-- 科室选择（点击日期后自动弹出） -->
    <DepartmentPicker
      v-model="deptOpen"
      :departments="departments"
      :value="selectedDept"
      @confirm="onDeptConfirm"
    />

    <!-- 时段选择（选完科室后自动弹出） -->
    <TimeSlotPicker
      v-model="slotOpen"
      :value="selectedSlot"
      @confirm="onSlotConfirm"
    />

    <!-- 预约成功后的对话窗口 -->
    <ChatDialog
      :visible="chatVisible"
      :session-id="chatSessionId"
      :peer="chatPeer"
      :booking="chatBooking"
      @close="chatVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import SwipeItem from '@/components/SwipeItem.vue'
import LazyImage from '@/components/LazyImage.vue'
import ChatDialog from '@/components/ChatDialog.vue'
import DepartmentPicker from '@/components/DepartmentPicker.vue'
import TimeSlotPicker from '@/components/TimeSlotPicker.vue'
import { toast } from '@/utils/toast'
import { getSession } from '@/utils/chatStore'
import { addBooking } from '@/utils/bookingStore'
import { commonDepartments } from '@/data/regions'
import {
  appointmentTabs,
  months,
  datesByMonth,
  inquirySchedules,
  vaccineSchedules,
  checkupPackages
} from './appointmentMock'

const route = useRoute()
const router = useRouter()

/* ========== 状态 ========== */
const activeTab = ref('inquiry')
const currentMonthId = ref('2023-11') // 默认 11 月（图片中的疫苗页面）
const selectedDate = ref({ day: 9, weekday: '周五' })
const dateRail = ref(null)

/* 预约选择态：selectedId 当前选中卡片，bookedIds 已预约集合 */
const selectedId = ref(null)
const bookedIds = ref([])

/* ========== 预约流程：日期 → 科室 → 时段 ========== */
const deptOpen = ref(false)
const slotOpen = ref(false)
const selectedDept = ref('')
const selectedSlot = ref(null) // { label: '08:00-08:30', period: '上午' }
const departments = commonDepartments

function onDeptConfirm(dept) {
  selectedDept.value = dept || ''
  selectedSlot.value = null
  /* 选完科室自动进入时段选择 */
  if (dept) slotOpen.value = true
}

function onSlotConfirm(slot) {
  selectedSlot.value = slot || null
}

/* ========== 对话窗口 ========== */
const chatVisible = ref(false)
const chatSessionId = ref('')
const chatPeer = ref({ name: '', sub: '', avatar: '' })
const chatBooking = ref({ dateLabel: '', timeText: '' })

function buildSessionId(item) {
  return `appt-${activeTab.value}-${item.id}`
}

/* 打开对话窗口：已有记录则复用其中的对方/预约信息（保留下单时的日期） */
function openChatFor(sessionId, peer, booking) {
  const existing = getSession(sessionId)
  chatPeer.value = existing ? existing.peer : peer
  chatBooking.value = existing ? existing.booking : booking
  chatSessionId.value = sessionId
  chatVisible.value = true
}

function openChat(item) {
  openChatFor(
    buildSessionId(item),
    {
      name: item.name,
      sub:
        activeTab.value === 'inquiry'
          ? `${item.dept} ${item.title} · ${item.hospital}`
          : item.hospital,
      avatar: item.avatar || ''
    },
    {
      dateLabel: `${currentMonthLabel.value}${selectedDate.value.day}日`,
      timeText: item.timeText
    }
  )
}

/* ========== 计算 ========== */
const currentMonthLabel = computed(
  () => months.find((m) => m.id === currentMonthId.value)?.label ?? ''
)
const currentDates = computed(() => datesByMonth[currentMonthId.value] ?? [])
const activeTabLabel = computed(
  () => appointmentTabs.find((t) => t.id === activeTab.value)?.label ?? ''
)

const baseList = computed(() => {
  if (activeTab.value === 'inquiry') return inquirySchedules
  if (activeTab.value === 'vaccine') return vaccineSchedules
  if (activeTab.value === 'checkup') return checkupPackages
  return []
})

/* 当前选中卡片对象（卡片流预约用） */
const selectedItem = computed(() =>
  displayedList.value.find((x) => x.id === selectedId.value) || null
)

/* 确认栏信息：卡片流（选中卡片）或 挂号流（科室+时段） */
const confirmInfo = computed(() => {
  const dateLabel = `${currentMonthLabel.value}${selectedDate.value.day}日(${selectedDate.value.weekday})`
  const item = selectedItem.value
  if (item) {
    const timeText = selectedSlot.value ? selectedSlot.value.label : item.timeText
    const dept = selectedDept.value || item.dept
    return { name: item.name, meta: `${dept} · ${dateLabel} · ${timeText}` }
  }
  if (selectedDept.value && selectedSlot.value) {
    return {
      name: `${activeTabLabel.value} · ${selectedDept.value}`,
      meta: `${dateLabel} · ${selectedSlot.value.label}`
    }
  }
  return null
})

/* 卡片是否可约（问诊需 status===available，疫苗/体检恒可约） */
function isBookable(item) {
  return activeTab.value === 'inquiry' ? item.status === 'available' : true
}

function isBooked(item) {
  return bookedIds.value.includes(item.id)
}

function isSelectedCard(item) {
  return selectedId.value === item.id
}

const displayedList = ref([])

// 当 tab / month / 选中日期变化时刷新 displayedList（深拷贝）
function refreshList() {
  displayedList.value = JSON.parse(JSON.stringify(baseList.value))
  // 默认把 day===selectedDate.day 之外的所有数据保留；这里简单按日期筛选可扩展
  scrollRailToSelected()
}

watch(
  [activeTab, currentMonthId],
  () => {
    selectedId.value = null
    // 切换月份时把 selectedDate 同步到该月默认选中项
    const list = currentDates.value
    const def = list.find((d) => d.selected) || list.find((d) => d.available) || list[0]
    if (def) selectedDate.value = { day: def.day, weekday: def.weekday }
    refreshList()
  },
  { immediate: true }
)

watch(selectedDate, () => {
  selectedId.value = null
  selectedSlot.value = null
  refreshList()
})

/* ========== 选中态辅助 ========== */
function isSelected(d) {
  return d.day === selectedDate.value.day && d.weekday === selectedDate.value.weekday
}

/* ========== 事件 ========== */
function switchTab(id) {
  if (activeTab.value === id) return
  activeTab.value = id
  selectedId.value = null
}

function pickDate(d, _idx) {
  if (!d.available) return
  selectedDate.value = { day: d.day, weekday: d.weekday }
  selectedId.value = null
  selectedSlot.value = null
  /* 点击日期后进入科室选择 */
  deptOpen.value = true
}

/* 选中卡片（待确认预约）；已预约的卡片点击直接进入对话 */
function selectCard(item) {
  if (isBooked(item)) return openChat(item)
  if (!isBookable(item)) return toast('该时段已约满')
  selectedId.value = item.id
}

function onSchedule(item) {
  selectCard(item)
}

function onCancel(item, _idx) {
  // 取消已预约：移出 bookedIds
  const i = bookedIds.value.indexOf(item.id)
  if (i > -1) {
    bookedIds.value.splice(i, 1)
    toast('已取消预约')
  } else {
    toast('该时段尚未预约')
  }
}

function onVaccine(item) {
  selectCard(item)
}

function onCheckup(item) {
  selectCard(item)
}

/* 底部确认预约：生成约号 + 记录预约 + 消息提醒数据 + 弹出对话窗口 */
function onConfirmBooking() {
  const info = confirmInfo.value
  if (!info) return
  const item = selectedItem.value
  const dateLabel = `${currentMonthLabel.value}${selectedDate.value.day}日`
  const weekday = selectedDate.value.weekday
  const timeText = selectedSlot.value ? selectedSlot.value.label : item.timeText
  const dept = selectedDept.value || (item && item.dept) || activeTabLabel.value
  const name = item ? item.name : `${selectedDept.value}门诊`
  const hospital = item ? item.hospital : '绿芽健康互联网医院'
  const avatar = item ? item.avatar || '' : ''

  /* 卡片流：标记已预约 */
  if (item) bookedIds.value.push(item.id)

  /* 会话 ID：卡片流按卡片，挂号流按 tab+科室+日期 */
  const sessionId = item
    ? buildSessionId(item)
    : `appt-${activeTab.value}-${dept}-${dateLabel}`

  /* 生成约号并持久化（消息提醒 + 我的页同步读取） */
  const booking = addBooking({
    tab: activeTab.value,
    sessionId,
    name,
    dept,
    hospital,
    avatar,
    dateLabel,
    weekday,
    timeText
  })

  toast(`预约成功，约号 ${booking.serialNo}`)
  selectedId.value = null

  openChatFor(
    sessionId,
    {
      name,
      sub: item && item.title ? `${item.dept} ${item.title} · ${hospital}` : `${dept} · ${hospital}`,
      avatar
    },
    { dateLabel, timeText }
  )
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

/* ========== 删除（联动三类列表） ========== */
function removeItem(id) {
  const idx = displayedList.value.findIndex((x) => x.id === id)
  if (idx > -1) displayedList.value.splice(idx, 1)
  if (selectedId.value === id) selectedId.value = null
  const bi = bookedIds.value.indexOf(id)
  if (bi > -1) bookedIds.value.splice(bi, 1)
}

/* ========== 下拉刷新 ========== */
const isRefreshing = ref(false)
async function handleRefresh(done) {
  if (isRefreshing.value) return done && done()
  isRefreshing.value = true
  await new Promise((r) => setTimeout(r, 600))
  displayedList.value = JSON.parse(JSON.stringify(baseList.value))
  isRefreshing.value = false
  done && done()
}

/* ========== 滚动到选中日期 ========== */
function scrollRailToSelected() {
  nextTick(() => {
    const rail = dateRail.value
    if (!rail) return
    const target = rail.querySelector('.date--selected')
    if (target) {
      rail.scrollTo({
        left: target.offsetLeft - rail.clientWidth / 2 + target.clientWidth / 2,
        behavior: 'smooth'
      })
    } else {
      rail.scrollTo({ left: 0, behavior: 'smooth' })
    }
  })
}

/* ========== iOS 橡皮筋防护 ========== */
function onTouchMove(e) {
  if (e.touches && e.touches[0].clientY < 0) e.preventDefault?.()
}
onMounted(() => {
  // 支持 /appointment?tab=vaccine|checkup|inquiry 指定初始 Tab
  const q = route.query.tab
  if (q && appointmentTabs.some((t) => t.id === q)) activeTab.value = q
  document.addEventListener('touchmove', onTouchMove, { passive: false })
})
onUnmounted(() => {
  document.removeEventListener('touchmove', onTouchMove)
})

// watch already imported at top of script
</script>

<style scoped>
.appointment {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-page, #f4f7fa);
  display: flex;
  flex-direction: column;
}

/* ========== 头部 ========== */
.appt-header {
  position: relative;
  height: 92px;
  padding-top: env(safe-top, 0px);
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  padding-right: 12px;
  color: #fff;
}

.appt-header__back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}
.appt-header__back:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.25);
}
.appt-header__back svg {
  width: 22px;
  height: 22px;
}

.appt-header__title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.appt-header__placeholder {
  width: 36px;
  height: 36px;
}

/* ========== 主体白卡 ========== */
.appt-body {
  margin-top: -16px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  flex: 1;
  padding: 16px 14px 0;
  box-shadow: 0 -4px 16px rgba(45, 212, 168, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.appt-main {
  padding-bottom: 24px;
  flex: 1;
}

/* ========== Tab 切换 ========== */
.tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 18px;
}

.tabs__item {
  height: 32px;
  border-radius: 16px;
  border: 1px solid var(--primary, #2dd4a8);
  background: #fff;
  color: var(--primary, #2dd4a8);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease;
}
.tabs__item:active {
  transform: scale(0.96);
}
.tabs__item--active {
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(45, 212, 168, 0.32);
}

/* ========== 日历 ========== */
.calendar {
  margin-bottom: 16px;
}

.calendar__month {
  font-size: 13px;
  color: var(--text-sub, #6b7280);
  margin: 0 0 10px;
  font-weight: 500;
}

.calendar__rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 2px 8px;
}
.calendar__rail::-webkit-scrollbar {
  display: none;
}

.date {
  flex: 0 0 auto;
  width: 46px;
  height: 64px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  position: relative;
}
.date:active {
  transform: scale(0.94);
}

.date__day {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  color: var(--text-main, #1f2937);
}
.date__week {
  font-size: 11px;
  color: var(--text-sub, #6b7280);
  line-height: 1;
}

.date--selected {
  background: linear-gradient(180deg, #34d399 0%, #10b981 100%);
  border-color: transparent;
  box-shadow: 0 6px 14px rgba(16, 185, 129, 0.32);
}
.date--selected .date__day,
.date--selected .date__week {
  color: #fff;
}

.date--disabled {
  background: #f3f4f6;
  border-color: #e5e7eb;
  cursor: not-allowed;
}
.date--disabled .date__day,
.date--disabled .date__week {
  color: #d1d5db;
}

.date__dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
}
.date__dot--top {
  top: 6px;
}
.date__dot--bottom {
  bottom: 6px;
}

/* ========== 预约流程条（科室 → 时段） ========== */
.flow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.flow__chip {
  flex: 1;
  height: 36px;
  border-radius: 10px;
  border: 1px dashed #c9d4dd;
  background: #f8fafc;
  color: var(--text-sub, #6b7280);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.flow__chip--active {
  border-style: solid;
  border-color: var(--primary, #2dd4a8);
  background: #f0fdf9;
  color: #0e9f7c;
  font-weight: 600;
}

.flow__chip:active {
  transform: scale(0.97);
}

.flow__arrow {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #b6c2cc;
  display: inline-flex;
}

.flow__arrow svg {
  width: 100%;
  height: 100%;
}

/* ========== 列表 ========== */
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list__item-wrap {
  display: block;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  transition: transform 0.18s ease;
}

/* ===== 问诊卡片 ===== */
.schedule {
  display: flex;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
  background: #fff;
  border-radius: 12px;
}
.schedule:active {
  background: #f9fafb;
}
.schedule__avatar {
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f7ef, #c4f0e0);
}
.schedule__avatar :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.schedule__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.schedule__line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.schedule__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
}
.schedule__dept {
  font-size: 12px;
  color: var(--text-sub, #6b7280);
}
.schedule__hospital {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.schedule__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
.schedule__time {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
}
.schedule__action {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: transform 0.15s ease, background 0.2s ease;
}
.schedule__action:active {
  transform: scale(0.94);
  background: #fef2f2;
}
.schedule__action--full {
  color: #9ca3af;
  cursor: not-allowed;
}
.schedule__action--full:active {
  transform: none;
  background: transparent;
}

/* ===== 疫苗卡片 ===== */
.vaccine {
  display: flex;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
  background: #fff;
  border-radius: 12px;
}
.vaccine:active {
  background: #f9fafb;
}
.vaccine__tag {
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}
.vaccine__tag-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.vaccine__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.vaccine__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.vaccine__name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
}
.vaccine__doses {
  font-size: 11px;
  background: #ecfdf5;
  color: #047857;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
.vaccine__hospital {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vaccine__time {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 2px;
}

/* ===== 体检卡片 ===== */
.checkup {
  display: flex;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
  background: #fff;
  border-radius: 12px;
}
.checkup:active {
  background: #f9fafb;
}
.checkup__tag {
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}
.checkup__tag-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.checkup__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.checkup__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.checkup__name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #1f2937);
}
.checkup__meta {
  font-size: 11px;
  background: #fef3c7;
  color: #b45309;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
.checkup__hospital {
  margin: 0;
  font-size: 12px;
  color: var(--text-sub, #6b7280);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.checkup__time {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 2px;
}

/* ========== 空状态 / 结尾 ========== */
.empty {
  text-align: center;
  padding: 48px 0;
}
.empty__icon {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}
.empty__text {
  margin: 0;
  font-size: 14px;
  color: var(--text-main, #1f2937);
  font-weight: 500;
}
.empty__hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-sub, #6b7280);
}

.end {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 8px 4px;
}
.end__line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.end__text {
  font-size: 12px;
  color: var(--text-sub, #9ca3af);
}

/* ========== 响应式 ========== */
@media (min-width: 481px) {
  .appt-body {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* ========== 选中 / 已预约态 ========== */
.schedule,
.vaccine,
.checkup {
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.schedule.is-selected,
.vaccine.is-selected,
.checkup.is-selected {
  box-shadow: 0 0 0 2px var(--primary, #2dd4a8);
  background: #f0fdf9;
}

.schedule.is-booked,
.vaccine.is-booked,
.checkup.is-booked {
  opacity: 0.7;
}

.schedule__action {
  flex-shrink: 0;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--primary, #2dd4a8);
  background: #fff;
  color: var(--primary, #0e9f7c);
  font-size: 12px;
  font-weight: 600;
}

.schedule__action--booked {
  border-color: #10b981;
  color: #10b981;
}

.booked-tag {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #d1fae5;
  color: #047857;
  font-size: 11px;
  font-weight: 600;
}

/* ========== 底部确认预约栏 ========== */
.confirm-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px calc(12px + var(--safe-bottom, 0px));
  background: #fff;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  z-index: 5;
}

.confirm-bar__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.confirm-bar__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.confirm-bar__meta {
  font-size: 12px;
  color: var(--text-sub, #6b7280);
}

.confirm-bar__btn {
  flex-shrink: 0;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(45, 212, 168, 0.32);
}

.confirm-bar__btn:active {
  transform: scale(0.96);
}
</style>
