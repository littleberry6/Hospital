/**
 * 发现页（/discover）离线 Mock 数据
 * 内部子 tab + 热门话题 + 热门圈子
 * 全部为静态数据，无网络请求依赖
 */

// 内部子 tab（关注 / 发现 / 医生说）
export const subTabs = [
  { key: 'follow', label: '关注' },
  { key: 'discover', label: '发现' },
  { key: 'doctor', label: '医生说' }
]

// 热门话题（5 条），hot=true 表示展示右上角红色"热"标签
export const hotTopics = [
  { id: 't1', rank: 1, title: '怎样区分流感与支原体感染？', hot: true },
  { id: 't2', rank: 2, title: '为什么能明显感觉到心脏在跳动？', hot: true },
  { id: 't3', rank: 3, title: '经常吃素，却得了高血脂？', hot: true },
  { id: 't4', rank: 4, title: '心律失常可以坐飞机吗？', hot: false },
  { id: 't5', rank: 5, title: '臭豆腐串串不能乱吃？', hot: false }
]

// 热门圈子（2 列 × 3 行 = 6 张卡）
// heat 单位：万+；splash 用作卡顶彩色色块（与首页 quick-cards 风格一致）
export const hotCircles = [
  { id: 'c1', title: '饮食习惯的时与错', heat: '4.2万+', color: '#2dd4a8' },
  { id: 'c2', title: '经常失眠睡不着', heat: '3.6万+', color: '#34d399' },
  { id: 'c3', title: '怎样有效减肥', heat: '3.2万+', color: '#10b981' },
  { id: 'c4', title: '手足口病如何防治', heat: '2.7万+', color: '#2dd4a8' },
  { id: 'c5', title: '疫苗的正确接种', heat: '2.1万+', color: '#34d399' },
  { id: 'c6', title: '多样维生素补充', heat: '1.8万+', color: '#10b981' }
]

// 关注 tab 数据占位（与"发现"区分，复用同一个渲染器即可）
export const followCircles = [
  { id: 'f1', title: '高血压日常管理', heat: '8888+', color: '#2dd4a8' },
  { id: 'f2', title: '糖尿病饮食', heat: '7234+', color: '#34d399' }
]

// 医生说 tab（展示精选医生观点，复用医生卡 + 圆形头像）
export const doctorTalks = [
  { id: 'd1', avatar: '/avatars/doctor-1.png', name: '王明华', title: '心内科 · 主任医师', content: '高血压患者冬季晨起建议先在床上活动 3 分钟再起身，避免体位性低血压。', like: 235, time: '2小时前' },
  { id: 'd2', avatar: '/avatars/doctor-2.png', name: '李静', title: '营养科 · 副主任医师', content: '控糖不是完全戒糖，聪明地选择低 GI 食物和分餐，比单纯不吃更有效。', like: 412, time: '4小时前' },
  { id: 'd3', avatar: '/avatars/doctor-3.png', name: '张伟', title: '骨科 · 主治医师', content: '每天靠墙站立 5 分钟，比跑步 1 小时对改善体态更有效。', like: 198, time: '昨天' }
]
