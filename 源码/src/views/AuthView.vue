<template>
  <div class="page auth">
    <!-- 返回栏 -->
    <header class="auth__nav">
      <button class="auth__back" type="button" @click="goBack">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 7l-5 5 5 5V7z"/></svg>
      </button>
      <span class="auth__nav-title">实名认证</span>
    </header>

    <div class="auth__scroll scroll-y">
      <!-- 认证状态横幅 -->
      <div class="auth__banner" :class="{ 'auth__banner--done': verified }">
        <div class="auth__banner-icon">
          <svg v-if="!verified" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L19.5 8 12 11.8 4.5 8 12 4.2zM4 9.3l7 3.5v7.2L4 16.5V9.3zm9 10.7v-7.2l7-3.5v7.2L13 20z"/></svg>
          <svg v-else viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <div class="auth__banner-text">
          <p class="auth__banner-title">{{ verified ? '已完成实名认证' : '完成实名认证' }}</p>
          <p class="auth__banner-sub">{{ verified ? '您的身份信息已验证' : '认证后可使用挂号、问诊等服务' }}</p>
        </div>
      </div>

      <!-- 身份证 OCR 上传 -->
      <section v-if="!verified" class="auth__section">
        <h3 class="auth__section-title">上传身份证</h3>
        <p class="auth__section-desc">请上传清晰的身份证正反面照片</p>
        <div class="auth__upload-grid">
          <div class="auth__upload" @click="onUpload('front')">
            <div class="auth__upload-inner" v-if="!idFront">
              <svg viewBox="0 0 48 48" class="auth__upload-icon">
                <path fill="#d1d5db" d="M24 10c-2 0-3 .5-4 1.5l-2 2H8a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4v-18a4 4 0 0 0-4-4h-10l-2-2C27 10.5 26 10 24 10zm0 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
              </svg>
              <span class="auth__upload-label">人像面</span>
            </div>
            <div v-else class="auth__upload-preview">
              <div class="auth__upload-idcard auth__upload-idcard--front">
                <div class="idcard-front">
                  <span class="idcard-front__flag"></span>
                  <span class="idcard-front__title">中华人民共和国</span>
                  <span class="idcard-front__subtitle">居民身份证</span>
                </div>
              </div>
              <span class="auth__upload-retake">重新上传</span>
            </div>
          </div>
          <div class="auth__upload" @click="onUpload('back')">
            <div class="auth__upload-inner" v-if="!idBack">
              <svg viewBox="0 0 48 48" class="auth__upload-icon">
                <path fill="#d1d5db" d="M24 10c-2 0-3 .5-4 1.5l-2 2H8a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4v-18a4 4 0 0 0-4-4h-10l-2-2C27 10.5 26 10 24 10zm0 8a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
              </svg>
              <span class="auth__upload-label">国徽面</span>
            </div>
            <div v-else class="auth__upload-preview">
              <div class="auth__upload-idcard auth__upload-idcard--back">
                <div class="idcard-back">
                  <span class="idcard-back__line"></span>
                  <span class="idcard-back__line idcard-back__line--short"></span>
                </div>
              </div>
              <span class="auth__upload-retake">重新上传</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 信息填写 -->
      <section v-if="!verified" class="auth__section">
        <h3 class="auth__section-title">身份信息</h3>
        <div class="auth__form">
          <div class="auth__form-row">
            <label class="auth__form-label">姓名</label>
            <input v-model.trim="form.realName" class="auth__form-input" placeholder="请输入真实姓名" />
          </div>
          <div class="auth__form-row">
            <label class="auth__form-label">身份证号</label>
            <input v-model.trim="form.idCard" class="auth__form-input" placeholder="请输入18位身份证号" maxlength="18" />
          </div>
        </div>
      </section>

      <!-- 人脸识别 -->
      <section v-if="!verified" class="auth__section">
        <h3 class="auth__section-title">人脸识别</h3>
        <div class="auth__face">
          <div class="auth__face-circle" :class="{ 'auth__face-circle--scanning': faceScanning }" @click="startFaceScan">
            <svg viewBox="0 0 64 64" class="auth__face-icon">
              <circle cx="32" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="2.5" />
              <path fill="none" stroke="currentColor" stroke-width="2.5" d="M14 56c0-10 8-16 18-16s18 6 18 16" stroke-linecap="round" />
            </svg>
            <div v-if="faceScanning" class="auth__face-scan-line"></div>
          </div>
          <p class="auth__face-text">{{ faceStatus }}</p>
        </div>
      </section>

      <!-- 认证信息展示 -->
      <section v-if="verified" class="auth__section">
        <h3 class="auth__section-title">已认证信息</h3>
        <div class="auth__info-list">
          <div class="auth__info-row">
            <span class="auth__info-label">姓名</span>
            <span class="auth__info-value">{{ maskName(authData.realName) }}</span>
          </div>
          <div class="auth__info-row">
            <span class="auth__info-label">身份证号</span>
            <span class="auth__info-value">{{ maskIdCard(authData.idCard) }}</span>
          </div>
          <div class="auth__info-row">
            <span class="auth__info-label">认证时间</span>
            <span class="auth__info-value">{{ formatDate(authData.verifiedAt) }}</span>
          </div>
        </div>
      </section>

      <!-- 健康卡 / 医保绑定 -->
      <section class="auth__section">
        <h3 class="auth__section-title">电子凭证绑定</h3>
        <div class="auth__card-list">
          <div class="auth__card-item" @click="onBindCard('health')">
            <div class="auth__card-icon auth__card-icon--health">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-5 12H9v-2h6v2zm-2-4H7v-2h6v2zm5-4H4V6h14v2z"/></svg>
            </div>
            <div class="auth__card-info">
              <p class="auth__card-name">电子健康卡</p>
              <p class="auth__card-no">{{ healthCard?.health ? '已绑定 ' + maskCardNo(healthCard.health) : '点击绑定' }}</p>
            </div>
            <svg class="auth__card-arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M9 6l6 6-6 6"/></svg>
          </div>
          <div class="auth__card-item" @click="onBindCard('insurance')">
            <div class="auth__card-icon auth__card-icon--insurance">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/></svg>
            </div>
            <div class="auth__card-info">
              <p class="auth__card-name">医保电子凭证</p>
              <p class="auth__card-no">{{ healthCard?.insurance ? '已绑定 ' + maskCardNo(healthCard.insurance) : '点击绑定' }}</p>
            </div>
            <svg class="auth__card-arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M9 6l6 6-6 6"/></svg>
          </div>
        </div>
      </section>

      <!-- 提交按钮 -->
      <button v-if="!verified" class="auth__submit" :class="{ 'is-disabled': !canSubmit }" type="button" @click="submitAuth">
        提交认证
      </button>

      <div class="auth__safe-space"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import { isVerified, getAuth, setVerified, getHealthCard, bindHealthCard } from '@/utils/authStore'

const router = useRouter()

const authData = ref(getAuth())
const verified = computed(() => isVerified())
const healthCard = ref(getHealthCard())

const idFront = ref(false)
const idBack = ref(false)
const form = ref({ realName: '', idCard: '' })
const faceScanning = ref(false)
const faceDone = ref(false)
let faceTimer = null

const canSubmit = computed(() =>
  idFront.value && idBack.value &&
  form.value.realName.length >= 2 &&
  /^[\dXx]{18}$/.test(form.value.idCard) &&
  faceDone.value
)

const faceStatus = computed(() => {
  if (faceDone.value) return '人脸识别已完成'
  if (faceScanning.value) return '正在识别，请保持面部居中…'
  return '点击开始人脸识别'
})

function goBack() {
  router.back()
}

function onUpload(side) {
  if (side === 'front') {
    idFront.value = true
    toast('身份证人像面上传成功')
    // OCR 自动填充
    if (!form.value.realName) form.value.realName = '张明远'
    if (!form.value.idCard) form.value.idCard = '110101199003071234'
  } else {
    idBack.value = true
    toast('身份证国徽面上传成功')
  }
}

function startFaceScan() {
  if (faceScanning.value || faceDone.value) return
  faceScanning.value = true
  faceTimer = setTimeout(() => {
    faceScanning.value = false
    faceDone.value = true
    toast('人脸识别成功')
  }, 2500)
}

function submitAuth() {
  if (!canSubmit.value) {
    if (!idFront.value || !idBack.value) return toast('请上传身份证正反面')
    if (form.value.realName.length < 2) return toast('请输入真实姓名')
    if (!/^[\dXx]{18}$/.test(form.value.idCard)) return toast('请输入正确的身份证号')
    if (!faceDone.value) return toast('请完成人脸识别')
    return
  }
  const data = setVerified({
    realName: form.value.realName,
    idCard: form.value.idCard
  })
  authData.value = data
  toast('实名认证成功')
  setTimeout(() => router.back(), 800)
}

function onBindCard(type) {
  const label = type === 'health' ? '电子健康卡' : '医保电子凭证'
  const cardNo = type === 'health'
    ? 'BJ' + Date.now().toString().slice(-12)
    : '医保' + Math.random().toString().slice(2, 12)
  bindHealthCard(cardNo, type)
  healthCard.value = getHealthCard()
  toast(`${label}绑定成功`)
}

function maskName(name) {
  if (!name) return ''
  if (name.length <= 1) return name + '*'
  return name[0] + '*'.repeat(name.length - 1).slice(0, 2) + name[name.length - 1]
}

function maskIdCard(id) {
  if (!id || id.length < 6) return id || ''
  return id.slice(0, 4) + '********' + id.slice(-4)
}

function maskCardNo(no) {
  if (!no) return ''
  return no.slice(0, 4) + '****' + no.slice(-4)
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onUnmounted(() => {
  if (faceTimer) clearTimeout(faceTimer)
})
</script>

<style scoped>
.auth {
  background: var(--bg);
  min-height: 100vh;
}

.auth__nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(44px + var(--safe-top));
  padding-top: var(--safe-top);
  background: linear-gradient(135deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
}

.auth__back {
  position: absolute;
  left: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth__back svg { width: 20px; height: 20px; }

.auth__nav-title {
  font-size: 17px;
  font-weight: 600;
}

.auth__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ========== 状态横幅 ========== */
.auth__banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.auth__banner--done {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #047857;
}

.auth__banner-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  flex-shrink: 0;
}

.auth__banner-icon svg { width: 24px; height: 24px; }

.auth__banner-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.auth__banner-sub {
  font-size: 12px;
  opacity: 0.85;
}

/* ========== 卡片 ========== */
.auth__section {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.auth__section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.auth__section-desc {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 14px;
}

/* ========== 上传 ========== */
.auth__upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.auth__upload {
  aspect-ratio: 1.585 / 1;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.auth__upload:active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.auth__upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.auth__upload-icon { width: 36px; height: 36px; }

.auth__upload-label {
  font-size: 12px;
  color: var(--text-sub);
}

.auth__upload-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.auth__upload-idcard {
  width: 88%;
  height: 72%;
  border-radius: 6px;
  overflow: hidden;
}

.auth__upload-idcard--front {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth__upload-idcard--back {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.idcard-front, .idcard-back {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.idcard-front__flag {
  width: 24px;
  height: 16px;
  background: #dc2626;
  border-radius: 1px;
  margin-bottom: 4px;
}

.idcard-front__title { font-size: 7px; color: #92400e; font-weight: 600; }
.idcard-front__subtitle { font-size: 8px; color: #92400e; }

.idcard-back__line { width: 60%; height: 2px; background: rgba(0,0,0,0.15); border-radius: 1px; }
.idcard-back__line--short { width: 40%; }

.auth__upload-retake {
  font-size: 10px;
  color: var(--primary);
  font-weight: 600;
}

/* ========== 表单 ========== */
.auth__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth__form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 14px;
  background: #f9fafb;
  border-radius: 10px;
}

.auth__form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  flex-shrink: 0;
  width: 64px;
}

.auth__form-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-main);
}

/* ========== 人脸识别 ========== */
.auth__face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.auth__face-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.auth__face-circle--scanning {
  border-color: var(--primary);
  color: var(--primary);
}

.auth__face-icon { width: 48px; height: 48px; }

.auth__face-scan-line {
  position: absolute;
  left: 8%;
  right: 8%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  animation: scanFace 1.2s ease-in-out infinite;
}

@keyframes scanFace {
  0% { top: 15%; }
  50% { top: 85%; }
  100% { top: 15%; }
}

.auth__face-text {
  font-size: 13px;
  color: var(--text-sub);
}

/* ========== 已认证信息 ========== */
.auth__info-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.auth__info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.auth__info-row:last-child { border-bottom: none; }

.auth__info-label {
  font-size: 14px;
  color: var(--text-sub);
}

.auth__info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

/* ========== 凭证绑定 ========== */
.auth__card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth__card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: background 0.15s;
}

.auth__card-item:active { background: #f3f4f6; }

.auth__card-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.auth__card-icon svg { width: 20px; height: 20px; }

.auth__card-icon--health {
  background: #dbeafe;
  color: #2563eb;
}

.auth__card-icon--insurance {
  background: #dcfce7;
  color: #16a34a;
}

.auth__card-info { flex: 1; min-width: 0; }

.auth__card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.auth__card-no {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}

.auth__card-arrow {
  width: 18px;
  height: 18px;
  color: var(--text-light);
  flex-shrink: 0;
}

/* ========== 提交按钮 ========== */
.auth__submit {
  height: 48px;
  margin: 4px 0;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  box-shadow: 0 4px 16px rgba(45, 212, 168, 0.35);
  transition: transform 0.15s, opacity 0.2s;
}

.auth__submit.is-disabled { opacity: 0.5; }

.auth__submit:active:not(.is-disabled) { transform: scale(0.97); }

.auth__safe-space { height: 20px; }
</style>
