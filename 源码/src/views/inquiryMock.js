/**
 * 专家问诊 - 离线 Mock 数据
 * 完全本地、无网络依赖，开箱即用。
 * 数据基于图片示例（张先健/王旗令/于邓宪等）的结构组织，
 * 图片头像来源于 src/assets/avatars/，复用项目既有资源。
 */

import avatarMale45 from '@/assets/avatars/doctor-male-45.png'
import avatarFemale35 from '@/assets/avatars/doctor-female-35.png'
import avatarMale55 from '@/assets/avatars/doctor-male-55.png'
import avatarFemale50 from '@/assets/avatars/doctor-female-50.png'
import avatarMale30 from '@/assets/avatars/doctor-male-30.png'
import avatarFemale42 from '@/assets/avatars/doctor-female-42.png'

/**
 * 横向滚动的科室分类
 * key: 唯一键（同时用于路由/筛选）
 * name: 中文名
 * color: 选中态主色
 * svg: 内联 SVG（24x24 viewBox）
 */
export const departments = [
  {
    key: 'pediatrics',
    name: '儿科',
    color: '#fbbf24',
    svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="20" r="8" fill="currentColor"/><path d="M12 42c0-8 5-14 12-14s12 6 12 14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    key: 'stomatology',
    name: '口腔科',
    color: '#2dd4a8',
    svg: `<svg viewBox="0 0 48 48"><path d="M16 14c0-4 4-6 8-6s8 2 8 6c0 6-4 10-4 16 0 4-2 8-4 8s-4-4-4-8c0-6-4-10-4-16z" fill="currentColor"/></svg>`
  },
  {
    key: 'gynecology',
    name: '妇产科',
    color: '#f472b6',
    svg: `<svg viewBox="0 0 48 48"><circle cx="24" cy="18" r="8" fill="currentColor"/><path d="M24 28v14M18 38h12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    key: 'dermatology',
    name: '皮肤科',
    color: '#2dd4a8',
    svg: `<svg viewBox="0 0 48 48"><path d="M24 8c-8 8-8 20 0 28M24 8c8 8 8 20 0 28" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="currentColor"/></svg>`
  },
  {
    key: 'respiratory',
    name: '呼吸内科',
    color: '#60a5fa',
    svg: `<svg viewBox="0 0 48 48"><path d="M28 6c8 4 10 14 4 20-4 4-8 4-8 10M20 6c-8 4-10 14-4 20 4 4 8 4 8 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    key: 'ophthalmology',
    name: '眼科',
    color: '#38bdf8',
    svg: `<svg viewBox="0 0 48 48"><path d="M8 24c8-10 24-10 32 0-8 10-24 10-32 0z" stroke="currentColor" stroke-width="3" fill="none"/><circle cx="24" cy="24" r="6" fill="currentColor"/></svg>`
  },
  {
    key: 'ent',
    name: '耳鼻喉科',
    color: '#34d399',
    svg: `<svg viewBox="0 0 48 48"><path d="M24 8v28M18 14c-6 0-10 6-6 12M30 14c6 0 10 6 6 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  },
  {
    key: 'cardiology',
    name: '心脏内科',
    color: '#f87171',
    svg: `<svg viewBox="0 0 48 48"><path d="M24 42s-16-10-16-20c0-6 4-10 10-10 4 0 6 2 6 2s2-2 6-2c6 0 10 4 10 10 0 10-16 20-16 20z" fill="currentColor"/></svg>`
  }
]

/**
 * 医生头像本地资源池（与首页共享）
 */
const localAvatars = [
  avatarMale45,
  avatarFemale35,
  avatarMale55,
  avatarFemale50,
  avatarMale30,
  avatarFemale42
]

/**
 * 生成医生列表
 * @param {number} count - 生成数量
 * @param {string} deptKey - 科室 key（默认全部）
 */
export function generateDoctors(count = 12, deptKey = '') {
  const names = [
    '张先健', '王旗令', '于邓宪', '张捷丽', '李思远', '秦冉',
    '陈雨桐', '刘浩然', '赵静怡', '吴若兰', '郑子轩', '黄嘉怡'
  ]
  const hospitals = [
    '北京大学第六医院', '广东省人民医院', '广州医科大学附属第一医院',
    '北京协和医院', '上海华山医院', '四川大学华西医院',
    '中山大学附属第一医院', '武汉同济医院', '江苏省人民医院'
  ]
  const skills = [
    '牙髓炎、口腔溃疡、牙周炎、龋齿、牙龈炎、口腔扁平苔藓、口臭、牙疼、蛀牙、智齿',
    '口腔溃疡、牙周炎、牙髓炎、龋齿、智齿、口腔扁平苔藓、根管治疗、牙体缺损修复',
    '种植牙、复杂牙拔除、牙颌面畸形矫正、牙齿美白、根管治疗、口腔修复',
    '小儿肺炎、哮喘、发热、腹泻、新生儿疾病、儿童保健、过敏性疾病、喂养指导',
    '妇科炎症、月经不调、子宫肌瘤、卵巢囊肿、宫颈疾病、盆底康复、不孕不育',
    '皮肤病、湿疹、荨麻疹、银屑病、带状疱疹、痤疮、脱发、性传播疾病'
  ]
  const titles = ['主治医师', '副主任医师', '主任医师']
  const levels = ['三甲', '三甲', '三甲', '三乙', '三甲']

  return Array.from({ length: count }, (_, i) => {
    const age = 30 + ((i * 3) % 26) // 30 ~ 55
    const years = 5 + ((i * 2) % 16) // 5 ~ 20
    // 评分保持稳定：4.5 ~ 5.0 区间一位小数
    const score = (4.5 + (i % 6) * 0.1).toFixed(1)
    // 与科室粗糙对应（仅作示例数据）
    const deptIdx = i % departments.length
    const dept = departments[deptIdx]
    const filteredDeptKey = deptKey && deptKey !== dept.key ? departments[(deptIdx + 1) % departments.length].key : dept.key

    return {
      id: `doc_${filteredDeptKey}_${i}_${Date.now()}`,
      name: names[i % names.length],
      deptKey: filteredDeptKey,
      deptName: departments.find((d) => d.key === filteredDeptKey)?.name || '口腔科',
      title: titles[i % titles.length],
      hospital: hospitals[i % hospitals.length],
      level: levels[i % levels.length],
      skill: skills[i % skills.length],
      score,
      age,
      years,
      avatar: localAvatars[i % localAvatars.length]
    }
  })
}

/**
 * 默认导出：内置一组与图片同款的 5 位医生（保证首屏呈现与设计稿一致）
 */
export const defaultDoctors = generateDoctors(20)
