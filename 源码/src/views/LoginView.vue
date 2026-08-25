<template>
  <div class="page login">
    <!-- 沉浸式头部 -->
    <header class="login__header">
      <div class="login__header-bg"></div>
      <div class="login__logo">
        <svg viewBox="0 0 64 64" class="login__logo-icon">
          <defs>
            <linearGradient id="loginLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#fff" stop-opacity="0.7" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.18)" />
          <path fill="url(#loginLeaf)" d="M32 12c-8 0-14 6-14 14 0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
        </svg>
      </div>
      <h1 class="login__title">绿芽健康</h1>
      <p class="login__subtitle">您的随身医疗管家</p>
    </header>

    <!-- 登录表单 -->
    <main class="login__main">
      <!-- 手机号 -->
      <div class="login__field">
        <span class="login__prefix">+86</span>
        <input
          v-model.trim="phone"
          type="tel"
          maxlength="11"
          class="login__input"
          placeholder="请输入手机号"
          @input="onPhoneInput"
        />
      </div>

      <!-- 验证码 -->
      <div class="login__field">
        <input
          v-model.trim="code"
          type="text"
          maxlength="6"
          class="login__input login__input--code"
          placeholder="请输入验证码"
        />
        <button
          class="login__send"
          :class="{ 'is-disabled': countdown > 0 || !phoneValid }"
          type="button"
          @click="sendCode"
        >
          {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
        </button>
      </div>

      <!-- 登录按钮 -->
      <button
        class="login__btn"
        :class="{ 'is-disabled': !canLogin }"
        type="button"
        @click="doLogin"
      >
        登 录
      </button>

      <!-- 协议勾选 -->
      <label class="login__agree">
        <input v-model="agreed" type="checkbox" class="login__checkbox" />
        <span class="login__agree-text">
          我已阅读并同意
          <a href="javascript:void(0)" @click.stop="showPolicy('privacy')">《隐私政策》</a>
          和
          <a href="javascript:void(0)" @click.stop="showPolicy('user')">《用户授权协议》</a>
        </span>
      </label>

      <!-- 分隔线 -->
      <div class="login__divider">
        <span class="login__divider-line"></span>
        <span class="login__divider-text">其他登录方式</span>
        <span class="login__divider-line"></span>
      </div>

      <!-- 社交登录 -->
      <div class="login__social">
        <button class="login__social-btn login__social-btn--wechat" type="button" @click="socialLogin('wechat')">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.7 3C4.5 3 1 5.9 1 9.5c0 2 1.1 3.8 2.9 5L3 17l3-1.6c.9.2 1.8.4 2.7.4h.5c-.3-.9-.4-1.8-.4-2.7 0-3.6 3.5-6.5 7.7-6.5h.5C16.3 4.7 12.8 3 8.7 3zm-2 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4.3 2c-3.3 0-6 2.2-6 5s2.7 5 6 5c.7 0 1.4-.1 2-.3l2.5 1.3-.7-2.2c1.4-1 2.2-2.4 2.2-3.8 0-2.8-2.7-5-6-5zm-2 3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zm4 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z" />
          </svg>
          <span>微信登录</span>
        </button>
        <button class="login__social-btn login__social-btn--alipay" type="button" @click="socialLogin('alipay')">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.5 14.3c-1.2.4-2.5.5-3.7.3-1-.2-1.9-.7-2.6-1.4 1.5-.6 3.2-1.3 4.7-2.2 1.2-.7 2.3-1.5 3.3-2.4-.3 1.6-.7 3.2-1.3 4.7-.6 1.5-1.2 2.6-1.7 3.1.0-.1.0-.1 0-.1 0 0 .1 0 .2.1-.3-.3.5-.9 1.1-2.1z" />
            <path fill="currentColor" d="M9.5 9.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5S13.4 7 12 7s-2.5 1.1-2.5 2.5z" />
          </svg>
          <span>支付宝登录</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import { loginByPhone, loginBySocial } from '@/utils/authStore'

const router = useRouter()
const phone = ref('')
const code = ref('')
const agreed = ref(false)
const countdown = ref(0)
let timer = null

const phoneValid = computed(() => /^1[3-9]\d{9}$/.test(phone.value))
const canLogin = computed(() => phoneValid.value && code.value.length === 6 && agreed.value)

function onPhoneInput() {
  phone.value = phone.value.replace(/\D/g, '').slice(0, 11)
}

function sendCode() {
  if (countdown.value > 0 || !phoneValid.value) return
  countdown.value = 60
  toast('验证码已发送，请注意查收')
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function doLogin() {
  if (!phoneValid.value) return toast('请输入正确的手机号')
  if (code.value.length !== 6) return toast('请输入6位验证码')
  if (!agreed.value) return toast('请先同意隐私政策和用户授权协议')
  loginByPhone(phone.value)
  toast('登录成功')
  setTimeout(() => router.replace('/mine'), 600)
}

function socialLogin(type) {
  if (!agreed.value) return toast('请先同意隐私政策和用户授权协议')
  const label = type === 'wechat' ? '微信' : '支付宝'
  loginBySocial(type)
  toast(`${label}登录成功`)
  setTimeout(() => router.replace('/mine'), 600)
}

function showPolicy(type) {
  const title = type === 'privacy' ? '隐私政策' : '用户授权协议'
  router.push('/more/' + encodeURIComponent(title))
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: var(--bg);
}

.login__header {
  position: relative;
  text-align: center;
  padding: calc(var(--safe-top) + 48px) 0 56px;
  color: #fff;
  overflow: hidden;
}

.login__header-bg {
  position: absolute;
  inset: 0;
  height: 100%;
  background: linear-gradient(160deg, #2dd4a8 0%, #4adebf 50%, #14b8a6 100%);
  z-index: -1;
}

.login__header-bg::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 30px;
  background: var(--bg);
  border-radius: 30px 30px 0 0;
}

.login__logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(8px);
}

.login__logo-icon {
  width: 40px;
  height: 40px;
}

.login__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}

.login__subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

/* ========== 表单 ========== */
.login__main {
  padding: 12px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login__field {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.login__prefix {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  border-right: 1px solid #eee;
  padding-right: 10px;
}

.login__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-main);
  background: transparent;
}

.login__input--code {
  flex: 1;
}

.login__send {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-light);
  transition: opacity 0.2s;
}

.login__send.is-disabled {
  color: var(--text-light);
  background: #f3f4f6;
}

.login__btn {
  height: 50px;
  margin-top: 4px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  box-shadow: 0 4px 16px rgba(45, 212, 168, 0.35);
  transition: transform 0.15s, opacity 0.2s;
}

.login__btn.is-disabled {
  opacity: 0.5;
}

.login__btn:active:not(.is-disabled) {
  transform: scale(0.97);
}

/* ========== 协议 ========== */
.login__agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.6;
}

.login__checkbox {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  flex-shrink: 0;
}

.login__agree-text a {
  color: var(--primary);
  font-weight: 500;
}

/* ========== 分隔线 ========== */
.login__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 4px;
}

.login__divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.login__divider-text {
  font-size: 12px;
  color: var(--text-light);
}

/* ========== 社交登录 ========== */
.login__social {
  display: flex;
  gap: 12px;
}

.login__social-btn {
  flex: 1;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.15s, opacity 0.2s;
}

.login__social-btn svg {
  width: 22px;
  height: 22px;
}

.login__social-btn--wechat {
  background: #07c160;
  color: #fff;
}

.login__social-btn--alipay {
  background: #1677ff;
  color: #fff;
}

.login__social-btn:active {
  transform: scale(0.96);
}

/* ========== 大屏适配 ========== */
@media (min-width: 481px) {
  .login__main {
    padding: 12px 48px 24px;
  }
}
</style>
