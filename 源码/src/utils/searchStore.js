/**
 * searchStore.js
 * Shared search utility: search history (localStorage), hot words, suggestion DB
 */

const STORAGE_KEY = 'luya_search_history'

/* ========== Search History ========== */

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveHistory(text) {
  if (!text) return []
  const list = getHistory().filter(h => h !== text)
  list.unshift(text)
  if (list.length > 12) list.pop()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}

export function removeHistoryItem(text) {
  const list = getHistory().filter(h => h !== text)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}

/* ========== Hot Search Words ========== */

export const hotWords = [
  { text: '北京协和医院', tag: '热', tagType: 'hot' },
  { text: '心血管内科', tag: '荐', tagType: 'new' },
  { text: '高血压', tag: '', tagType: '' },
  { text: '糖尿病', tag: '', tagType: '' },
  { text: '儿童发烧', tag: '', tagType: '' },
  { text: '王明钦', tag: '', tagType: '' },
  { text: '皮肤病', tag: '', tagType: '' },
  { text: '口腔溃疡', tag: '', tagType: '' },
  { text: '眼科', tag: '', tagType: '' },
  { text: '体检套餐', tag: '新', tagType: 'new' }
]

/* ========== Search Suggestion DB ========== */

export const searchDB = [
  // Hospitals
  { id: 'h1', type: 'hospital', name: '北京协和医院', sub: '三级甲等 · 东城区' },
  { id: 'h2', type: 'hospital', name: '北京儿童医院', sub: '三级甲等 · 西城区' },
  { id: 'h3', type: 'hospital', name: '北京大学口腔医院', sub: '三级甲等 · 海淀区' },
  { id: 'h4', type: 'hospital', name: '北京大学第一医院', sub: '三级甲等 · 西城区' },
  { id: 'h5', type: 'hospital', name: '上海瑞金医院', sub: '三级甲等 · 黄浦区' },
  { id: 'h6', type: 'hospital', name: '华西医院', sub: '三级甲等 · 成都武侯区' },
  // Departments
  { id: 'd1', type: 'department', name: '心血管内科', sub: '内科' },
  { id: 'd2', type: 'department', name: '消化内科', sub: '内科' },
  { id: 'd3', type: 'department', name: '呼吸内科', sub: '内科' },
  { id: 'd4', type: 'department', name: '神经内科', sub: '内科' },
  { id: 'd5', type: 'department', name: '内分泌科', sub: '内科' },
  { id: 'd6', type: 'department', name: '儿科', sub: '儿科' },
  { id: 'd7', type: 'department', name: '口腔科', sub: '口腔' },
  { id: 'd8', type: 'department', name: '皮肤科', sub: '皮肤' },
  { id: 'd9', type: 'department', name: '眼科', sub: '眼科' },
  { id: 'd10', type: 'department', name: '骨科', sub: '外科' },
  { id: 'd11', type: 'department', name: '妇产科', sub: '妇产科' },
  { id: 'd12', type: 'department', name: '耳鼻喉科', sub: '五官科' },
  // Doctors
  { id: 'doc1', type: 'doctor', name: '王明钦', sub: '心血管内科 · 主任医师' },
  { id: 'doc2', type: 'doctor', name: '秦冉', sub: '儿科 · 主治医师' },
  { id: 'doc3', type: 'doctor', name: '覃议江', sub: '口腔科 · 副主任医师' },
  { id: 'doc4', type: 'doctor', name: '李思远', sub: '骨科 · 主任医师' },
  { id: 'doc5', type: 'doctor', name: '张晓峰', sub: '眼科 · 副主任医师' },
  // Diseases
  { id: 'dis1', type: 'disease', name: '高血压', sub: '心血管内科' },
  { id: 'dis2', type: 'disease', name: '糖尿病', sub: '内分泌科' },
  { id: 'dis3', type: 'disease', name: '高血脂', sub: '心血管内科' },
  { id: 'dis4', type: 'disease', name: '感冒', sub: '呼吸内科' },
  { id: 'dis5', type: 'disease', name: '口腔溃疡', sub: '口腔科' },
  { id: 'dis6', type: 'disease', name: '湿疹', sub: '皮肤科' },
  { id: 'dis7', type: 'disease', name: '近视', sub: '眼科' },
  { id: 'dis8', type: 'disease', name: '胃炎', sub: '消化内科' }
]

/* ========== Suggestion lookup ========== */

export function getSuggestions(keyword) {
  if (!keyword || keyword.trim().length < 1) return []
  const kw = keyword.trim().toLowerCase()
  return searchDB.filter(item =>
    item.name.toLowerCase().includes(kw) ||
    (item.sub && item.sub.toLowerCase().includes(kw))
  ).slice(0, 12)
}

/* ========== Helpers ========== */

export function typeLabel(t) {
  return { hospital: '医院', department: '科室', doctor: '医生', disease: '疾病' }[t] || ''
}

export function typeIconPath(t) {
  const paths = {
    hospital: 'M19 4h-2V2h-2v2H9V2H7v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
    department: 'M19 8l-4 4 4 4M11 8l-4 4 4 4',
    doctor: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    disease: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
  }
  return paths[t] || paths.disease
}

export function highlightKeyword(text, keyword) {
  if (!keyword) return text
  const kw = keyword.trim()
  const idx = text.toLowerCase().indexOf(kw.toLowerCase())
  if (idx === -1) return text
  return text.slice(0, idx)
    + '<span class="hl">'
    + text.slice(idx, idx + kw.length)
    + '</span>'
    + text.slice(idx + kw.length)
}
