/**
 * 消息页（/message）离线 Mock 数据
 * 顶部四宫格分类 + 我的问诊 + 私信
 * 全部为静态数据，无网络请求依赖
 */

// 顶部四宫格分类（点赞 / 评论 / 通知 / 问答）
// color 用于图标底色 + 主色高亮
export const categories = [
  {
    key: 'like',
    label: '点赞',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    // 大拇指 👍 SVG
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>`
  },
  {
    key: 'comment',
    label: '评论',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    // 笔 + 对话框
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/><path fill="currentColor" d="M3 6l-1 13 4-4h2v-2H4l-.5-7H3z" opacity=".35"/></svg>`
  },
  {
    key: 'notify',
    label: '通知',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.14)',
    // 铃铛
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`
  },
  {
    key: 'qa',
    label: '问答',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.14)',
    // 对话气泡 ×2
    svg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h2v3l4-3h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`
  }
]

// 我的问诊（医生回复）
export const myInquiries = [
  {
    id: 'i1',
    avatar: '/src/assets/avatars/doctor-male-30.png',
    name: '王钥钦',
    role: '心脏内科 主治医师',
    preview: '不用太担心，继续吃药，两次左右就会恢复的。',
    time: '刚刚',
    unread: 1
  },
  {
    id: 'i2',
    avatar: '/src/assets/avatars/doctor-female-35.png',
    name: '秦申',
    role: '儿科 主治医师',
    preview: '没有问题啦，谢谢医生！',
    time: '11月23日',
    unread: 0
  }
]

// 私信（用户间对话）
export const privateMessages = [
  {
    id: 'p1',
    avatar: '/src/assets/avatars/Professional_realistic_headsho_2026-08-20T12-47-10.png',
    name: '爱吃番薯',
    preview: '一样的症状，医生让我吃的来着。',
    time: '刚刚',
    unread: 2
  },
  {
    id: 'p2',
    avatar: '/src/assets/avatars/Professional_realistic_headsho_2026-08-20T12-47-11.png',
    name: 'O椰',
    preview: '及时预防确实很有必要。',
    time: '11月20日',
    unread: 0
  },
  {
    id: 'p3',
    avatar: '/src/assets/avatars/tmp5/Professional_realistic_headsho_2026-08-20T12-47-51.png',
    name: '等风来',
    preview: '没有问题，一起多交流吧。',
    time: '11月15日',
    unread: 0
  },
  {
    id: 'p4',
    avatar: '/src/assets/avatars/tmp7/Professional_realistic_headsho_2026-08-20T12-51-21.png',
    name: '少一点心柿',
    preview: '下次再聊！',
    time: '11月6日',
    unread: 0
  }
]