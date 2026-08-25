/**
 * 预约记录存储（localStorage 持久化）
 * 预约完成后生成约号 + 就诊序号，供消息提醒与「我的」页面读取。
 * 支持两种来源：
 *   1. 旧版预约表单（inquiry/vaccine/checkup）
 *   2. 新版挂号流程（hospital → dept → doctor/schedule → patient → pay）
 */

const STORAGE_KEY = 'luya-bookings'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* 存储失败静默降级 */
  }
}

/* ========== 生成约号：YY20260821-0001 ========== */
function makeSerialNo(list) {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `YY${date}-${String(list.length + 1).padStart(4, '0')}`
}

/* ========== 生成就诊序号：当天同科室递增，如 A001 ========== */
function makeVisitNo(list, dept) {
  // 取当天同科室已存在的序号数
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const prefix = dept ? dept.charAt(0).toUpperCase() : 'A'
  const sameDaySameDept = list.filter((b) => {
    if (!b.visitDate) return false
    return b.visitDate === todayStr && b.dept === dept
  })
  return `${prefix}${String(sameDaySameDept.length + 1).padStart(3, '0')}`
}

/* ========== 预约列表（旧→新） ========== */
export function listBookings() {
  return readAll()
}

/* ========== 已支付预约单列表 ========== */
export function listPaidBookings() {
  return readAll().filter((b) => b.paid === true)
}

/* ========== 最新一条预约 ========== */
export function latestBooking() {
  const list = readAll()
  return list.length ? list[list.length - 1] : null
}

/* ========== 最新一条已支付预约 ========== */
export function latestPaidBooking() {
  const list = readAll().filter((b) => b.paid === true)
  return list.length ? list[list.length - 1] : null
}

/* ========== 未读预约提醒数 ========== */
export function unreadBookingCount() {
  return readAll().filter((b) => !b.read).length
}

/* ========== 新增预约（生成约号） ========== */
export function addBooking(data) {
  const list = readAll()
  const booking = {
    id: 'bk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    serialNo: makeSerialNo(list),
    read: false,
    paid: false,
    createdAt: Date.now(),
    ...data
  }
  list.push(booking)
  writeAll(list)
  return booking
}

/* ========== 新增挂号预约（含就诊序号 + 支付信息） ========== */
export function addPaidBooking(data) {
  const list = readAll()
  const visitNo = makeVisitNo(list, data.dept)
  const booking = {
    id: 'bk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    serialNo: makeSerialNo(list),
    visitNo,
    read: false,
    paid: true,
    source: 'booking',
    createdAt: Date.now(),
    ...data
  }
  list.push(booking)
  writeAll(list)
  return booking
}

/* ========== 标记已读 ========== */
export function markBookingRead(id) {
  const list = readAll()
  const b = list.find((x) => x.id === id)
  if (b) {
    b.read = true
    writeAll(list)
  }
}

/* ========== 删除预约记录 ========== */
export function removeBooking(id) {
  const list = readAll().filter((b) => b.id !== id)
  writeAll(list)
}
