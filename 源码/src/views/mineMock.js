// 我的页离线 mock 数据
// 头像用纯 SVG 实现，不需要外部图片资源
// 主题色：薄荷绿 #2dd4a8 — 所有入口图标统一描线风格

export const PRIMARY = '#2dd4a8'
export const PRIMARY_BG = '#e6faf4'

// 用户档案
export const userProfile = {
  nickname: '失眠数羊',
  emoji: '🐑',
  id: '1533268',
  signature: '一只羊，两只羊，三只羊，四只羊……',
  avatarSeed: 'MS',
  avatarBg: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)'
}

// 顶部三宫格统计
export const stats = [
  { id: 'follow', label: '关注', count: 23, to: '/find' },
  { id: 'footprint', label: '足迹', count: 176, to: '/archive' },
  { id: 'favorite', label: '收藏', count: 45, to: '/find' }
]

// 我的问诊 4 列入口（统一薄荷绿描线风格，count 为角标数量）
export const inquiryEntries = [
  {
    id: 'pending-pay',
    label: '待支付',
    count: 2,
    icon: 'wallet'
  },
  {
    id: 'in-progress',
    label: '问诊中',
    count: 1,
    icon: 'chat-active'
  },
  {
    id: 'pending-review',
    label: '待评价',
    count: 3,
    icon: 'edit'
  },
  {
    id: 'prescription',
    label: '处方药',
    icon: 'pill'
  }
]

// 药品订单 4 列入口
export const orderEntries = [
  {
    id: 'wait-pay',
    label: '待付款',
    count: 1,
    icon: 'wallet'
  },
  {
    id: 'wait-ship',
    label: '待发货',
    count: 2,
    icon: 'box'
  },
  {
    id: 'wait-receive',
    label: '待收货',
    count: 1,
    icon: 'truck'
  },
  {
    id: 'refund',
    label: '退款/售后',
    count: 1,
    icon: 'refund'
  }
]

// 最新待付款药品订单（展示在「我的预约」卡下方）
export const pendingOrder = {
  id: 'order-20260821-001',
  drug: '布洛芬缓释胶囊',
  spec: '0.3g×20粒 × 2盒',
  amount: 56.8,
  orderNo: 'DD20260821571236',
  status: '待付款',
  statusColor: '#fb923c',
  statusBg: '#fff7ed'
}

// 常用服务（6 个 2 行布局，与设计图一致）
export const serviceEntries = [
  { id: 'booking', label: '预约表单', icon: 'calendar' },
  { id: 'archive', label: '健康档案', icon: 'folder' },
  { id: 'vaccine', label: '疫苗订单', icon: 'vaccine' },
  { id: 'records', label: '问诊记录', icon: 'search' },
  { id: 'online-cs', label: '在线客服', icon: 'headset' },
  { id: 'settings', label: '设置', icon: 'cog' }
]

// 最近问诊时间线（演示左滑删除功能）
export const recentRecords = [
  {
    id: 'rec-1',
    dept: '心脏内科',
    doctor: '王明钦 主治医师',
    hospital: '北京协和医院',
    time: '今天 14:30',
    status: '问诊中',
    statusColor: '#2dd4a8',
    statusBg: '#e6faf4'
  },
  {
    id: 'rec-2',
    dept: '儿科',
    doctor: '秦申 主治医师',
    hospital: '北京儿童医院',
    time: '昨天 09:15',
    status: '待评价',
    statusColor: '#60a5fa',
    statusBg: '#eff6ff'
  },
  {
    id: 'rec-3',
    dept: '口腔科',
    doctor: '覃识江 副主任医师',
    hospital: '北京大学口腔医院',
    time: '11月15日',
    status: '已完成',
    statusColor: '#9ca3af',
    statusBg: '#f3f4f6'
  }
]