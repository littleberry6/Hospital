import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

/* ========== rem 动态适配 ========== */
const DESIGN_WIDTH = 375 // 设计稿宽度
const MAX_WIDTH = 480 // 超过该宽度（平板/桌面）不再放大，保证布局可用
const ROOT_VALUE = 16 // 设计稿 root font-size
const MIN_FONT_SIZE = 15.5 // 小屏最低 root 字号，防止文字过小
const MAX_FONT_SIZE = 18.5 // 大屏最高 root 字号，防止过度放大

/**
 * 字体比例按设备大小进行非线性缩放：
 * - 375px 设备对应 16px 基准
 * - 小于 375px 采用较缓的指数曲线并限制最小字号
 * - 大于 375px 温和放大并限制最大字号
 * 让整体字体比例在各种手机上更协调。
 */
function setRootFontSize() {
  const w = window.innerWidth || document.documentElement.clientWidth || DESIGN_WIDTH
  const width = Math.min(w, MAX_WIDTH)
  const ratio = width / DESIGN_WIDTH
  const fontSize = Math.max(
    MIN_FONT_SIZE,
    Math.min(MAX_FONT_SIZE, ROOT_VALUE * Math.pow(ratio, 0.88))
  )
  document.documentElement.style.fontSize = fontSize.toFixed(2) + 'px'
}

setRootFontSize()

let resizeTimer = null
window.addEventListener(
  'resize',
  () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(setRootFontSize, 100)
  },
  { passive: true }
)
window.addEventListener(
  'orientationchange',
  () => setTimeout(setRootFontSize, 150),
  { passive: true }
)
/* ========== end rem 动态适配 ========== */

const app = createApp(App)
app.use(router)
app.mount('#app')
