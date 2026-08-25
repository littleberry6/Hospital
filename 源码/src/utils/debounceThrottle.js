/**
 * 防抖：事件触发后 wait 毫秒内不再触发才执行
 * 适用于：搜索输入、窗口 resize 等
 */
export function debounce(fn, wait = 300, immediate = false) {
  let timer = null
  return function (...args) {
    const callNow = immediate && !timer
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }, wait)
    if (callNow) fn.apply(this, args)
  }
}

/**
 * 节流：在 wait 毫秒内最多执行一次
 * 适用于：滚动加载、touchmove 等高频事件
 */
export function throttle(fn, wait = 200) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * requestAnimationFrame 节流，适用于动画相关高频回调
 */
export function rafThrottle(fn) {
  let ticking = false
  return function (...args) {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      fn.apply(this, args)
    })
  }
}
