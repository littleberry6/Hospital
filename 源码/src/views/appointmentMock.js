/**
 * 预约表单页 Mock 数据
 * - months: 可选月份（10/11/12 月 2023）
 * - datesByMonth: 每个月的日期 chips 数据（日期数字 / 周几 / 状态）
 * - inquirySchedules: 问诊 Tab 医生排班（头像 / 姓名 / 科室 / 医院 / 时间段 / 状态）
 * - vaccineSchedules: 疫苗 Tab 卡片（圆形 tag + 疫苗名 / 医院 / 时间 / 针剂）
 * - checkupPackages: 体检 Tab 套餐
 */

import doctorMale45 from '@/assets/avatars/doctor-male-45.png'
import doctorFemale42 from '@/assets/avatars/doctor-female-42.png'
import doctorMale55 from '@/assets/avatars/doctor-male-55.png'
import doctorFemale50 from '@/assets/avatars/doctor-female-50.png'
import doctorMale30 from '@/assets/avatars/doctor-male-30.png'
import doctorFemale35 from '@/assets/avatars/doctor-female-35.png'

/* ========== Tab 类型 ========== */
export const appointmentTabs = [
  { id: 'inquiry', label: '问诊' },
  { id: 'vaccine', label: '疫苗' },
  { id: 'checkup', label: '体检' }
]

/* ========== 月份（按 2023 年模拟） ========== */
export const months = [
  { id: '2023-10', label: '10月2023年' },
  { id: '2023-11', label: '11月2023年' },
  { id: '2023-12', label: '12月2023年' }
]

/* ========== 日期 chips ========== */
export const datesByMonth = {
  '2023-10': [
    { day: 8, weekday: '周一', available: false },
    { day: 9, weekday: '周二', available: true },
    { day: 10, weekday: '周三', available: true, selected: true },
    { day: 11, weekday: '周四', available: true },
    { day: 12, weekday: '周五', available: true },
    { day: 13, weekday: '周六', available: true },
    { day: 14, weekday: '周日', available: true },
    { day: 15, weekday: '周一', available: true },
    { day: 16, weekday: '周二', available: true },
    { day: 17, weekday: '周三', available: false },
    { day: 18, weekday: '周四', available: true },
    { day: 19, weekday: '周五', available: true },
    { day: 20, weekday: '周六', available: true },
    { day: 21, weekday: '周日', available: true }
  ],
  '2023-11': [
    { day: 8, weekday: '周四', available: false },
    { day: 9, weekday: '周五', available: true, selected: true },
    { day: 10, weekday: '周六', available: true },
    { day: 11, weekday: '周日', available: true },
    { day: 12, weekday: '周一', available: true },
    { day: 13, weekday: '周二', available: true },
    { day: 14, weekday: '周三', available: true },
    { day: 15, weekday: '周四', available: true },
    { day: 16, weekday: '周五', available: true },
    { day: 17, weekday: '周六', available: false },
    { day: 18, weekday: '周日', available: true },
    { day: 19, weekday: '周一', available: true },
    { day: 20, weekday: '周二', available: true },
    { day: 21, weekday: '周三', available: true }
  ],
  '2023-12': [
    { day: 8, weekday: '周五', available: false },
    { day: 9, weekday: '周六', available: true, selected: true },
    { day: 10, weekday: '周日', available: true },
    { day: 11, weekday: '周一', available: true },
    { day: 12, weekday: '周二', available: true },
    { day: 13, weekday: '周三', available: true },
    { day: 14, weekday: '周四', available: true },
    { day: 15, weekday: '周五', available: true },
    { day: 16, weekday: '周六', available: true },
    { day: 17, weekday: '周日', available: false },
    { day: 18, weekday: '周一', available: true },
    { day: 19, weekday: '周二', available: true },
    { day: 20, weekday: '周三', available: true },
    { day: 21, weekday: '周四', available: true }
  ]
}

/* ========== 问诊 Tab 医生排班 ========== */
export const inquirySchedules = [
  {
    id: 's1',
    avatar: doctorMale45,
    name: '肖莉莉',
    dept: '皮肤科',
    title: '主治医师',
    hospital: '中国医科大学附属盛京医院',
    timeText: '下午 14:30~15:00',
    status: 'available' // available | full
  },
  {
    id: 's2',
    avatar: doctorFemale42,
    name: '秦申',
    dept: '儿科',
    title: '主治医师',
    hospital: '广东省人民医院',
    timeText: '下午 16:30~17:00',
    status: 'available'
  },
  {
    id: 's3',
    avatar: doctorMale55,
    name: '覃识江',
    dept: '内科',
    title: '副主任医师',
    hospital: '北京协和医院',
    timeText: '下午 15:00~15:30',
    status: 'available'
  },
  {
    id: 's4',
    avatar: doctorFemale50,
    name: '姚佩佩',
    dept: '妇产科',
    title: '主任医师',
    hospital: '上海市第一人民医院',
    timeText: '下午 17:00~17:30',
    status: 'full'
  },
  {
    id: 's5',
    avatar: doctorMale30,
    name: '李建国',
    dept: '骨科',
    title: '副主任医师',
    hospital: '中南大学湘雅医院',
    timeText: '上午 09:30~10:00',
    status: 'available'
  },
  {
    id: 's6',
    avatar: doctorFemale35,
    name: '陈雪',
    dept: '眼科',
    title: '主治医师',
    hospital: '中山大学中山眼科中心',
    timeText: '上午 10:00~10:30',
    status: 'available'
  }
]

/* ========== 疫苗 Tab ========== */
export const vaccineSchedules = [
  {
    id: 'v1',
    tag: '四价',
    tagBg: 'linear-gradient(180deg, #6ee7b7, #34d399)',
    name: '四价HPV疫苗',
    hospital: '广东省人民医院',
    timeText: '下午14:30~16:30',
    doses: '两针剂'
  },
  {
    id: 'v2',
    tag: '九价',
    tagBg: 'linear-gradient(180deg, #fcd34d, #f59e0b)',
    name: '九价HPV疫苗',
    hospital: '北京协和医院',
    timeText: '上午 09:00~11:00',
    doses: '三针剂'
  },
  {
    id: 'v3',
    tag: '乙肝',
    tagBg: 'linear-gradient(180deg, #93c5fd, #3b82f6)',
    name: '乙肝疫苗',
    hospital: '上海市第一人民医院',
    timeText: '下午 14:00~16:00',
    doses: '三针剂'
  },
  {
    id: 'v4',
    tag: '流感',
    tagBg: 'linear-gradient(180deg, #fda4af, #f43f5e)',
    name: '四价流感疫苗',
    hospital: '中南大学湘雅医院',
    timeText: '上午 10:00~11:30',
    doses: '一针剂'
  },
  {
    id: 'v5',
    tag: '新冠',
    tagBg: 'linear-gradient(180deg, #c4b5fd, #8b5cf6)',
    name: '新冠疫苗加强针',
    hospital: '中山大学中山眼科中心',
    timeText: '下午 15:00~16:30',
    doses: '一针剂'
  }
]

/* ========== 体检 Tab ========== */
export const checkupPackages = [
  {
    id: 'c1',
    tag: '基础',
    tagBg: 'linear-gradient(180deg, #a7f3d0, #10b981)',
    name: '基础体检套餐',
    hospital: '美年大健康',
    timeText: '上午 08:00~10:00',
    meta: '常规项 12 项'
  },
  {
    id: 'c2',
    tag: '高级',
    tagBg: 'linear-gradient(180deg, #c4b5fd, #7c3aed)',
    name: '高级体检套餐',
    hospital: '爱康国宾',
    timeText: '上午 08:00~11:00',
    meta: '常规项 32 项'
  },
  {
    id: 'c3',
    tag: '尊享',
    tagBg: 'linear-gradient(180deg, #fcd34d, #d97706)',
    name: '尊享体检套餐',
    hospital: '慈铭体检',
    timeText: '全天 08:00~16:00',
    meta: '常规项 56 项'
  }
]

/* ========== 工具：根据 Tab 类型 + 当前月份 + 当前日期获取对应卡片列表 ========== */
export function getListByTab(tabId, _monthId, _date) {
  if (tabId === 'inquiry') return inquirySchedules
  if (tabId === 'vaccine') return vaccineSchedules
  if (tabId === 'checkup') return checkupPackages
  return []
}
