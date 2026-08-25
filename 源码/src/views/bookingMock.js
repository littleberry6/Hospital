/**
 * 预约挂号核心流程 Mock 数据
 * - bookingHospitals: 精选医院列表
 * - bookingDoctors: 各医院各科室的医生排班
 * - generateSchedule: 动态生成 7 天排班（上午/下午/晚间 + 号源剩余）
 * - feeData: 普通号/专家号费用
 */

import doctorMale45 from '@/assets/avatars/doctor-male-45.png'
import doctorFemale42 from '@/assets/avatars/doctor-female-42.png'
import doctorMale55 from '@/assets/avatars/doctor-male-55.png'
import doctorFemale50 from '@/assets/avatars/doctor-female-50.png'
import doctorMale30 from '@/assets/avatars/doctor-male-30.png'
import doctorFemale35 from '@/assets/avatars/doctor-female-35.png'

/* ========== 精选医院 ========== */
export const bookingHospitals = [
  {
    id: 'bh-001',
    name: '北京协和医院',
    level: '3A',
    levelLabel: '三甲',
    address: '北京市东城区帅府园一号',
    distance: 2.3,
    rating: 4.9,
    insurance: true,
    tags: ['综合', '全国百强', '医保定点']
  },
  {
    id: 'bh-002',
    name: '中国医科大学附属盛京医院',
    level: '3A',
    levelLabel: '三甲',
    address: '沈阳市和平区三好街36号',
    distance: 5.1,
    rating: 4.7,
    insurance: true,
    tags: ['综合', '东北区域中心', '医保定点']
  },
  {
    id: 'bh-003',
    name: '广东省人民医院',
    level: '3A',
    levelLabel: '三甲',
    address: '广州市越秀区中山二路106号',
    distance: 3.8,
    rating: 4.6,
    insurance: true,
    tags: ['综合', '华南旗舰', '医保定点']
  },
  {
    id: 'bh-004',
    name: '上海市第一人民医院',
    level: '3A',
    levelLabel: '三甲',
    address: '上海市虹口区海宁路100号',
    distance: 4.2,
    rating: 4.5,
    insurance: true,
    tags: ['综合', '华东知名', '医保定点']
  },
  {
    id: 'bh-005',
    name: '中南大学湘雅医院',
    level: '3A',
    levelLabel: '三甲',
    address: '长沙市开福区湘雅路87号',
    distance: 6.5,
    rating: 4.6,
    insurance: true,
    tags: ['综合', '百年名院', '医保定点']
  },
  {
    id: 'bh-006',
    name: '北京市第六医院',
    level: '3A',
    levelLabel: '三甲',
    address: '北京市东城区交道口北二巷36号',
    distance: 1.8,
    rating: 4.4,
    insurance: true,
    tags: ['综合', '社区就近', '医保定点']
  },
  {
    id: 'bh-007',
    name: '中山大学中山眼科中心',
    level: '3A',
    levelLabel: '三甲',
    address: '广州市天河区先烈南路54号',
    distance: 5.7,
    rating: 4.8,
    insurance: true,
    tags: ['专科', '眼科全国第一', '医保定点']
  },
  {
    id: 'bh-008',
    name: '美年大健康体检中心',
    level: '2A',
    levelLabel: '二甲',
    address: '北京市朝阳区建国路88号',
    distance: 3.1,
    rating: 4.2,
    insurance: false,
    tags: ['民营', '体检中心', '自费']
  }
]

/* ========== 各医院支持的科室 ========== */
export const hospitalDeptMap = {
  'bh-001': ['内科', '外科', '儿科', '妇产科', '眼科', '皮肤科', '神经内科', '心脏内科', '呼吸内科', '消化内科', '骨科', '肿瘤科'],
  'bh-002': ['内科', '外科', '儿科', '妇产科', '眼科', '耳鼻喉科', '皮肤科', '神经内科', '消化内科', '骨科'],
  'bh-003': ['内科', '外科', '儿科', '妇产科', '眼科', '口腔科', '皮肤科', '心脏内科', '呼吸内科', '内分泌科'],
  'bh-004': ['内科', '外科', '儿科', '妇产科', '眼科', '耳鼻喉科', '口腔科', '神经内科', '骨科', '泌尿外科'],
  'bh-005': ['内科', '外科', '儿科', '妇产科', '神经内科', '心脏内科', '呼吸内科', '消化内科', '骨科', '肿瘤科'],
  'bh-006': ['内科', '外科', '儿科', '心脏内科', '神经内科', '消化内科', '内分泌科', '骨科'],
  'bh-007': ['眼科'],
  'bh-008': ['内科', '外科', '骨科']
}

/* ========== 医生数据（按医院+科室组织） ========== */
export const bookingDoctors = [
  // 北京协和医院
  { id: 'bd-001', hospitalId: 'bh-001', name: '覃识江', title: '副主任医师', dept: '内科', avatar: doctorMale55, expertise: '消化系统疾病、慢性胃炎、胃溃疡', fee: 50 },
  { id: 'bd-002', hospitalId: 'bh-001', name: '姚佩佩', title: '主任医师', dept: '妇产科', avatar: doctorFemale50, expertise: '高危妊娠、妇科肿瘤、微创手术', fee: 100 },
  { id: 'bd-003', hospitalId: 'bh-001', name: '陈雪', title: '主治医师', dept: '眼科', avatar: doctorFemale35, expertise: '白内障、青光眼、眼底病变', fee: 30 },
  { id: 'bd-004', hospitalId: 'bh-001', name: '李建国', title: '副主任医师', dept: '骨科', avatar: doctorMale30, expertise: '脊柱疾病、关节置换、创伤骨科', fee: 50 },

  // 盛京医院
  { id: 'bd-005', hospitalId: 'bh-002', name: '肖莉莉', title: '主治医师', dept: '皮肤科', avatar: doctorFemale42, expertise: '湿疹、银屑病、过敏性皮炎', fee: 30 },
  { id: 'bd-006', hospitalId: 'bh-002', name: '秦申', title: '主治医师', dept: '儿科', avatar: doctorFemale42, expertise: '小儿呼吸道疾病、新生儿保健', fee: 30 },
  { id: 'bd-007', hospitalId: 'bh-002', name: '王德明', title: '主任医师', dept: '外科', avatar: doctorMale45, expertise: '肝胆胰外科、腹腔镜手术', fee: 100 },

  // 广东省人民医院
  { id: 'bd-008', hospitalId: 'bh-003', name: '张慧芳', title: '主任医师', dept: '心脏内科', avatar: doctorFemale50, expertise: '冠心病介入治疗、心律失常射频消融', fee: 100 },
  { id: 'bd-009', hospitalId: 'bh-003', name: '刘伟强', title: '副主任医师', dept: '呼吸内科', avatar: doctorMale45, expertise: '慢性阻塞性肺病、哮喘、肺部感染', fee: 50 },
  { id: 'bd-010', hospitalId: 'bh-003', name: '赵敏', title: '主治医师', dept: '儿科', avatar: doctorFemale35, expertise: '小儿消化不良、营养不良、发育迟缓', fee: 30 },

  // 上海第一人民医院
  { id: 'bd-011', hospitalId: 'bh-004', name: '孙莉', title: '主任医师', dept: '妇产科', avatar: doctorFemale50, expertise: '不孕不育、子宫内膜异位症', fee: 100 },
  { id: 'bd-012', hospitalId: 'bh-004', name: '周大勇', title: '副主任医师', dept: '神经内科', avatar: doctorMale55, expertise: '脑血管疾病、癫痫、帕金森', fee: 50 },

  // 湘雅医院
  { id: 'bd-013', hospitalId: 'bh-005', name: '吴志远', title: '主任医师', dept: '肿瘤科', avatar: doctorMale55, expertise: '肺癌、胃癌、结直肠癌综合治疗', fee: 100 },
  { id: 'bd-014', hospitalId: 'bh-005', name: '郑秀英', title: '副主任医师', dept: '消化内科', avatar: doctorFemale42, expertise: '胃镜检查、炎症性肠病', fee: 50 },

  // 北京第六医院
  { id: 'bd-015', hospitalId: 'bh-006', name: '王明钦', title: '主治医师', dept: '心脏内科', avatar: doctorMale55, expertise: '冠心病介入治疗、心律失常、心力衰竭', fee: 30 },
  { id: 'bd-016', hospitalId: 'bh-006', name: '钱多多', title: '主治医师', dept: '内分泌科', avatar: doctorFemale35, expertise: '糖尿病、甲状腺疾病、骨质疏松', fee: 30 },

  // 中山眼科中心
  { id: 'bd-017', hospitalId: 'bh-007', name: '林晓峰', title: '主任医师', dept: '眼科', avatar: doctorMale45, expertise: '近视矫正、角膜病、干眼症', fee: 100 },
  { id: 'bd-018', hospitalId: 'bh-007', name: '黄美玲', title: '副主任医师', dept: '眼科', avatar: doctorFemale42, expertise: '小儿近视防控、斜弱视治疗', fee: 50 }
]

/* ========== 费用数据 ========== */
export const feeData = {
  regular: { label: '普通号', fee: 20, desc: '按到达顺序就诊，不限医生' },
  specialist: { label: '专家号', fee: null, desc: '指定专家医生，按预约时段就诊' }
}

/* ========== 生成未来 7 天日期 ========== */
export function generateDates() {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const list = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    list.push({
      date: `${d.getMonth() + 1}月${d.getDate()}日`,
      dateShort: `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[d.getDay()],
      weekdayRaw: weekdays[d.getDay()],
      full: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      day: d.getDate(),
      month: d.getMonth() + 1,
      isToday: i === 0
    })
  }
  return list
}

/* ========== 生成排班（上午/下午/晚间 + 号源剩余） ========== */
const slotTemplates = {
  morning: [
    { time: '08:00-08:30' },
    { time: '08:30-09:00' },
    { time: '09:00-09:30' },
    { time: '09:30-10:00' },
    { time: '10:00-10:30' },
    { time: '10:30-11:00' },
    { time: '11:00-11:30' }
  ],
  afternoon: [
    { time: '13:30-14:00' },
    { time: '14:00-14:30' },
    { time: '14:30-15:00' },
    { time: '15:00-15:30' },
    { time: '15:30-16:00' },
    { time: '16:00-16:30' },
    { time: '16:30-17:00' }
  ],
  evening: [
    { time: '17:30-18:00' },
    { time: '18:00-18:30' },
    { time: '18:30-19:00' },
    { time: '19:00-19:30' }
  ]
}

/**
 * 为某医生某天生成排班
 * @param {string} doctorId
 * @param {number} dateOffset 0~6
 * @returns {{ morning: [], afternoon: [], evening: [] }}
 */
export function generateSchedule(doctorId, dateOffset) {
  // 用 doctorId 哈希做伪随机种子，保证同一医生每天数据稳定
  const seed = doctorId.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const rng = (n) => {
    const x = Math.sin(seed * 1000 + n + dateOffset * 7) * 10000
    return x - Math.floor(x)
  }

  const buildPeriod = (periodKey, slotIdxBase) => {
    // 随机决定当天该时段是否排班（70%概率有号）
    if (rng(slotIdxBase) < 0.3) return []
    return slotTemplates[periodKey].map((s, i) => {
      const r = rng(slotIdxBase + i + 1)
      const total = 10 + Math.floor(rng(slotIdxBase + i + 50) * 10)
      const booked = Math.floor(r * total)
      const remaining = total - booked
      return {
        time: s.time,
        total,
        booked,
        remaining,
        status: remaining > 0 ? 'available' : 'full'
      }
    })
  }

  return {
    morning: buildPeriod('morning', 1),
    afternoon: buildPeriod('afternoon', 100),
    evening: buildPeriod('evening', 200)
  }
}

/* ========== 生成普通号排班（无指定医生） ========== */
export function generateRegularSchedule(hospitalId, dateOffset) {
  const seed = hospitalId.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const rng = (n) => {
    const x = Math.sin(seed * 2000 + n + dateOffset * 13) * 10000
    return x - Math.floor(x)
  }

  const buildPeriod = (periodKey, base) => {
    if (rng(base) < 0.15) return []
    return slotTemplates[periodKey].map((s, i) => {
      const r = rng(base + i + 1)
      const total = 20 + Math.floor(rng(base + i + 50) * 15)
      const booked = Math.floor(r * total)
      const remaining = total - booked
      return {
        time: s.time,
        total,
        booked,
        remaining,
        status: remaining > 0 ? 'available' : 'full'
      }
    })
  }

  return {
    morning: buildPeriod('morning', 1),
    afternoon: buildPeriod('afternoon', 100),
    evening: buildPeriod('evening', 200)
  }
}

/* ========== 查询某医院某科室的医生 ========== */
export function getDoctorsByHospitalDept(hospitalId, dept) {
  return bookingDoctors.filter((d) => d.hospitalId === hospitalId && d.dept === dept)
}

/* ========== 获取医院信息 ========== */
export function getHospitalById(id) {
  return bookingHospitals.find((h) => h.id === id) || null
}

/* ========== 获取医生信息 ========== */
export function getDoctorById(id) {
  return bookingDoctors.find((d) => d.id === id) || null
}

/* ========== 支付方式 ========== */
export const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: 'wechat', color: '#07c160', desc: '推荐使用' },
  { id: 'alipay', name: '支付宝', icon: 'alipay', color: '#1677ff', desc: '支付宝安全支付' },
  { id: 'insurance', name: '医保支付', icon: 'insurance', color: '#2dd4a8', desc: '医保电子凭证' }
]
