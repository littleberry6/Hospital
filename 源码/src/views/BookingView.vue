<template>
  <div class="booking">
    <!-- 沉浸式薄荷绿头部 -->
    <header class="bk-header">
      <button class="bk-header__back" type="button" @click="goBack" aria-label="返回">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="bk-header__title">{{ stepTitle }}</h1>
      <span class="bk-header__placeholder" aria-hidden="true"></span>
    </header>

    <!-- 步骤进度条 -->
    <nav class="stepper" v-if="step < 6">
      <div class="stepper__inner">
        <template v-for="(s, i) in stepLabels" :key="s">
          <div class="stepper__dot" :class="{ 'stepper__dot--done': i < step, 'stepper__dot--active': i === step }">
            <svg v-if="i < step" viewBox="0 0 24 24" class="stepper__check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <div v-if="i < stepLabels.length - 1" class="stepper__bar" :class="{ 'stepper__bar--done': i < step }"></div>
        </template>
      </div>
      <p class="stepper__label">{{ stepLabels[step] }}</p>
    </nav>

    <div class="bk-body">
      <!-- ===== Step 0: 选择医院 ===== -->
      <section v-if="step === 0" class="bk-step">
        <div class="bk-search">
          <svg viewBox="0 0 24 24" class="bk-search__icon"><path fill="#9ca3af" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.57 14 6 12.43 6 10.5S7.57 7 9.5 7 13 8.57 13 10.5 11.43 14 9.5 14z"/></svg>
          <input v-model="hospitalSearch" type="search" class="bk-search__input" placeholder="搜索医院名称" />
        </div>
        <div class="filter-chips">
          <button v-for="f in levelFilters" :key="f.id" type="button" class="filter-chip" :class="{ 'filter-chip--active': activeLevel === f.id }" @click="activeLevel = f.id">{{ f.label }}</button>
        </div>
        <article
          v-for="h in filteredHospitals"
          :key="h.id"
          class="hospital-card"
          :class="{ 'hospital-card--selected': selectedHospital?.id === h.id }"
          @click="selectHospital(h)"
        >
          <div class="hospital-card__left">
            <div class="hospital-card__badge" :class="`hospital-card__badge--${h.level}`">{{ h.levelLabel }}</div>
          </div>
          <div class="hospital-card__main">
            <h3 class="hospital-card__name">{{ h.name }}</h3>
            <p class="hospital-card__addr">{{ h.address }}</p>
            <div class="hospital-card__tags">
              <span v-for="t in h.tags" :key="t" class="hospital-card__tag">{{ t }}</span>
            </div>
          </div>
          <div class="hospital-card__right">
            <span class="hospital-card__rating">
              <svg viewBox="0 0 24 24" class="hospital-card__star"><path fill="#f59e0b" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {{ h.rating }}
            </span>
            <span class="hospital-card__dist">{{ h.distance }}km</span>
          </div>
        </article>
      </section>

      <!-- ===== Step 1: 选择科室 ===== -->
      <section v-if="step === 1" class="bk-step">
        <div class="dept-info">
          <span class="dept-info__hospital">{{ selectedHospital?.name }}</span>
          <span class="dept-info__level">{{ selectedHospital?.levelLabel }}</span>
        </div>
        <div class="dept-grid">
          <button
            v-for="d in availableDepts"
            :key="d"
            type="button"
            class="dept-item"
            :class="{ 'dept-item--selected': selectedDept === d }"
            @click="selectDept(d)"
          >
            <span class="dept-item__icon" :style="{ background: deptColor(d) }">{{ d.charAt(0) }}</span>
            <span class="dept-item__name">{{ d }}</span>
            <span v-if="getDoctorCount(d) > 0" class="dept-item__count">{{ getDoctorCount(d) }}位医生</span>
          </button>
        </div>
      </section>

      <!-- ===== Step 2: 选号源 + 医生 + 排班 ===== -->
      <section v-if="step === 2" class="bk-step">
        <!-- 号源类型切换 -->
        <div class="reg-type">
          <button type="button" class="reg-type__btn" :class="{ 'reg-type__btn--active': regType === 'regular' }" @click="switchRegType('regular')">
            <div class="reg-type__head">
              <span class="reg-type__title">普通号</span>
              <span class="reg-type__fee">¥{{ feeData.regular.fee }}</span>
            </div>
            <p class="reg-type__desc">{{ feeData.regular.desc }}</p>
          </button>
          <button type="button" class="reg-type__btn" :class="{ 'reg-type__btn--active': regType === 'specialist' }" @click="switchRegType('specialist')">
            <div class="reg-type__head">
              <span class="reg-type__title">专家号</span>
              <span class="reg-type__fee">{{ selectedDoctor ? `¥${selectedDoctor.fee}` : '¥30~100' }}</span>
            </div>
            <p class="reg-type__desc">{{ feeData.specialist.desc }}</p>
          </button>
        </div>

        <!-- 专家号：先选医生 -->
        <div v-if="regType === 'specialist'" class="doctor-list">
          <h4 class="bk-subtitle">选择医生</h4>
          <article
            v-for="doc in doctors"
            :key="doc.id"
            class="doctor-card"
            :class="{ 'doctor-card--selected': selectedDoctor?.id === doc.id }"
            @click="selectDoctor(doc)"
          >
            <LazyImage :src="doc.avatar" :alt="doc.name" class="doctor-card__avatar" />
            <div class="doctor-card__main">
              <div class="doctor-card__line">
                <span class="doctor-card__name">{{ doc.name }}</span>
                <span class="doctor-card__title">{{ doc.title }}</span>
              </div>
              <p class="doctor-card__expertise">{{ doc.expertise }}</p>
              <div class="doctor-card__footer">
                <span class="doctor-card__fee">挂号费 ¥{{ doc.fee }}</span>
                <span v-if="selectedDoctor?.id === doc.id" class="doctor-card__selected-tag">已选</span>
              </div>
            </div>
          </article>
          <div v-if="doctors.length === 0" class="bk-empty">
            <p>该科室暂无专家排班，请选择普通号</p>
          </div>
        </div>

        <!-- 排班日历 + 时段 -->
        <div v-if="regType === 'regular' || selectedDoctor" class="schedule">
          <h4 class="bk-subtitle">选择就诊日期</h4>
          <div class="date-rail">
            <button
              v-for="(d, i) in dates"
              :key="d.full"
              type="button"
              class="date-card"
              :class="{ 'date-card--selected': selectedDateIndex === i }"
              @click="selectDate(i)"
            >
              <span class="date-card__week">{{ d.weekday }}</span>
              <span class="date-card__date">{{ d.dateShort }}</span>
            </button>
          </div>

          <h4 class="bk-subtitle">选择就诊时段</h4>
          <div class="period-tabs">
            <button
              v-for="p in periods"
              :key="p.key"
              type="button"
              class="period-tab"
              :class="{ 'period-tab--active': activePeriod === p.key }"
              @click="activePeriod = p.key"
            >
              <span class="period-tab__icon">{{ p.icon }}</span>
              <span class="period-tab__label">{{ p.label }}</span>
              <span v-if="periodSlots(p.key).length > 0" class="period-tab__count">{{ totalRemaining(p.key) }}个号源</span>
              <span v-else class="period-tab__none">无号</span>
            </button>
          </div>

          <!-- 时段网格 -->
          <div class="slot-grid" v-if="periodSlots(activePeriod).length > 0">
            <button
              v-for="slot in periodSlots(activePeriod)"
              :key="slot.time"
              type="button"
              class="slot-card"
              :class="{ 'slot-card--selected': selectedSlot?.time === slot.time, 'slot-card--full': slot.status === 'full' }"
              :disabled="slot.status === 'full'"
              @click="selectSlot(slot)"
            >
              <span class="slot-card__time">{{ slot.time }}</span>
              <span class="slot-card__remain" :class="{ 'slot-card__remain--low': slot.remaining <= 3 }">
                余{{ slot.remaining }}
              </span>
            </button>
          </div>
          <div v-else class="bk-empty bk-empty--small">
            <p>该时段暂无排班</p>
          </div>
        </div>
      </section>

      <!-- ===== Step 3: 选择就诊人 ===== -->
      <section v-if="step === 3" class="bk-step">
        <div class="bk-summary-bar">
          <span class="bk-summary-bar__hospital">{{ selectedHospital.name }}</span>
          <span class="bk-summary-bar__dept">{{ selectedDept }}</span>
          <span class="bk-summary-bar__date">{{ selectedDateObj.date }} {{ selectedDateObj.weekday }}</span>
          <span class="bk-summary-bar__slot">{{ selectedSlot?.time }}</span>
        </div>
        <h4 class="bk-subtitle">选择就诊人</h4>
        <article
          v-for="p in patients"
          :key="p.id"
          class="patient-card"
          :class="{ 'patient-card--selected': selectedPatient?.id === p.id }"
          @click="selectedPatient = p"
        >
          <div class="patient-card__avatar" :style="{ background: patientBg(p.type) }">
            {{ p.name.charAt(0) }}
          </div>
          <div class="patient-card__main">
            <div class="patient-card__line">
              <span class="patient-card__name">{{ p.name }}</span>
              <span class="patient-card__type" :style="{ background: patientBg(p.type), color: '#fff' }">{{ typeLabel(p.type) }}</span>
              <span v-if="p.isDefault" class="patient-card__default">默认</span>
            </div>
            <p class="patient-card__id">{{ maskId(p.idCard) }}</p>
            <p class="patient-card__phone">{{ maskPhone(p.phone) }}</p>
          </div>
          <svg v-if="selectedPatient?.id === p.id" viewBox="0 0 24 24" class="patient-card__check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#2dd4a8"/></svg>
        </article>
        <button class="bk-add-patient" type="button" @click="router.push('/patient/edit')">
          <span class="bk-add-patient__plus">+</span> 添加就诊人
        </button>
      </section>

      <!-- ===== Step 4: 确认挂号信息 ===== -->
      <section v-if="step === 4" class="bk-step">
        <div class="confirm-card">
          <h3 class="confirm-card__title">挂号信息确认</h3>
          <div class="confirm-row">
            <span class="confirm-row__label">医院</span>
            <span class="confirm-row__value">{{ selectedHospital.name }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-row__label">科室</span>
            <span class="confirm-row__value">{{ selectedDept }}</span>
          </div>
          <div class="confirm-row" v-if="selectedDoctor">
            <span class="confirm-row__label">医生</span>
            <span class="confirm-row__value">{{ selectedDoctor.name }} {{ selectedDoctor.title }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-row__label">号源类型</span>
            <span class="confirm-row__value">{{ regType === 'regular' ? '普通号' : '专家号' }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-row__label">就诊日期</span>
            <span class="confirm-row__value">{{ selectedDateObj.date }} {{ selectedDateObj.weekday }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-row__label">就诊时段</span>
            <span class="confirm-row__value">{{ periodLabel(activePeriod) }} {{ selectedSlot?.time }}</span>
          </div>
          <div class="confirm-row">
            <span class="confirm-row__label">就诊人</span>
            <span class="confirm-row__value">{{ selectedPatient?.name }} {{ maskId(selectedPatient?.idCard) }}</span>
          </div>
          <div class="confirm-divider"></div>
          <div class="confirm-row confirm-row--highlight">
            <span class="confirm-row__label">挂号费</span>
            <span class="confirm-row__value confirm-row__value--fee">¥{{ computedFee }}</span>
          </div>
        </div>
        <div class="confirm-notice">
          <svg viewBox="0 0 24 24" class="confirm-notice__icon"><path fill="#f59e0b" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          <p>请确认以上信息无误，提交后将进入支付环节。挂号费支付后不支持退改。</p>
        </div>
      </section>

      <!-- ===== Step 5: 支付 ===== -->
      <section v-if="step === 5" class="bk-step bk-step--pay">
        <div class="pay-amount">
          <p class="pay-amount__label">支付金额</p>
          <p class="pay-amount__num">¥{{ computedFee }}</p>
        </div>
        <h4 class="bk-subtitle">选择支付方式</h4>
        <label
          v-for="m in paymentMethods"
          :key="m.id"
          class="pay-method"
          :class="{ 'pay-method--selected': selectedPayMethod === m.id }"
        >
          <input type="radio" :value="m.id" v-model="selectedPayMethod" class="pay-method__radio" />
          <span class="pay-method__icon" :style="{ background: m.color }">
            <span class="pay-method__icon-text">{{ m.name.charAt(0) }}</span>
          </span>
          <div class="pay-method__main">
            <span class="pay-method__name">{{ m.name }}</span>
            <span class="pay-method__desc">{{ m.desc }}</span>
          </div>
          <span class="pay-method__check" :class="{ 'pay-method__check--on': selectedPayMethod === m.id }"></span>
        </label>
        <div v-if="paying" class="pay-loading">
          <div class="pay-loading__spinner"></div>
          <p>正在跳转{{ payMethodName }}...</p>
        </div>
      </section>

      <!-- ===== Step 6: 挂号成功 ===== -->
      <section v-if="step === 6" class="bk-step bk-step--success">
        <div class="success-anim">
          <svg viewBox="0 0 52 52" class="success-anim__svg">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#2dd4a8" stroke-width="2" class="success-anim__circle" />
            <path fill="none" stroke="#2dd4a8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8l16-16" class="success-anim__check" />
          </svg>
        </div>
        <h2 class="success-title">挂号成功</h2>

        <!-- 预约单 -->
        <div class="slip">
          <div class="slip__perforation"></div>
          <div class="slip__head">
            <span class="slip__hospital">{{ selectedHospital.name }}</span>
            <span class="slip__level">{{ selectedHospital.levelLabel }}</span>
          </div>
          <div class="slip__body">
            <div class="slip__row">
              <span class="slip__label">就诊序号</span>
              <span class="slip__value slip__value--serial">{{ paidBooking?.visitNo }}</span>
            </div>
            <div class="slip__row">
              <span class="slip__label">预约号</span>
              <span class="slip__value">{{ paidBooking?.serialNo }}</span>
            </div>
            <div class="slip__row">
              <span class="slip__label">科室</span>
              <span class="slip__value">{{ selectedDept }}</span>
            </div>
            <div class="slip__row" v-if="selectedDoctor">
              <span class="slip__label">医生</span>
              <span class="slip__value">{{ selectedDoctor.name }} {{ selectedDoctor.title }}</span>
            </div>
            <div class="slip__row">
              <span class="slip__label">就诊日期</span>
              <span class="slip__value">{{ selectedDateObj.date }} {{ selectedDateObj.weekday }}</span>
            </div>
            <div class="slip__row">
              <span class="slip__label">就诊时间</span>
              <span class="slip__value">{{ periodLabel(activePeriod) }} {{ selectedSlot?.time }}</span>
            </div>
            <div class="slip__row">
              <span class="slip__label">就诊人</span>
              <span class="slip__value">{{ selectedPatient?.name }}</span>
            </div>
            <div class="slip__divider"></div>
            <div class="slip__row slip__row--fee">
              <span class="slip__label">挂号费</span>
              <span class="slip__value slip__value--fee">¥{{ computedFee }} <span class="slip__pay-tag">已支付({{ payMethodName }})</span></span>
            </div>
          </div>
          <div class="slip__perforation slip__perforation--bottom"></div>
        </div>

        <!-- 提示 -->
        <div class="success-tips">
          <p>1. 请提前 30 分钟到达医院，凭就诊序号到分诊台报到</p>
          <p>2. 就诊序号 {{ paidBooking?.visitNo }} 为您当天的排队号码</p>
          <p>3. 如需取消挂号，请在就诊日前一天操作</p>
        </div>

        <!-- 操作按钮 -->
        <div class="success-actions">
          <button class="success-btn success-btn--primary" type="button" @click="openChat">进入在线咨询</button>
          <button class="success-btn success-btn--ghost" type="button" @click="router.push('/mine')">返回我的</button>
        </div>
      </section>
    </div>

    <!-- 底部导航栏 -->
    <footer v-if="step < 6" class="bk-footer">
      <button v-if="step > 0" class="bk-footer__prev" type="button" @click="step--">上一步</button>
      <button v-if="step === 0" class="bk-footer__next" type="button" :disabled="!selectedHospital" @click="step = 1">下一步</button>
      <button v-else-if="step === 1" class="bk-footer__next" type="button" :disabled="!selectedDept" @click="goToStep2">下一步</button>
      <button v-else-if="step === 2" class="bk-footer__next" type="button" :disabled="!canProceedStep2" @click="step = 3">下一步</button>
      <button v-else-if="step === 3" class="bk-footer__next" type="button" :disabled="!selectedPatient" @click="step = 4">下一步</button>
      <button v-else-if="step === 4" class="bk-footer__next bk-footer__next--submit" type="button" @click="submitOrder">提交挂号</button>
      <button v-else-if="step === 5" class="bk-footer__next bk-footer__next--pay" type="button" :disabled="!selectedPayMethod || paying" @click="doPayment">
        {{ paying ? '支付中...' : `立即支付 ¥${computedFee}` }}
      </button>
    </footer>

    <!-- 挂号成功后的对话窗口 -->
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LazyImage from '@/components/LazyImage.vue'
import ChatDialog from '@/components/ChatDialog.vue'
import { toast } from '@/utils/toast'
import { addPaidBooking } from '@/utils/bookingStore'
import { getPatients, getDefaultPatient, ensureSeed } from '@/utils/patientStore'
import {
  bookingHospitals,
  hospitalDeptMap,
  bookingDoctors,
  feeData,
  generateDates,
  generateSchedule,
  generateRegularSchedule,
  getDoctorsByHospitalDept,
  paymentMethods
} from './bookingMock'

const router = useRouter()

/* ========== 步骤 ========== */
const stepLabels = ['选择医院', '选择科室', '号源排班', '就诊人', '确认信息', '在线支付', '挂号成功']
const step = ref(0)
const stepTitle = computed(() => stepLabels[step.value] || '预约挂号')

/* ========== Step 0: 医院 ========== */
const hospitalSearch = ref('')
const activeLevel = ref('all')
const levelFilters = [
  { id: 'all', label: '全部' },
  { id: '3A', label: '三甲' },
  { id: '3B', label: '三乙' },
  { id: '2A', label: '二甲' }
]
const selectedHospital = ref(null)

const filteredHospitals = computed(() => {
  let list = bookingHospitals
  if (activeLevel.value !== 'all') list = list.filter((h) => h.level === activeLevel.value)
  if (hospitalSearch.value.trim()) {
    const kw = hospitalSearch.value.trim()
    list = list.filter((h) => h.name.includes(kw) || h.address.includes(kw))
  }
  return list
})

function selectHospital(h) {
  selectedHospital.value = h
  toast(`已选：${h.name}`)
}

/* ========== Step 1: 科室 ========== */
const selectedDept = ref('')
const availableDepts = computed(() => {
  if (!selectedHospital.value) return []
  return hospitalDeptMap[selectedHospital.value.id] || []
})

function selectDept(d) {
  selectedDept.value = d
}

function getDoctorCount(dept) {
  if (!selectedHospital.value) return 0
  return getDoctorsByHospitalDept(selectedHospital.value.id, dept).length
}

const deptColors = ['#2dd4a8', '#60a5fa', '#a855f7', '#fb923c', '#f43f5e', '#22c55e', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899']
function deptColor(d) {
  const idx = d.charCodeAt(0) % deptColors.length
  return deptColors[idx]
}

/* ========== Step 2: 号源 + 医生 + 排班 ========== */
const regType = ref('regular')
const selectedDoctor = ref(null)
const dates = ref(generateDates())
const selectedDateIndex = ref(0)
const activePeriod = ref('morning')
const selectedSlot = ref(null)

const periods = [
  { key: 'morning', label: '上午', icon: '☀' },
  { key: 'afternoon', label: '下午', icon: '☁' },
  { key: 'evening', label: '晚间', icon: '🌙' }
]

const doctors = computed(() => {
  if (!selectedHospital.value || !selectedDept.value) return []
  return getDoctorsByHospitalDept(selectedHospital.value.id, selectedDept.value)
})

const selectedDateObj = computed(() => dates.value[selectedDateIndex.value] || dates.value[0])

// 当前排班数据（根据号源类型 + 医生 + 日期生成）
const currentSchedule = computed(() => {
  if (regType.value === 'specialist' && selectedDoctor.value) {
    return generateSchedule(selectedDoctor.value.id, selectedDateIndex.value)
  }
  if (regType.value === 'regular' && selectedHospital.value) {
    return generateRegularSchedule(selectedHospital.value.id, selectedDateIndex.value)
  }
  return { morning: [], afternoon: [], evening: [] }
})

function periodSlots(key) {
  return currentSchedule.value[key] || []
}

function totalRemaining(key) {
  return periodSlots(key).reduce((sum, s) => sum + s.remaining, 0)
}

function switchRegType(type) {
  regType.value = type
  selectedDoctor.value = null
  selectedSlot.value = null
  if (type === 'regular') {
    activePeriod.value = 'morning'
  }
}

function selectDoctor(doc) {
  selectedDoctor.value = doc
  selectedSlot.value = null
}

function selectDate(idx) {
  selectedDateIndex.value = idx
  selectedSlot.value = null
}

function selectSlot(slot) {
  if (slot.status === 'full') return
  selectedSlot.value = slot
}

function goToStep2() {
  step.value = 2
  // 进入时重置选择
  selectedDoctor.value = null
  selectedSlot.value = null
  activePeriod.value = 'morning'
}

const canProceedStep2 = computed(() => {
  if (regType.value === 'regular') return !!selectedSlot.value
  return !!selectedDoctor.value && !!selectedSlot.value
})

/* ========== Step 3: 就诊人 ========== */
const patients = ref([])
const selectedPatient = ref(null)

function loadPatients() {
  ensureSeed()
  patients.value = getPatients()
  const def = getDefaultPatient()
  if (def) selectedPatient.value = def
}

function typeLabel(type) {
  return { self: '本人', child: '儿童', elderly: '老人', other: '其他' }[type] || '其他'
}

function patientBg(type) {
  return { self: '#2dd4a8', child: '#60a5fa', elderly: '#f59e0b', other: '#a855f7' }[type] || '#6b7280'
}

function maskId(id) {
  if (!id) return ''
  return id.substring(0, 4) + '********' + id.substring(id.length - 4)
}

function maskPhone(phone) {
  if (!phone) return ''
  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)
}

/* ========== Step 4: 确认 ========== */
const computedFee = computed(() => {
  if (regType.value === 'specialist' && selectedDoctor.value) return selectedDoctor.value.fee
  return feeData.regular.fee
})

function periodLabel(key) {
  return periods.find((p) => p.key === key)?.label || ''
}

/* ========== Step 5: 支付 ========== */
const selectedPayMethod = ref('wechat')
const paying = ref(false)
const payMethodName = computed(() => paymentMethods.find((m) => m.id === selectedPayMethod.value)?.name || '')

function submitOrder() {
  step.value = 5
  toast('订单已提交，请选择支付方式')
}

async function doPayment() {
  if (!selectedPayMethod.value || paying.value) return
  paying.value = true
  await new Promise((r) => setTimeout(r, 2000))
  paying.value = false

  // 生成预约单 + 就诊序号
  const booking = addPaidBooking({
    hospital: selectedHospital.value.name,
    hospitalId: selectedHospital.value.id,
    dept: selectedDept.value,
    doctorId: selectedDoctor.value?.id || null,
    doctorName: selectedDoctor.value?.name || null,
    doctorTitle: selectedDoctor.value?.title || null,
    regType: regType.value,
    visitDate: selectedDateObj.value.full,
    visitDateLabel: `${selectedDateObj.value.date} ${selectedDateObj.value.weekday}`,
    visitPeriod: activePeriod.value,
    visitPeriodLabel: periodLabel(activePeriod.value),
    visitTime: selectedSlot.value.time,
    patientId: selectedPatient.value.id,
    patientName: selectedPatient.value.name,
    patientIdCard: selectedPatient.value.idCard,
    fee: computedFee.value,
    paymentMethod: selectedPayMethod.value,
    paymentMethodName: payMethodName.value,
    /* 兼容「我的」页预约卡字段 */
    name: selectedDoctor.value?.name || `${selectedDept.value}门诊`,
    dateLabel: selectedDateObj.value.date,
    weekday: selectedDateObj.value.weekdayRaw,
    timeText: `${periodLabel(activePeriod.value)} ${selectedSlot.value.time}`,
    avatar: selectedDoctor.value?.avatar || '',
    tab: 'booking'
  })

  paidBooking.value = booking
  step.value = 6
  toast('支付成功，挂号已完成！')
}

/* ========== Step 6: 成功 ========== */
const paidBooking = ref(null)

// ChatDialog
const chatVisible = ref(false)
const chatSessionId = ref('')
const chatPeer = ref({ name: '', sub: '', avatar: '' })
const chatBooking = ref({ dateLabel: '', timeText: '' })

function openChat() {
  chatSessionId.value = `booking-${paidBooking.value.id}`
  const doctorName = selectedDoctor.value?.name || selectedDept.value
  chatPeer.value = {
    name: doctorName,
    sub: `${selectedDept.value} · ${selectedHospital.value.name}`,
    avatar: selectedDoctor.value?.avatar || ''
  }
  chatBooking.value = {
    dateLabel: selectedDateObj.value.date,
    timeText: `${periodLabel(activePeriod.value)} ${selectedSlot.value.time}`
  }
  chatVisible.value = true
}

/* ========== 导航 ========== */
function goBack() {
  if (step.value > 0 && step.value < 6) {
    step.value--
  } else if (step.value === 6) {
    router.push('/mine')
  } else {
    if (window.history.length > 1) router.back()
    else router.push('/')
  }
}

/* ========== 初始化 ========== */
onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
.booking {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-page, #f4f7fa);
  display: flex;
  flex-direction: column;
}

/* ========== 头部 ========== */
.bk-header {
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
  flex-shrink: 0;
}
.bk-header__back {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.15); border: none; color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform 0.15s ease, background 0.15s ease;
}
.bk-header__back:active { transform: scale(0.92); background: rgba(255,255,255,0.25); }
.bk-header__back svg { width: 22px; height: 22px; }
.bk-header__title { margin: 0; font-size: 17px; font-weight: 600; }
.bk-header__placeholder { width: 36px; height: 36px; }

/* ========== 步骤进度条 ========== */
.stepper {
  background: #fff;
  padding: 12px 20px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.stepper__inner {
  display: flex; align-items: center; justify-content: center; gap: 0;
}
.stepper__dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: #e5e7eb; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
  transition: all 0.3s ease;
}
.stepper__dot--active {
  background: linear-gradient(180deg, #2dd4a8, #4adebf); color: #fff;
  box-shadow: 0 2px 8px rgba(45,212,168,0.4);
  transform: scale(1.1);
}
.stepper__dot--done {
  background: #2dd4a8; color: #fff;
}
.stepper__check { width: 16px; height: 16px; }
.stepper__bar {
  width: 24px; height: 2px; background: #e5e7eb;
  transition: background 0.3s ease;
}
.stepper__bar--done { background: #2dd4a8; }
.stepper__label {
  text-align: center; margin: 6px 0 0;
  font-size: 12px; color: #6b7280; font-weight: 500;
}

/* ========== 主体 ========== */
.bk-body {
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 16px 14px 100px;
}
.bk-step { display: flex; flex-direction: column; gap: 12px; }
.bk-subtitle { font-size: 14px; font-weight: 600; color: #1f2937; margin: 8px 0 4px; }

/* ========== 搜索 ========== */
.bk-search {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border-radius: 12px; padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.bk-search__icon { width: 18px; height: 18px; flex-shrink: 0; }
.bk-search__input { border: none; outline: none; font-size: 14px; flex: 1; background: transparent; }

/* ========== 筛选 chips ========== */
.filter-chips { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
.filter-chips::-webkit-scrollbar { display: none; }
.filter-chip {
  flex-shrink: 0; padding: 6px 16px; border-radius: 999px;
  border: 1px solid #e5e7eb; background: #fff; color: #6b7280;
  font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
}
.filter-chip--active {
  border-color: #2dd4a8; background: #f0fdf9; color: #0e9f7c; font-weight: 600;
}

/* ========== 医院卡片 ========== */
.hospital-card {
  display: flex; gap: 12px; padding: 14px;
  background: #fff; border-radius: 12px; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.hospital-card:active { transform: scale(0.98); }
.hospital-card--selected { box-shadow: 0 0 0 2px #2dd4a8; }
.hospital-card__left { flex-shrink: 0; }
.hospital-card__badge {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff;
}
.hospital-card__badge--3A { background: linear-gradient(135deg, #34d399, #10b981); }
.hospital-card__badge--3B { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.hospital-card__badge--2A { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.hospital-card__badge--2B { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
.hospital-card__main { flex: 1; min-width: 0; }
.hospital-card__name { margin: 0; font-size: 15px; font-weight: 700; color: #1f2937; }
.hospital-card__addr { margin: 4px 0 0; font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hospital-card__tags { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
.hospital-card__tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #f0fdf9; color: #0e9f7c; }
.hospital-card__right { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px; }
.hospital-card__rating { display: flex; align-items: center; gap: 2px; font-size: 13px; font-weight: 700; color: #f59e0b; }
.hospital-card__star { width: 14px; height: 14px; }
.hospital-card__dist { font-size: 11px; color: #9ca3af; }

/* ========== 科室 ========== */
.dept-info {
  display: flex; align-items: center; gap: 8px;
  background: #f0fdf9; border-radius: 8px; padding: 8px 12px;
  font-size: 13px; color: #0e9f7c; font-weight: 500;
}
.dept-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}
.dept-item {
  border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;
  padding: 12px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; transition: all 0.2s ease;
}
.dept-item:active { transform: scale(0.95); }
.dept-item--selected { border-color: #2dd4a8; background: #f0fdf9; box-shadow: 0 0 0 1px #2dd4a8; }
.dept-item__icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; font-weight: 700;
}
.dept-item__name { font-size: 13px; font-weight: 600; color: #1f2937; }
.dept-item__count { font-size: 10px; color: #9ca3af; }

/* ========== 号源类型 ========== */
.reg-type { display: flex; gap: 10px; }
.reg-type__btn {
  flex: 1; border: 2px solid #e5e7eb; border-radius: 12px; background: #fff;
  padding: 12px; cursor: pointer; transition: all 0.2s ease; text-align: left;
}
.reg-type__btn--active { border-color: #2dd4a8; background: #f0fdf9; }
.reg-type__head { display: flex; align-items: center; justify-content: space-between; }
.reg-type__title { font-size: 14px; font-weight: 700; color: #1f2937; }
.reg-type__fee { font-size: 16px; font-weight: 700; color: #ef4444; }
.reg-type__desc { margin: 4px 0 0; font-size: 11px; color: #6b7280; }

/* ========== 医生卡片 ========== */
.doctor-card {
  display: flex; gap: 10px; padding: 12px; background: #fff; border-radius: 12px;
  cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;
}
.doctor-card--selected { box-shadow: 0 0 0 2px #2dd4a8; background: #f0fdf9; }
.doctor-card__avatar { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: #f0f0f0; }
.doctor-card__avatar :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.doctor-card__main { flex: 1; min-width: 0; }
.doctor-card__line { display: flex; align-items: baseline; gap: 6px; }
.doctor-card__name { font-size: 14px; font-weight: 700; color: #1f2937; }
.doctor-card__title { font-size: 12px; color: #6b7280; }
.doctor-card__expertise { margin: 2px 0 0; font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.doctor-card__footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.doctor-card__fee { font-size: 13px; font-weight: 600; color: #ef4444; }
.doctor-card__selected-tag { font-size: 11px; color: #2dd4a8; font-weight: 600; }

/* ========== 排班日历 ========== */
.date-rail { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 2px 0 4px; }
.date-rail::-webkit-scrollbar { display: none; }
.date-card {
  flex-shrink: 0; width: 56px; height: 64px; border-radius: 12px;
  border: 1px solid #e5e7eb; background: #fff; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  transition: all 0.2s ease;
}
.date-card--selected { background: linear-gradient(180deg, #2dd4a8, #4adebf); border-color: transparent; box-shadow: 0 4px 12px rgba(45,212,168,0.3); }
.date-card--selected .date-card__week, .date-card--selected .date-card__date { color: #fff; }
.date-card__week { font-size: 11px; color: #6b7280; }
.date-card__date { font-size: 15px; font-weight: 700; color: #1f2937; }

/* ========== 时段 ========== */
.period-tabs { display: flex; gap: 8px; }
.period-tab {
  flex: 1; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff;
  padding: 8px 4px; display: flex; flex-direction: column; align-items: center; gap: 2px;
  cursor: pointer; transition: all 0.2s ease;
}
.period-tab--active { border-color: #2dd4a8; background: #f0fdf9; }
.period-tab__icon { font-size: 18px; }
.period-tab__label { font-size: 13px; font-weight: 600; color: #1f2937; }
.period-tab__count { font-size: 10px; color: #2dd4a8; }
.period-tab__none { font-size: 10px; color: #d1d5db; }

.slot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.slot-card {
  border: 1px solid #e5e7eb; border-radius: 10px; background: #fff;
  padding: 10px 4px; display: flex; flex-direction: column; align-items: center; gap: 2px;
  cursor: pointer; transition: all 0.2s ease;
}
.slot-card:active { transform: scale(0.95); }
.slot-card--selected { border-color: #2dd4a8; background: #f0fdf9; box-shadow: 0 0 0 1px #2dd4a8; }
.slot-card--full { opacity: 0.4; cursor: not-allowed; }
.slot-card__time { font-size: 13px; font-weight: 600; color: #1f2937; }
.slot-card__remain { font-size: 11px; color: #2dd4a8; }
.slot-card__remain--low { color: #ef4444; }

/* ========== 就诊人 ========== */
.bk-summary-bar {
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  background: #f0fdf9; border-radius: 8px; padding: 8px 12px;
  font-size: 12px; color: #0e9f7c; font-weight: 500;
}
.patient-card {
  display: flex; gap: 12px; align-items: center; padding: 14px;
  background: #fff; border-radius: 12px; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;
}
.patient-card--selected { box-shadow: 0 0 0 2px #2dd4a8; }
.patient-card__avatar {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 16px; font-weight: 700;
}
.patient-card__main { flex: 1; min-width: 0; }
.patient-card__line { display: flex; align-items: center; gap: 8px; }
.patient-card__name { font-size: 15px; font-weight: 700; color: #1f2937; }
.patient-card__type { font-size: 10px; padding: 2px 6px; border-radius: 4px; }
.patient-card__default { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #fef3c7; color: #b45309; }
.patient-card__id { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
.patient-card__phone { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
.patient-card__check { width: 22px; height: 22px; flex-shrink: 0; }
.bk-add-patient {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  border: 1px dashed #2dd4a8; border-radius: 12px; background: #f0fdf9;
  padding: 12px; color: #2dd4a8; font-size: 14px; font-weight: 500; cursor: pointer;
}
.bk-add-patient__plus { font-size: 18px; }

/* ========== 确认信息 ========== */
.confirm-card {
  background: #fff; border-radius: 16px; padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.confirm-card__title { margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #1f2937; text-align: center; }
.confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.confirm-row__label { font-size: 13px; color: #6b7280; }
.confirm-row__value { font-size: 14px; color: #1f2937; font-weight: 500; text-align: right; }
.confirm-row--highlight { padding-top: 12px; }
.confirm-row__value--fee { font-size: 18px; font-weight: 700; color: #ef4444; }
.confirm-divider { height: 1px; background: #f3f4f6; margin: 8px 0; }
.confirm-notice {
  display: flex; gap: 8px; align-items: flex-start;
  background: #fffbeb; border-radius: 8px; padding: 10px 12px;
}
.confirm-notice__icon { width: 18px; height: 18px; flex-shrink: 0; }
.confirm-notice p { margin: 0; font-size: 12px; color: #92400e; line-height: 1.5; }

/* ========== 支付 ========== */
.bk-step--pay { align-items: center; }
.pay-amount { text-align: center; padding: 20px 0; }
.pay-amount__label { margin: 0; font-size: 14px; color: #6b7280; }
.pay-amount__num { margin: 8px 0 0; font-size: 36px; font-weight: 700; color: #ef4444; }
.pay-method {
  display: flex; align-items: center; gap: 12px; width: 100%;
  background: #fff; border-radius: 12px; padding: 14px; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;
}
.pay-method--selected { box-shadow: 0 0 0 2px #2dd4a8; }
.pay-method__radio { display: none; }
.pay-method__icon {
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px; font-weight: 700;
}
.pay-method__icon-text { font-size: 16px; }
.pay-method__main { flex: 1; display: flex; flex-direction: column; }
.pay-method__name { font-size: 15px; font-weight: 600; color: #1f2937; }
.pay-method__desc { font-size: 12px; color: #6b7280; }
.pay-method__check {
  width: 20px; height: 20px; border-radius: 50%; border: 2px solid #d1d5db;
  flex-shrink: 0; transition: all 0.2s ease;
}
.pay-method__check--on { border-color: #2dd4a8; background: #2dd4a8; position: relative; }
.pay-method__check--on::after {
  content: ''; position: absolute; left: 5px; top: 1px;
  width: 6px; height: 10px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg);
}
.pay-loading { text-align: center; padding: 20px; }
.pay-loading__spinner {
  width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #2dd4a8;
  border-radius: 50%; margin: 0 auto 8px; animation: bk-spin 0.8s linear infinite;
}
@keyframes bk-spin { to { transform: rotate(360deg); } }

/* ========== 成功页 ========== */
.bk-step--success { align-items: center; }
.success-anim { margin: 8px 0 0; }
.success-anim__svg { width: 64px; height: 64px; }
.success-anim__circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: bk-circle 0.6s ease 0.1s forwards; }
@keyframes bk-circle { to { stroke-dashoffset: 0; } }
.success-anim__check { stroke-dasharray: 40; stroke-dashoffset: 40; animation: bk-check 0.4s ease 0.5s forwards; }
@keyframes bk-check { to { stroke-dashoffset: 0; } }
.success-title { font-size: 20px; font-weight: 700; color: #1f2937; margin: 8px 0 16px; }

/* ========== 预约单 ========== */
.slip {
  width: 100%; background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06); position: relative;
}
.slip__perforation, .slip__perforation--bottom {
  height: 16px; background: radial-gradient(circle, #f4f7fa 4px, #fff 4px);
  background-size: 16px 16px; background-position: center; background-repeat: repeat-x;
}
.slip__perforation--bottom { margin-top: -1px; }
.slip__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px 8px;
}
.slip__hospital { font-size: 16px; font-weight: 700; color: #1f2937; }
.slip__level { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #f0fdf9; color: #0e9f7c; }
.slip__body { padding: 8px 20px 16px; }
.slip__row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
.slip__label { font-size: 13px; color: #6b7280; }
.slip__value { font-size: 14px; color: #1f2937; font-weight: 500; }
.slip__value--serial { font-size: 20px; font-weight: 800; color: #2dd4a8; letter-spacing: 1px; }
.slip__divider { height: 1px; background: #f3f4f6; margin: 8px 0; }
.slip__row--fee .slip__value { font-size: 16px; font-weight: 700; color: #ef4444; }
.slip__pay-tag { font-size: 11px; font-weight: 400; color: #6b7280; }

/* ========== 成功提示 ========== */
.success-tips { width: 100%; padding: 12px 4px; }
.success-tips p { margin: 0 0 6px; font-size: 12px; color: #6b7280; line-height: 1.5; }

.success-actions { display: flex; gap: 10px; width: 100%; margin-top: 8px; }
.success-btn {
  flex: 1; padding: 12px; border: none; border-radius: 999px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.15s ease;
}
.success-btn:active { transform: scale(0.97); }
.success-btn--primary { background: linear-gradient(180deg, #2dd4a8, #4adebf); color: #fff; box-shadow: 0 4px 12px rgba(45,212,168,0.3); }
.success-btn--ghost { background: #fff; border: 1px solid #e5e7eb; color: #6b7280; }

/* ========== 空状态 ========== */
.bk-empty { text-align: center; padding: 24px; }
.bk-empty--small { padding: 16px; }
.bk-empty p { margin: 0; font-size: 13px; color: #9ca3af; }

/* ========== 底部导航 ========== */
.bk-footer {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 10;
  display: flex; gap: 10px; padding: 12px 14px calc(12px + env(safe-bottom, 0px));
  background: #fff; box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
}
.bk-footer__prev {
  flex-shrink: 0; padding: 12px 24px; border: 1px solid #e5e7eb;
  border-radius: 999px; background: #fff; color: #6b7280;
  font-size: 14px; font-weight: 500; cursor: pointer;
}
.bk-footer__next {
  flex: 1; padding: 12px; border: none; border-radius: 999px;
  background: linear-gradient(180deg, #2dd4a8, #4adebf); color: #fff;
  font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(45,212,168,0.3);
  cursor: pointer; transition: all 0.2s ease;
}
.bk-footer__next:disabled { opacity: 0.4; }
.bk-footer__next--submit { background: linear-gradient(180deg, #3b82f6, #2563eb); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
.bk-footer__next--pay { background: linear-gradient(180deg, #f59e0b, #d97706); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }
.bk-footer__next:active:not(:disabled) { transform: scale(0.97); }
</style>
