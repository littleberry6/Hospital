/**
 * 用户认证状态管理（localStorage 持久化）
 * 管理：登录态、实名认证、健康卡绑定
 */

const AUTH_KEY = 'luya_auth'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

/* ========== 登录态 ========== */
export function getAuth() {
  return readAll()
}

export function isLoggedIn() {
  return !!readAll().phone
}

export function loginByPhone(phone) {
  const data = readAll()
  data.phone = phone
  data.loginTime = Date.now()
  data.loginType = data.loginType || 'phone'
  writeAll(data)
  return data
}

export function loginBySocial(type) {
  // type: 'wechat' | 'alipay'
  const data = readAll()
  data.loginType = type
  data.loginTime = Date.now()
  // 模拟社交登录自动绑定手机号
  if (!data.phone) data.phone = '138****8888'
  writeAll(data)
  return data
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

/* ========== 实名认证 ========== */
export function isVerified() {
  return !!readAll().realName
}

export function setVerified({ realName, idCard }) {
  const data = readAll()
  data.realName = realName
  data.idCard = idCard
  data.verifiedAt = Date.now()
  writeAll(data)
  return data
}

/* ========== 健康卡 / 医保绑定 ========== */
export function getHealthCard() {
  return readAll().healthCard || null
}

export function bindHealthCard(cardNo, type) {
  // type: 'health' | 'insurance'
  const data = readAll()
  if (!data.healthCard) data.healthCard = {}
  if (type === 'insurance') {
    data.healthCard.insurance = cardNo
  } else {
    data.healthCard.health = cardNo
  }
  data.healthCard.updatedAt = Date.now()
  writeAll(data)
  return data.healthCard
}
