'use strict'

/**
 * 本地 PostCSS 插件：px -> rem
 * 设计稿 375px，rootValue 16
 * 搭配 main.js 中的动态 root font-size 实现多设备自适应
 */
const defaults = {
  rootValue: 16,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: [],
  minPixelValue: 2,
  mediaQuery: false
}

// 跳过字符串、url() 中的 px，仅匹配数值部分
const pxRegex = /"[^"]+"|'[^']+'|url\([^)]+\)|(\b-?\d*\.?\d+)px/g

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

function createPx2rem(options) {
  const opts = { ...defaults, ...options }

  function satisfyPropList(property) {
    if (opts.propList.indexOf('*') !== -1) return true
    return opts.propList.some((prop) => property.indexOf(prop) !== -1)
  }

  function isBlacklisted(selector) {
    return opts.selectorBlackList.some((rule) => {
      if (typeof rule === 'string') return selector.indexOf(rule) !== -1
      return selector.match(rule)
    })
  }

  return {
    postcssPlugin: 'postcss-px2rem',
    Declaration(decl) {
      if (decl.value.indexOf('px') === -1) return
      if (!satisfyPropList(decl.prop)) return
      if (!opts.mediaQuery && decl.parent && decl.parent.type === 'atrule') return

      const selector = decl.parent && decl.parent.selector ? decl.parent.selector : ''
      if (isBlacklisted(selector)) return

      decl.value = decl.value.replace(pxRegex, (m, p1) => {
        if (!p1) return m
        const pixels = parseFloat(p1)
        if (Math.abs(pixels) < opts.minPixelValue) return m
        const remVal = toFixed(pixels / opts.rootValue, opts.unitPrecision)
        return remVal + 'rem'
      })
    }
  }
}

module.exports = createPx2rem
module.exports.postcss = true
