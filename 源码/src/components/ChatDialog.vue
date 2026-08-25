<template>
  <Teleport to="body">
    <Transition name="chat-fade">
      <div v-if="visible" class="chat-mask" @click.self="close">
        <Transition name="chat-slide" appear>
          <section class="chat" role="dialog" aria-label="预约对话窗口">
            <!-- 头部 -->
            <header class="chat__header">
              <button class="chat__back" type="button" aria-label="关闭" @click="close">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div class="chat__peer">
                <div class="chat__peer-avatar">
                  <Avatar :src="peer.avatar" :alt="peer.name" />
                </div>
                <div class="chat__peer-info">
                  <span class="chat__peer-name">{{ peer.name }}</span>
                  <span class="chat__peer-sub">{{ peer.sub }}</span>
                </div>
              </div>
              <span class="chat__status">
                <span class="chat__status-dot"></span>
                在线
              </span>
            </header>

            <!-- 预约信息条（仅当有 booking 时显示） -->
            <div v-if="booking" class="chat__booking">
              <svg viewBox="0 0 24 24" class="chat__booking-icon" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8" />
                <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M9 15l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="chat__booking-text">
                <span class="chat__booking-title">{{ booking.dateLabel }} · {{ booking.timeText }}</span>
                <span class="chat__booking-hint">预约已确认，可在对话中沟通详情</span>
              </div>
            </div>

            <!-- 消息列表 -->
            <main class="chat__list" ref="listEl">
              <!-- 记录开始标记 -->
              <div class="chat__divide">
                <span class="chat__divide-text">— 以下是聊天记录 —</span>
              </div>

              <template v-for="(m, i) in messages" :key="m.id">
                <!-- 时间分隔：与上一条间隔超过 5 分钟才显示 -->
                <div v-if="showTime(i)" class="chat__time">
                  {{ formatFullTime(m.time) }}
                </div>

                <!-- 系统消息 -->
                <div v-if="m.role === 'system'" class="chat__sys">
                  <span class="chat__sys-text">{{ m.text }}</span>
                </div>

                <!-- 对方消息 -->
                <div v-else-if="m.role === 'peer'" class="chat__row chat__row--peer">
                  <div class="chat__msg-avatar">
                    <Avatar :src="peer.avatar" :alt="peer.name" />
                  </div>
                  <div class="chat__msg">
                    <div class="chat__bubble chat__bubble--peer">{{ m.text }}</div>
                    <span class="chat__stamp">{{ formatTime(m.time) }}</span>
                  </div>
                </div>

                <!-- 我的消息 -->
                <div v-else class="chat__row chat__row--me">
                  <div class="chat__msg chat__msg--me">
                    <span class="chat__stamp">{{ formatTime(m.time) }}</span>
                    <div class="chat__bubble chat__bubble--me">{{ m.text }}</div>
                  </div>
                  <div class="chat__msg-avatar">
                    <Avatar />
                  </div>
                </div>
              </template>

              <!-- 正在输入 -->
              <div v-if="typing" class="chat__row chat__row--peer">
                <div class="chat__msg-avatar">
                  <Avatar :src="peer.avatar" :alt="peer.name" />
                </div>
                <div class="chat__bubble chat__bubble--peer chat__bubble--typing">
                  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
              </div>
            </main>

            <!-- 输入栏 -->
            <footer class="chat__input">
              <input
                v-model="draft"
                class="chat__input-field"
                type="text"
                :placeholder="`发消息给${peer.name}...`"
                maxlength="200"
                enterkeyhint="send"
                @keyup.enter="send"
              />
              <button
                class="chat__send"
                type="button"
                :disabled="!draft.trim()"
                @click="send"
              >
                发送
              </button>
            </footer>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Avatar from '@/components/Avatar.vue'
import {
  getSession,
  createSession,
  appendMessage,
  formatTime,
  formatFullTime
} from '@/utils/chatStore'

const props = defineProps({
  visible: { type: Boolean, default: false },
  sessionId: { type: String, default: '' },
  peer: { type: Object, required: true }, // { name, avatar, sub }
  booking: { type: Object, default: () => null } // { dateLabel, timeText } — 传 null/不传表示即时咨询
})

const emit = defineEmits(['close'])

const messages = ref([])
const draft = ref('')
const typing = ref(false)
const listEl = ref(null)
let replyTimer = null
let greeted = false

/* 打开时初始化会话 */
watch(
  () => props.visible,
  (open) => {
    if (!open) return
    let session = props.sessionId ? getSession(props.sessionId) : null
    if (!session) {
      /* 即时咨询与预约会话使用不同的系统提示文案 */
      const isInstant = !props.booking
      session = createSession(props.sessionId, {
        peer: { name: props.peer.name, sub: props.peer.sub, avatar: props.peer.avatar },
        booking: props.booking || { dateLabel: '即时咨询', timeText: '随时在线' },
        systemText: isInstant
          ? '线上咨询已接通，沟通记录仅您和医生可见'
          : `预约成功：${props.booking.dateLabel} ${props.booking.timeText}`
      })
      greeted = false
    } else {
      greeted = session.messages.some((m) => m.role === 'peer')
    }
    messages.value = [...session.messages]
    scrollToBottom()
    /* 新会话：稍等片刻对方主动打招呼；区分即时咨询和预约 */
    if (!greeted) {
      typing.value = true
      const isInstant = !props.booking
      const greet = isInstant
        ? `您好，我是${props.peer.name}。请问哪里不舒服，我会尽力帮您。`
        : `您好，我是${props.peer.name}。已收到您的预约（${props.booking.dateLabel} ${props.booking.timeText}），有什么可以帮您？`
      replyTimer = setTimeout(() => {
        typing.value = false
        pushPeer(greet)
        greeted = true
      }, 900)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  clearTimeout(replyTimer)
})

/* 与上一条间隔 > 5 分钟才显示时间戳 */
function showTime(i) {
  if (i === 0) return true
  return messages.value[i].time - messages.value[i - 1].time > 5 * 60 * 1000
}

function scrollToBottom() {
  nextTick(() => {
    const el = listEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

/* ========== 发送 ========== */
function send() {
  const text = draft.value.trim()
  if (!text) return
  const msg = appendMessage(props.sessionId, { role: 'me', text })
  if (msg) messages.value.push(msg)
  draft.value = ''
  scrollToBottom()
  scheduleReply(text)
}

/* ========== 模拟回复 ========== */
const replyRules = [
  { test: /你好|您好|hi|hello/i, replies: ['您好！请问有什么可以帮您？', '您好，请讲～'] },
  { test: /时间|几点|时候/, replies: ['您的预约时间是 {{booking}}，请提前 10 分钟到院签到。', '时间安排是 {{booking}}，如有变动请提前告知我。'] },
  { test: /哪里|位置|地址|怎么走|路线/, replies: ['到院后可以先到一楼导诊台，报预约姓名即可。', '建议导航到医院正门，门诊大厅有自助签到机。'] },
  { test: /取消|改期|换/, replies: ['好的，如需改期我可以帮您登记，请告诉我期望的时间。', '取消/改期请在「我的-预约记录」操作，或告诉我帮您处理。'] },
  { test: /多少钱|价格|费用|收费/, replies: ['具体费用以到院结算为准，一般挂号费在 20-50 元区间。', '费用问题建议到院后咨询收费处，基本医保可报销部分。'] },
  { test: /痛|疼|不舒服|发烧|咳嗽|感冒/, replies: ['先别担心，建议记录一下症状开始的时间和变化，就诊时告诉我。', '如果症状加重（持续高烧、呼吸困难），请立即到急诊就诊。'] },
  { test: /带什么|准备|注意/, replies: ['请带好身份证和既往病历/检查报告，空腹项目请勿进食。', '建议穿着宽松衣物，方便检查。'] },
  { test: /谢谢|感谢|好的|嗯/, replies: ['不客气，祝您早日康复！', '好的，那我们预约当天见～'] }
]

const fallbackReplies = [
  '收到，我这边记录一下，稍后回复您。',
  '好的，您的消息我已收到，有任何疑问都可以随时问我。',
  '了解，预约当天有任何问题可以直接联系我。'
]

function pickReply(text) {
  const b = props.booking
    ? `${props.booking.dateLabel} ${props.booking.timeText}`
    : '您本次咨询的时间'
  for (const rule of replyRules) {
    if (rule.test.test(text)) {
      const r = rule.replies[Math.floor(Math.random() * rule.replies.length)]
      return r.replace('{{booking}}', b)
    }
  }
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)]
}

function scheduleReply(userText) {
  typing.value = true
  scrollToBottom()
  clearTimeout(replyTimer)
  replyTimer = setTimeout(() => {
    typing.value = false
    pushPeer(pickReply(userText))
  }, 1000 + Math.random() * 900)
}

function pushPeer(text) {
  const msg = appendMessage(props.sessionId, { role: 'peer', text })
  if (msg) messages.value.push(msg)
  scrollToBottom()
}

function close() {
  clearTimeout(replyTimer)
  typing.value = false
  emit('close')
}

defineExpose({ formatFullTime })
</script>

<style scoped>
/* ========== 遮罩 & 弹窗动画 ========== */
.chat-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chat {
  width: 100%;
  max-width: 481px;
  height: 88vh;
  background: #f4f7fa;
  border-radius: 18px 18px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 32px rgba(15, 23, 42, 0.18);
}

.chat-fade-enter-active,
.chat-fade-leave-active {
  transition: opacity 0.22s ease;
}
.chat-fade-enter-from,
.chat-fade-leave-to {
  opacity: 0;
}

.chat-slide-enter-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0.3, 1);
}
.chat-slide-leave-active {
  transition: transform 0.22s ease-in;
}
.chat-slide-enter-from,
.chat-slide-leave-to {
  transform: translateY(100%);
}

/* ========== 头部 ========== */
.chat__header {
  flex-shrink: 0;
  height: 64px;
  padding-top: env(safe-top, 0px);
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  padding-right: 14px;
  color: #fff;
}

.chat__back {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease, background 0.15s ease;
}
.chat__back:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.3);
}
.chat__back svg {
  width: 20px;
  height: 20px;
}

.chat__peer {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat__peer-avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  overflow: hidden;
}

.chat__peer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.chat__peer-name {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat__peer-sub {
  font-size: 11px;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat__status {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 10px;
  border-radius: 999px;
}

.chat__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a7f3d0;
  box-shadow: 0 0 0 2px rgba(167, 243, 208, 0.4);
}

/* ========== 预约信息条 ========== */
.chat__booking {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 12px 0;
  padding: 10px 12px;
  background: #e8fbf5;
  border: 1px solid #c8f2e4;
  border-radius: 12px;
}

.chat__booking-icon {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  color: #0e9f7c;
}

.chat__booking-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.chat__booking-title {
  font-size: 13px;
  font-weight: 700;
  color: #067a5e;
}

.chat__booking-hint {
  font-size: 11px;
  color: #48a08c;
}

/* ========== 消息列表 ========== */
.chat__list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 12px 12px 16px;
}

.chat__divide {
  text-align: center;
  margin: 2px 0 10px;
}
.chat__divide-text {
  font-size: 11px;
  color: #9ca3af;
}

.chat__time {
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  margin: 10px 0 8px;
}

.chat__sys {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}
.chat__sys-text {
  font-size: 11px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 12px;
  border-radius: 999px;
  text-align: center;
}

/* ========== 消息行 ========== */
.chat__row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin: 8px 0;
}
.chat__row--me {
  justify-content: flex-end;
}
.chat__row--peer {
  justify-content: flex-start;
}

.chat__msg-avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
}

.chat__msg {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
}

.chat__msg--me {
  flex-direction: row-reverse;
}

.chat__stamp {
  flex-shrink: 0;
  font-size: 10px;
  color: #b6bec8;
  line-height: 1;
  padding-bottom: 3px;
  white-space: nowrap;
}

.chat__bubble {
  max-width: 72%;
  padding: 9px 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  border-radius: 14px;
}

.chat__bubble--peer {
  background: #fff;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.chat__bubble--me {
  background: linear-gradient(180deg, #2dd4a8 0%, #26c49b 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 10px rgba(45, 212, 168, 0.28);
}

/* ========== 正在输入动画 ========== */
.chat__bubble--typing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 12px 14px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: dotBounce 1.2s infinite ease-in-out;
}
.dot:nth-child(2) {
  animation-delay: 0.15s;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes dotBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* ========== 输入栏 ========== */
.chat__input {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-bottom, 0px));
  padding-top: 10px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
}

.chat__input-field {
  flex: 1;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
  padding: 0 16px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.chat__input-field:focus {
  border-color: #2dd4a8;
  background: #fff;
}
.chat__input-field::placeholder {
  color: #9ca3af;
}

.chat__send {
  flex-shrink: 0;
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(45, 212, 168, 0.32);
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.chat__send:active {
  transform: scale(0.94);
}
.chat__send:disabled {
  opacity: 0.5;
  box-shadow: none;
  cursor: not-allowed;
}

/* ========== 大屏居中 ========== */
@media (min-width: 481px) {
  .chat-mask {
    align-items: center;
  }
  .chat {
    height: 80vh;
    max-height: 720px;
    border-radius: 18px;
  }
}
</style>
