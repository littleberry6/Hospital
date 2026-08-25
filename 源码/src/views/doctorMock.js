/**
 * 医生主页 - 离线 Mock 数据
 * 完全本地、无网络依赖；图片头像复用 src/assets/avatars/。
 */

import doctorMale55 from '@/assets/avatars/doctor-male-55.png'

/**
 * 颜色配置 - 对应 6 个 chips 与关注按钮
 */
export const doctorProfile = {
  id: 'wang-mingqin',
  name: '王明钦',
  title: '主治医师',
  avatar: doctorMale55,
  online: true,
  followed: false,
  hospital: '北京市第六医院',
  department: '心脏内科',
  hospitalTag: '三甲',
  consultations: '2800+',
  satisfaction: '98%',
  /** 擅长文本（支持多行） */
  expertise:
    '擅长冠心病介入治疗及心脏起搏器治疗，不稳定性心绞痛、心律失常、心力衰竭、急性心肌炎等...',
  /** 热度咨询 */
  hotCount: 1685,
  /** 医生工作电话（H5 端通过 tel: 唤起系统拨号界面） */
  phone: '010-58601234',
  /** 6 个 chips：key / 名称 / 卡片配色 */
  tags: [
    { key: 'coronary', name: '冠心病', bg: '#fde2e2', fg: '#b91c1c' },
    { key: 'angina', name: '心绞痛', bg: '#f3e8ff', fg: '#7e22ce' },
    { key: 'arrhythmia', name: '心律失常', bg: '#dcfce7', fg: '#15803d' },
    { key: 'palpitation', name: '心悸', bg: '#e0f2fe', fg: '#0369a1' },
    { key: 'congenital', name: '先天性心脏病', bg: '#fef3c7', fg: '#a16207' },
    { key: 'heart-failure', name: '心功能不全', bg: '#ffe4e6', fg: '#be123c' }
  ]
}

/**
 * 真实患者评价 - 默认 6 条；可左滑删除
 */
export const doctorReviews = [
  {
    id: 'r1',
    name: '先**如',
    time: '11-05',
    content:
      '之前去医院挂号和检查花了很多钱也没有解决问题，在线问了一下王医生，描述了症状，这才知道病因，医生讲解的也很详细，非常通俗易懂，也很有耐心，真的很感谢王医生，谢谢！'
  },
  {
    id: 'r2',
    name: '快**乐',
    time: '11-16',
    content:
      '之前去医院挂号和检查花了很多钱也没有解决问题，在线问了一下王医生，描述了症状，这才知道病因，医生讲解的也很详细，非常通俗易懂，也很有耐心，真的很感谢王医生，谢谢！'
  },
  {
    id: 'r3',
    name: '晓**明',
    time: '10-28',
    content:
      '心悸问题困扰我两个多月了，王医生说我的情况不算严重，开了点药并指导了日常饮食，目前已经好多了，很感激。'
  },
  {
    id: 'r4',
    name: '温**柔',
    time: '10-22',
    content:
      '医生很有耐心，给的方案也很清晰，药物和注意事项都讲得很明白，复诊时症状改善明显，给五星好评。'
  },
  {
    id: 'r5',
    name: '林**下',
    time: '10-15',
    content:
      '父亲心律不齐多年，王医生远程看完报告后给出精准判断，调整了用药方案，老人状态稳定多了，感谢。'
  },
  {
    id: 'r6',
    name: '夏**至',
    time: '10-09',
    content:
      '听朋友说王医生看冠心病很专业，特意来请教，解答细致、不绕弯，给的建议也很实用，值得推荐。'
  }
]
