/**
 * 找医生 - 离线 Mock 数据
 * 完全本地、无网络依赖；图片头像复用 src/assets/avatars/。
 */

import doctorMale55 from '@/assets/avatars/doctor-male-55.png'
import doctorFemale35 from '@/assets/avatars/doctor-female-35.png'
import doctorMale45 from '@/assets/avatars/doctor-male-45.png'
import doctorFemale42 from '@/assets/avatars/doctor-female-42.png'

/**
 * 顶部搜索框 placeholder
 */
export const searchHint = '搜索医院 / 科室 / 医生'

/**
 * 两个 banner 大卡：名医馆 / 中医馆
 * key: 路由或埋点用
 * bg: 卡片底色
 * fg: 标题色
 * decor: 装饰 SVG（医生形象 / 中药包）的字符串，注入到 v-html
 * text: 副文案
 */
export const banners = [
  {
    id: 'mingyiguan',
    title: '名医馆',
    tag: 'HOT',
    text: '全国 3000+ 三甲名医在线',
    bg: 'linear-gradient(120deg, #e0f7ff 0%, #f0fbff 60%, #faffd9 100%)',
    fg: '#0f172a',
    tagFg: '#ffffff',
    tagBg: '#ff4d4f',
    decor: `
      <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="92" cy="74" rx="36" ry="6" fill="rgba(45,212,168,0.12)"/>
        <path d="M92 28c-12 0-22 9-22 21 0 9 5 17 13 22v9c0 1 .9 2 2 2h14c1.1 0 2-1 2-2v-9c8-5 13-13 13-22 0-12-10-21-22-21z" fill="#fff"/>
        <circle cx="92" cy="38" r="11" fill="#facc15"/>
        <path d="M84 38c0-5 3-9 8-9s8 4 8 9" fill="none" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
        <rect x="79" y="48" width="26" height="14" rx="3" fill="#2dd4a8"/>
        <path d="M79 51h26M79 58h26" stroke="#0f172a" stroke-width="1" opacity="0.4"/>
        <circle cx="86" cy="54.5" r="1.2" fill="#0f172a"/>
        <circle cx="98" cy="54.5" r="1.2" fill="#0f172a"/>
      </svg>
    `
  },
  {
    id: 'zhongyiguan',
    title: '中医馆',
    tag: 'HOT',
    text: '传承千年的健康智慧',
    bg: 'linear-gradient(120deg, #fff7ed 0%, #fef3c7 60%, #fefce8 100%)',
    fg: '#7c2d12',
    tagFg: '#ffffff',
    tagBg: '#ff4d4f',
    decor: `
      <svg viewBox="0 0 120 88" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="78" rx="40" ry="5" fill="rgba(180,83,9,0.12)"/>
        <rect x="38" y="22" width="44" height="46" rx="3" fill="#fff7ed" stroke="#b45309" stroke-width="1.4"/>
        <rect x="50" y="14" width="20" height="10" rx="2" fill="#b45309"/>
        <path d="M60 22v46" stroke="#b45309" stroke-width="1.4"/>
        <path d="M50 32h-6M76 32h-6M50 38h-6M76 38h-6M50 44h-6M76 44h-6" stroke="#b45309" stroke-width="1" opacity="0.6"/>
        <path d="M48 50c4 4 8 6 12 6s8-2 12-6" stroke="#b45309" stroke-width="1.4" fill="none"/>
        <circle cx="46" cy="60" r="1.2" fill="#b45309"/>
        <circle cx="74" cy="60" r="1.2" fill="#b45309"/>
      </svg>
    `
  }
]

/**
 * 热门医院 - 横向滚动
 * key / name / level(三甲) / type(综合/精神/...) / svg(医院实景插画)
 */
export const hotHospitals = [
  {
    id: 'bj-6',
    name: '北京大学第六医院',
    level: '三甲',
    type: '精神病院',
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="50" width="180" height="60" fill="#bae6fd"/>
      <rect x="20" y="40" width="160" height="70" fill="#fff"/>
      <rect x="20" y="40" width="160" height="14" fill="#0f172a"/>
      <g fill="#f8fafc">
        <rect x="30" y="62" width="14" height="14"/>
        <rect x="50" y="62" width="14" height="14"/>
        <rect x="70" y="62" width="14" height="14"/>
        <rect x="90" y="62" width="14" height="14"/>
        <rect x="110" y="62" width="14" height="14"/>
        <rect x="130" y="62" width="14" height="14"/>
        <rect x="150" y="62" width="14" height="14"/>
      </g>
      <g fill="#94a3b8">
        <rect x="30" y="84" width="14" height="14"/>
        <rect x="50" y="84" width="14" height="14"/>
        <rect x="70" y="84" width="14" height="14"/>
        <rect x="90" y="84" width="14" height="14"/>
        <rect x="110" y="84" width="14" height="14"/>
        <rect x="130" y="84" width="14" height="14"/>
        <rect x="150" y="84" width="14" height="14"/>
      </g>
      <rect x="92" y="98" width="16" height="12" fill="#b45309"/>
    </svg>`
  },
  {
    id: 'gdrm',
    name: '广东省人民医院',
    level: '三甲',
    type: '综合医院',
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="40" width="180" height="70" fill="#fecaca"/>
      <rect x="40" y="30" width="50" height="80" fill="#fff"/>
      <rect x="100" y="40" width="60" height="70" fill="#fff"/>
      <g fill="#94a3b8">
        <rect x="46" y="40" width="10" height="10"/>
        <rect x="60" y="40" width="10" height="10"/>
        <rect x="74" y="40" width="10" height="10"/>
        <rect x="46" y="56" width="10" height="10"/>
        <rect x="60" y="56" width="10" height="10"/>
        <rect x="74" y="56" width="10" height="10"/>
        <rect x="46" y="72" width="10" height="10"/>
        <rect x="60" y="72" width="10" height="10"/>
        <rect x="74" y="72" width="10" height="10"/>
        <rect x="46" y="88" width="10" height="10"/>
        <rect x="60" y="88" width="10" height="10"/>
        <rect x="74" y="88" width="10" height="10"/>
      </g>
      <g fill="#64748b">
        <rect x="106" y="46" width="10" height="10"/>
        <rect x="120" y="46" width="10" height="10"/>
        <rect x="134" y="46" width="10" height="10"/>
        <rect x="146" y="46" width="10" height="10"/>
        <rect x="106" y="60" width="10" height="10"/>
        <rect x="120" y="60" width="10" height="10"/>
        <rect x="134" y="60" width="10" height="10"/>
        <rect x="146" y="60" width="10" height="10"/>
        <rect x="106" y="74" width="10" height="10"/>
        <rect x="120" y="74" width="10" height="10"/>
        <rect x="134" y="74" width="10" height="10"/>
        <rect x="146" y="74" width="10" height="10"/>
        <rect x="106" y="88" width="10" height="10"/>
        <rect x="120" y="88" width="10" height="10"/>
        <rect x="134" y="88" width="10" height="10"/>
        <rect x="146" y="88" width="10" height="10"/>
      </g>
    </svg>`
  },
  {
    id: 'jsrm',
    name: '江苏省人民医院',
    level: '三甲',
    type: '综合医院',
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="#bae6fd"/>
      <polygon points="100,30 60,80 140,80" fill="#fff"/>
      <rect x="40" y="80" width="120" height="20" fill="#fff"/>
      <rect x="60" y="60" width="80" height="20" fill="#fff"/>
      <rect x="50" y="40" width="100" height="14" fill="#0f172a"/>
      <g fill="#94a3b8">
        <rect x="60" y="84" width="8" height="12"/>
        <rect x="76" y="84" width="8" height="12"/>
        <rect x="92" y="84" width="8" height="12"/>
        <rect x="108" y="84" width="8" height="12"/>
        <rect x="124" y="84" width="8" height="12"/>
      </g>
    </svg>`
  },
  {
    id: 'sh-xinhua',
    name: '上海新华医院',
    level: '三甲',
    type: '综合医院',
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="160" height="70" fill="#fff"/>
      <rect x="20" y="40" width="160" height="10" fill="#06b6d4"/>
      <g fill="#94a3b8">
        <rect x="32" y="58" width="12" height="12"/>
        <rect x="50" y="58" width="12" height="12"/>
        <rect x="68" y="58" width="12" height="12"/>
        <rect x="86" y="58" width="12" height="12"/>
        <rect x="104" y="58" width="12" height="12"/>
        <rect x="122" y="58" width="12" height="12"/>
        <rect x="140" y="58" width="12" height="12"/>
        <rect x="158" y="58" width="12" height="12"/>
      </g>
      <g fill="#cbd5e1">
        <rect x="32" y="76" width="12" height="12"/>
        <rect x="50" y="76" width="12" height="12"/>
        <rect x="68" y="76" width="12" height="12"/>
        <rect x="86" y="76" width="12" height="12"/>
        <rect x="104" y="76" width="12" height="12"/>
        <rect x="122" y="76" width="12" height="12"/>
        <rect x="140" y="76" width="12" height="12"/>
        <rect x="158" y="76" width="12" height="12"/>
      </g>
    </svg>`
  },
  {
    id: 'gz-zhongshan',
    name: '广州中山医院',
    level: '三甲',
    type: '综合医院',
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="#dbeafe"/>
      <rect x="50" y="30" width="100" height="80" fill="#fff"/>
      <rect x="50" y="30" width="100" height="14" fill="#1e40af"/>
      <g fill="#cbd5e1">
        <rect x="60" y="52" width="14" height="14"/>
        <rect x="80" y="52" width="14" height="14"/>
        <rect x="100" y="52" width="14" height="14"/>
        <rect x="120" y="52" width="14" height="14"/>
        <rect x="60" y="74" width="14" height="14"/>
        <rect x="80" y="74" width="14" height="14"/>
        <rect x="100" y="74" width="14" height="14"/>
        <rect x="120" y="74" width="14" height="14"/>
      </g>
    </svg>`
  }
]

/**
 * 热门科室 - 横向滚动 chips
 * key / name / svg（inline icon）/ color（主题色）
 */
export const hotDepartments = [
  { key: 'skin', name: '皮肤科', color: '#fb7185', svg: `<svg viewBox="0 0 32 32"><path d="M16 4c-6 0-10 4-10 9s4 11 10 15c6-4 10-10 10-15s-4-9-10-9z" fill="currentColor" opacity="0.18"/><circle cx="16" cy="14" r="6" fill="currentColor"/></svg>` },
  { key: 'resp', name: '呼吸内科', color: '#38bdf8', svg: `<svg viewBox="0 0 32 32"><path d="M8 12c0-2 2-4 5-4s5 2 5 4v3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M5 18c-2 6 4 10 11 10s13-4 11-10c-1-3-4-3-7-3H12c-3 0-6 0-7 3z" fill="currentColor" opacity="0.18"/><path d="M5 18c-2 6 4 10 11 10s13-4 11-10c-1-3-4-3-7-3H12c-3 0-6 0-7 3z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="13" cy="20" r="1.4" fill="currentColor"/><circle cx="19" cy="20" r="1.4" fill="currentColor"/></svg>` },
  { key: 'pediatrics', name: '儿科', color: '#fbbf24', svg: `<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="5" fill="currentColor"/><path d="M9 26c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="14" cy="10" r="1" fill="#fff"/><circle cx="18" cy="10" r="1" fill="#fff"/></svg>` },
  { key: 'stomatology', name: '口腔科', color: '#34d399', svg: `<svg viewBox="0 0 32 32"><path d="M10 9c0-3 3-5 6-5s6 2 6 5c0 5-3 8-3 13 0 3-1 6-3 6s-3-3-3-6c0-5-3-8-3-13z" fill="currentColor" opacity="0.18"/><path d="M10 9c0-3 3-5 6-5s6 2 6 5c0 5-3 8-3 13 0 3-1 6-3 6s-3-3-3-6c0-5-3-8-3-13z" stroke="currentColor" stroke-width="2" fill="none"/></svg>` },
  { key: 'gyn', name: '妇产科', color: '#f472b6', svg: `<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="5" fill="currentColor"/><path d="M16 18v9M12 23h8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M9 26c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/></svg>` },
  { key: 'oph', name: '眼科', color: '#60a5fa', svg: `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="11" ry="7" fill="currentColor" opacity="0.18"/><circle cx="16" cy="16" r="9" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="16" cy="16" r="3" fill="currentColor"/></svg>` },
  { key: 'gi', name: '消化内科', color: '#fb923c', svg: `<svg viewBox="0 0 32 32"><path d="M9 7c2-1 5-1 7 0s5 4 7 6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="9" cy="7" r="2.4" fill="currentColor"/><path d="M12 13c-2 3-2 6 0 8s4 4 7 4 6-2 6-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>` },
  { key: 'ent', name: '耳鼻喉科', color: '#a3e635', svg: `<svg viewBox="0 0 32 32"><path d="M10 6c-3 0-5 2-5 5v8c0 5 3 8 6 8 2 0 4-2 4-4v-3l3-2v-6c0-3-3-6-8-6z" fill="currentColor" opacity="0.18"/><path d="M10 6c-3 0-5 2-5 5v8c0 5 3 8 6 8 2 0 4-2 4-4v-3l3-2v-6c0-3-3-6-8-6z" stroke="currentColor" stroke-width="2" fill="none"/></svg>` },
  { key: 'cardio', name: '心脏内科', color: '#ef4444', svg: `<svg viewBox="0 0 32 32"><path d="M16 27S5 19 5 12a6 6 0 0111-3 6 6 0 0111 3c0 7-11 15-11 15z" fill="currentColor" opacity="0.18"/><path d="M16 27S5 19 5 12a6 6 0 0111-3 6 6 0 0111 3c0 7-11 15-11 15z" stroke="currentColor" stroke-width="2" fill="none"/></svg>` },
  { key: 'infect', name: '传染科', color: '#22d3ee', svg: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7 7l2 2M23 23l2 2M7 25l2-2M23 9l2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` }
]

/**
 * 热门医生 - 3 列 grid
 * avatar / name / hospital / department / score / years / id
 */
import doctorMale30 from '@/assets/avatars/doctor-male-30.png'

export const hotDoctors = [
  {
    id: 'wang-mingqin',
    avatar: doctorMale55,
    name: '王明钦',
    hospital: '北京大学第六医院',
    department: '心脏内科',
    score: 4.7,
    years: 5
  },
  {
    id: 'qin-ran',
    avatar: doctorFemale35,
    name: '秦冉',
    hospital: '广东省人民医院',
    department: '儿科主治医生',
    score: 4.8,
    years: 5
  },
  {
    id: 'tan-shijiang',
    avatar: doctorMale45,
    name: '覃识江',
    hospital: '江苏省人民医院',
    department: '耳鼻喉科 主治医师',
    score: 4.8,
    years: 10
  },
  {
    id: 'yao-pei',
    avatar: doctorFemale42,
    name: '姚佩佩',
    hospital: '上海新华医院',
    department: '皮肤科 主治医师',
    score: 4.9,
    years: 8
  },
  {
    id: 'liu-jianhua',
    avatar: doctorMale30,
    name: '刘建华',
    hospital: '广州中山医院',
    department: '消化内科 副主任',
    score: 4.6,
    years: 12
  },
  {
    id: 'yang-xiulan',
    avatar: doctorFemale42,
    name: '杨秀兰',
    hospital: '中山大学附属第一医院',
    department: '妇产科 主任医师',
    score: 4.9,
    years: 15
  }
]
