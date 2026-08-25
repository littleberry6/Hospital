/**
 * 健康档案 - 离线 Mock 数据
 */

/* ============ 用户信息 ============ */
export const userProfile = {
  name: '文 静',
  gender: '女',
  age: 34,
  // 头像使用文字占位，无需图片资源
  avatarText: '文',
  avatarColor: '#2dd4a8'
}

/* ============ 核心体征（106 斤卡片） ============ */
export const vitalSigns = {
  weight: 106, // 斤
  metrics: [
    {
      key: 'bmi',
      label: 'BMI',
      value: '20.7',
      status: 'normal',
      statusText: '正常'
    },
    {
      key: 'pulse',
      label: '脉搏',
      value: '92',
      status: 'normal',
      statusText: '正常'
    },
    {
      key: 'bp',
      label: '血压',
      value: '176/110',
      status: 'abnormal',
      statusText: '偏高'
    },
    {
      key: 'hr',
      label: '心率',
      value: '92',
      status: 'normal',
      statusText: '正常'
    }
  ]
}

/* ============ 血糖 / 血脂 ============ */
export const bloodGlucose = {
  unit: 'mmol/L',
  title: '血糖',
  // 折线图点位（横轴 0-100，纵轴 0-100）
  points: [
    { x: 15, value: 4.8, label: '空腹' },
    { x: 75, value: 8.5, label: '餐后' }
  ],
  range: { min: 3, max: 10 } // 视觉刻度范围
}

export const bloodLipid = {
  unit: 'mmol/L',
  title: '血脂',
  items: [
    { key: 'tc', name: '胆固醇', value: 3.4, max: 6.0, normal: true },
    { key: 'tg', name: '甘油三酯', value: 1.2, max: 2.5, normal: true }
  ]
}

/* ============ 健康报告 ============ */
export const reportTabs = [
  { key: 'physical', label: '体检报告' },
  { key: 'history', label: '基础病历' },
  { key: 'allergy', label: '过敏史' }
]

/* ============ 报告分组 ============ */
/**
 * 每组包含时间 + N 个报告项。
 * 报告项的 cover 用 inline SVG 占位（无需依赖图片资源）：
 *  - iconKey: 决定缩略图主题图标
 *  - accent:  渐变色
 */
export const reportGroups = [
  {
    id: 'g1',
    date: '2022年9月25日',
    items: [
      { id: 'r1', iconKey: 'blood', accent: '#fecaca', title: '血常规' },
      { id: 'r2', iconKey: 'liver', accent: '#bbf7d0', title: '肝功能' },
      { id: 'r3', iconKey: 'kidney', accent: '#bae6fd', title: '肾功能' },
      { id: 'r4', iconKey: 'urine', accent: '#fde68a', title: '尿常规' }
    ]
  },
  {
    id: 'g2',
    date: '2021年5月18日',
    items: [
      { id: 'r5', iconKey: 'heart', accent: '#fbcfe8', title: '心电图' },
      { id: 'r6', iconKey: 'lung', accent: '#a7f3d0', title: '胸片' },
      { id: 'r7', iconKey: 'eye', accent: '#c4b5fd', title: '眼科' },
      { id: 'r8', iconKey: 'dental', accent: '#fcd34d', title: '口腔' }
    ]
  },
  {
    id: 'g3',
    date: '2020年11月08日',
    items: [
      { id: 'r9', iconKey: 'blood', accent: '#fecaca', title: '血常规' },
      { id: 'r10', iconKey: 'liver', accent: '#bbf7d0', title: '肝功能' },
      { id: 'r11', iconKey: 'kidney', accent: '#bae6fd', title: '肾功能' },
      { id: 'r12', iconKey: 'bone', accent: '#fed7aa', title: '骨密度' }
    ]
  }
]

/**
 * 报告缩略图 SVG 图标（viewBox 0 0 64 64）
 * 全部用 currentColor，便于颜色继承
 */
export const reportIcons = {
  blood: `<rect x="14" y="20" width="36" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 14h24l-4 6H24z" fill="currentColor"/><circle cx="32" cy="34" r="4" fill="currentColor"/>`,
  liver: `<path d="M16 28c0-8 8-14 16-14s16 6 16 14c0 6-4 12-8 16-2 2-4 4-8 4s-6-2-8-4c-4-4-8-10-8-16z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 32c4 4 12 4 16 0" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  kidney: `<path d="M22 18c-6 0-10 6-10 14s4 14 10 14c4 0 6-2 8-4 4-4 4-10 0-14-2-2-4-10-8-10z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M44 18c6 0 10 6 10 14s-4 14-10 14c-4 0-6-2-8-4" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
  urine: `<path d="M24 14h16l-4 36c0 3-2 4-4 4s-4-1-4-4z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M28 26h8M28 36h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
  heart: `<path d="M32 50s-18-12-18-24c0-7 5-12 12-12 4 0 6 2 6 2s2-2 6-2c7 0 12 5 12 12 0 12-18 24-18 24z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 28l8 6 8-6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  lung: `<path d="M20 14c-6 0-10 6-10 16 0 12 6 20 14 20 4 0 6-4 6-8V22c0-4-4-8-10-8z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M44 14c6 0 10 6 10 16 0 12-6 20-14 20-4 0-6-4-6-8" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M32 18v28" stroke="currentColor" stroke-width="2.5"/>`,
  eye: `<path d="M8 32c8-12 40-12 48 0-8 12-40 12-48 0z" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="32" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="32" r="3" fill="currentColor"/>`,
  dental: `<path d="M20 14c0-2 2-4 4-4h16c2 0 4 2 4 4 0 8-2 14-2 22 0 6-2 14-4 14s-4-6-4-12c0-4-2-4-2-4s-2 0-2 4c0 6-2 12-4 12s-4-8-4-14c0-8-2-14-2-22z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`,
  bone: `<path d="M18 22c-4-2-4-8 0-10s10 0 10 4c0 2 0 4 2 4h4c2 0 2-2 2-4 0-4 6-6 10-4s4 8 0 10c-2 1-4 1-4 4v6c0 3 2 3 4 4 4 2 4 8 0 10s-10 0-10-4c0-2 0-4-2-4h-4c-2 0-2 2-2 4 0 4-6 6-10 4s-4-8 0-10c2-1 4-1 4-4v-6c0-3-2-3-4-4z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`
}

/* ============ 历史数据对比（占位数据） ============ */
export const weightHistory = [
  { date: '08-01', value: 110 },
  { date: '08-08', value: 108 },
  { date: '08-15', value: 107 },
  { date: '08-22', value: 106 },
  { date: '08-29', value: 105 }
]
