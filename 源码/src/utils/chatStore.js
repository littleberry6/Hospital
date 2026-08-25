/**
 * 聊天记录存储（localStorage 持久化）
 * 每个预约会话一条记录，包含对方信息、预约信息与全部消息（含时间戳）。
 */

const STORAGE_KEY = 'luya-chat-sessions'

/* ========== 读取全部会话 ========== */
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    /* 存储失败（如隐私模式）静默降级，仅内存态 */
  }
}

/* ========== 获取会话（无则创建） ========== */
export function getSession(sessionId) {
  const all = readAll()
  return all[sessionId] || null
}

/* ========== 创建/覆盖会话 ========== */
export function createSession(sessionId, { peer, booking, systemText }) {
  const all = readAll()
  const now = Date.now()
  const session = {
    id: sessionId,
    peer,
    booking,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: 'sys-' + now,
        role: 'system',
        text: systemText || `预约成功：${booking.dateLabel} ${booking.timeText}`,
        time: now
      }
    ]
  }
  all[sessionId] = session
  writeAll(all)
  return session
}

/* ========== 追加消息 ========== */
export function appendMessage(sessionId, message) {
  const all = readAll()
  const session = all[sessionId]
  if (!session) return null
  const msg = {
    id: message.id || 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    role: message.role, // 'me' | 'peer' | 'system'
    text: message.text,
    time: message.time || Date.now()
  }
  session.messages.push(msg)
  session.updatedAt = msg.time
  writeAll(all)
  return msg
}

/* ========== 会话列表（最近优先） ========== */
export function listSessions() {
  const all = readAll()
  return Object.values(all).sort((a, b) => b.updatedAt - a.updatedAt)
}

/* ========== 删除会话 ========== */
export function removeSession(sessionId) {
  const all = readAll()
  delete all[sessionId]
  writeAll(all)
}

/* ========== 时间格式化 ========== */
function pad(n) {
  return String(n).padStart(2, '0')
}

/** HH:mm */
export function formatTime(ts) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 今天显示 HH:mm；昨天显示「昨天 HH:mm」；更早显示「M月D日 HH:mm」 */
export function formatFullTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const day = 24 * 60 * 60 * 1000
  if (ts >= today) return formatTime(ts)
  if (ts >= today - day) return `昨天 ${formatTime(ts)}`
  return `${d.getMonth() + 1}月${d.getDate()}日 ${formatTime(ts)}`
}
