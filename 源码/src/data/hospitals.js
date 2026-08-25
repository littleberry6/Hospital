/**
 * 医院数据生成器
 * 基于 regions 数据，为每个城市的每个区县自动生成 1-3 家医院
 * 每家医院包含：名称、所在省市县、等级、距离市中心、评分、是否医保定点等
 */

import { regions } from './regions'

// 医院名称模板（按级别分类）
const hospitalNameTemplates = {
  '3A': [
    '人民医院', '中心医院', '附属医院', '第一医院', '第二医院',
    '大学附属医院', '中医院', '妇幼保健院'
  ],
  '3B': [
    '第二人民医院', '中西医结合医院', '区中心医院', '专科医院'
  ],
  '2A': [
    '区医院', '县人民医院', '职工医院', '第二医院', '街道社区卫生服务中心'
  ],
  '2B': [
    '社区医院', '街道卫生服务中心', '镇卫生院'
  ]
}

// 等级分布权重（总数 100）：3A 占 35%，3B 占 25%，2A 占 25%，2B 占 15%
const levelWeights = [
  { key: '3A', weight: 35 },
  { key: '3B', weight: 25 },
  { key: '2A', weight: 25 },
  { key: '2B', weight: 15 }
]

function pickLevel() {
  let r = Math.random() * 100
  for (const lw of levelWeights) {
    r -= lw.weight
    if (r <= 0) return lw.key
  }
  return '3A'
}

function pickName(city, county, level) {
  const list = hospitalNameTemplates[level]
  const template = list[Math.floor(Math.random() * list.length)]
  // 优先使用 city 名，若无则用 county
  const prefix = city && city !== county ? `${city}` : ''
  return prefix + template
}

function genRating(level) {
  // 三甲评分较高；二甲稍低
  const base = level.startsWith('3') ? 4.3 : 4.0
  return +(base + Math.random() * 0.7).toFixed(1)
}

function genDistance() {
  // 距离中心 km
  return +(0.5 + Math.random() * 15).toFixed(1)
}

/**
 * 生成所有医院
 * 为每个省的每个城市的每个区县生成 1-3 家医院
 * @returns {Array<{name,province,city,county,level,distance,rating,insurance,isFeatured}>}
 */
export function generateHospitals() {
  const list = []
  regions.forEach((prov) => {
    prov.cities.forEach((city) => {
      city.counties.forEach((county, ci) => {
        // 每个区县 1-3 家医院（主要城市多一些）
        const isMajor = city.counties.length >= 5
        const count = isMajor
          ? (Math.random() < 0.3 ? 3 : (Math.random() < 0.6 ? 2 : 1))
          : (Math.random() < 0.5 ? 2 : 1)

        for (let i = 0; i < count; i++) {
          const level = pickLevel()
          list.push({
            id: `h_${list.length}_${Date.now()}_${i}`,
            name: pickName(city.name, county, level),
            province: prov.name,
            city: city.name,
            county,
            level,
            levelLabel: getLevelLabel(level),
            distance: genDistance(),
            rating: genRating(level),
            insurance: Math.random() > 0.15, // 85% 医保定点
            isFeatured: i === 0 && level === '3A' && ci < 3
          })
        }
      })
    })
  })
  return list
}

export function getLevelLabel(key) {
  return ({ '3A': '三甲', '3B': '三乙', '2A': '二甲', '2B': '二乙' })[key] || '其他'
}

/**
 * 按 city+county 筛选医院
 */
export function filterHospitals(hospitals, { city, county } = {}) {
  let list = hospitals
  if (city) list = list.filter((h) => h.city === city)
  if (county) list = list.filter((h) => h.county === county)
  return list
}

export function getHospitalsByRegion(hospitals, province, city, county) {
  let list = hospitals
  if (province) list = list.filter((h) => h.province === province)
  if (city) list = list.filter((h) => h.city === city)
  if (county) list = list.filter((h) => h.county === county)
  return list
}