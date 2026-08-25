/**
 * 就诊人管理（localStorage 持久化）
 * 支持：添加 / 编辑 / 删除 / 设默认
 * 就诊人类型：本人 / 儿童 / 老人 / 其他
 */

const KEY = 'luya_patients'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

function genId() {
  return 'P' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/* ========== 查询 ========== */
export function getPatients() {
  return readAll().sort((a, b) => {
    // 默认就诊人排第一
    if (a.isDefault) return -1
    if (b.isDefault) return 1
    return (a.createdAt || 0) - (b.createdAt || 0)
  })
}

export function getDefaultPatient() {
  return readAll().find((p) => p.isDefault) || null
}

export function getPatientById(id) {
  return readAll().find((p) => p.id === id) || null
}

/* ========== 添加 ========== */
export function addPatient(data) {
  const list = readAll()
  // 第一个就诊人自动设为默认
  if (list.length === 0) data.isDefault = true
  const patient = {
    id: genId(),
    ...data,
    createdAt: Date.now()
  }
  list.push(patient)
  writeAll(list)
  return patient
}

/* ========== 编辑 ========== */
export function updatePatient(id, data) {
  const list = readAll()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...data, id, updatedAt: Date.now() }
  writeAll(list)
  return list[idx]
}

/* ========== 删除 ========== */
export function deletePatient(id) {
  const list = readAll()
  const deleted = list.find((p) => p.id === id)
  const filtered = list.filter((p) => p.id !== id)
  // 如果删的是默认，将第一个设为默认
  if (deleted && deleted.isDefault && filtered.length > 0) {
    filtered[0].isDefault = true
  }
  writeAll(filtered)
  return filtered
}

/* ========== 设默认 ========== */
export function setDefault(id) {
  const list = readAll()
  list.forEach((p) => {
    p.isDefault = p.id === id
  })
  writeAll(list)
  return list.find((p) => p.id === id)
}

/* ========== 初始化示例数据 ========== */
export function ensureSeed() {
  const list = readAll()
  if (list.length > 0) return
  const seed = [
    {
      id: genId(),
      name: '张明远',
      idCard: '110101199003071234',
      phone: '13800001234',
      gender: 'male',
      birthDate: '1990-03-07',
      relationship: '本人',
      type: 'self',
      isDefault: true,
      socialSecurityCard: '110108199003071234',
      medicalCard: 'BJ20260001',
      createdAt: Date.now() - 86400000
    },
    {
      id: genId(),
      name: '张小明',
      idCard: '110101202001156789',
      phone: '13800001234',
      gender: 'male',
      birthDate: '2020-01-15',
      relationship: '子女',
      type: 'child',
      isDefault: false,
      medicalCard: 'BJ20260002',
      createdAt: Date.now() - 43200000
    },
    {
      id: genId(),
      name: '李秀英',
      idCard: '110101196205204321',
      phone: '13800005678',
      gender: 'female',
      birthDate: '1962-05-20',
      relationship: '母亲',
      type: 'elderly',
      isDefault: false,
      socialSecurityCard: '110162196205204321',
      medicalCard: 'BJ20260003',
      createdAt: Date.now() - 21600000
    }
  ]
  writeAll(seed)
}
