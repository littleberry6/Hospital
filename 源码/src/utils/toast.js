/**
 * 全局轻提示（Toast）
 * 用法：import { toast } from '@/utils/toast'; toast('已预约')
 * 由 App.vue 内的 <ToastHost /> 负责渲染，各页面直接调用即可。
 */
import { reactive } from 'vue'

const state = reactive({
  list: []
})

let seed = 0

export function toast(message, duration = 1800) {
  const id = ++seed
  state.list.push({ id, message })
  setTimeout(() => {
    const i = state.list.findIndex((t) => t.id === id)
    if (i > -1) state.list.splice(i, 1)
  }, duration)
  return id
}

export function useToastState() {
  return state
}
