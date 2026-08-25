<template>
  <div class="page patients">
    <!-- 导航栏 -->
    <header class="patients__nav">
      <button class="patients__back" type="button" @click="goBack">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 7l-5 5 5 5V7z"/></svg>
      </button>
      <span class="patients__nav-title">就诊人管理</span>
      <button class="patients__add-btn" type="button" @click="goAdd">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
      </button>
    </header>

    <div class="patients__scroll scroll-y">
      <!-- 空状态 -->
      <div v-if="patients.length === 0" class="patients__empty">
        <svg viewBox="0 0 64 64" class="patients__empty-icon">
          <circle cx="32" cy="24" r="14" fill="none" stroke="#d1d5db" stroke-width="2" />
          <path d="M10 60c0-12 10-20 22-20s22 8 22 20" fill="none" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
        </svg>
        <p class="patients__empty-text">还没有就诊人</p>
        <button class="patients__empty-btn" type="button" @click="goAdd">+ 添加就诊人</button>
      </div>

      <!-- 就诊人列表 -->
      <ul v-else class="patients__list">
        <SwipeItem
          v-for="p in patients"
          :key="p.id"
          @remove="onDelete(p)"
        >
          <div class="patient-card" @click="goEdit(p.id)">
            <div class="patient-card__avatar" :class="'patient-card__avatar--' + p.type">
              {{ p.name.charAt(0) }}
            </div>
            <div class="patient-card__main">
              <div class="patient-card__head">
                <span class="patient-card__name">{{ p.name }}</span>
                <span class="patient-card__type" :class="'patient-card__type--' + p.type">{{ typeLabel(p.type) }}</span>
                <span v-if="p.isDefault" class="patient-card__default">默认</span>
              </div>
              <p class="patient-card__id">{{ maskIdCard(p.idCard) }}</p>
              <div class="patient-card__meta">
                <span class="patient-card__phone">{{ maskPhone(p.phone) }}</span>
                <span v-if="p.relationship" class="patient-card__sep">·</span>
                <span v-if="p.relationship" class="patient-card__rel">{{ p.relationship }}</span>
              </div>
            </div>
            <button class="patient-card__edit" type="button" @click.stop="goEdit(p.id)">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
          </div>
        </SwipeItem>
      </ul>

      <!-- 底部添加按钮 -->
      <button v-if="patients.length > 0" class="patients__add-bottom" type="button" @click="goAdd">
        <svg viewBox="0 0 24 24" class="patients__add-icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
        添加就诊人
      </button>

      <div class="patients__safe-space"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SwipeItem from '@/components/SwipeItem.vue'
import { toast } from '@/utils/toast'
import { getPatients, deletePatient, setDefault, ensureSeed } from '@/utils/patientStore'

const router = useRouter()
const patients = ref([])

function loadPatients() {
  ensureSeed()
  patients.value = getPatients()
}

onMounted(loadPatients)
onActivated(loadPatients)

function goBack() { router.back() }

function goAdd() { router.push('/patient/edit') }

function goEdit(id) { router.push('/patient/edit?id=' + id) }

function onDelete(p) {
  if (p.isDefault && patients.value.length > 1) {
    toast('已切换默认就诊人')
  }
  deletePatient(p.id)
  loadPatients()
  toast('已删除就诊人「' + p.name + '」')
}

function typeLabel(type) {
  const map = { self: '本人', child: '儿童', elderly: '老人', other: '其他' }
  return map[type] || '其他'
}

function maskIdCard(id) {
  if (!id || id.length < 6) return id || ''
  return id.slice(0, 4) + '********' + id.slice(-2)
}

function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone || ''
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}
</script>

<style scoped>
.patients {
  background: var(--bg);
  min-height: 100vh;
}

.patients__nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(44px + var(--safe-top));
  padding-top: var(--safe-top);
  background: linear-gradient(135deg, #2dd4a8 0%, #4adebf 100%);
  color: #fff;
}

.patients__back {
  position: absolute;
  left: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patients__back svg { width: 20px; height: 20px; }

.patients__nav-title {
  font-size: 17px;
  font-weight: 600;
}

.patients__add-btn {
  position: absolute;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.patients__add-btn svg { width: 20px; height: 20px; }

.patients__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
}

/* ========== 空状态 ========== */
.patients__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 0 40px;
}

.patients__empty-icon { width: 72px; height: 72px; }

.patients__empty-text {
  font-size: 14px;
  color: var(--text-sub);
}

.patients__empty-btn {
  padding: 8px 20px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  box-shadow: 0 3px 12px rgba(45, 212, 168, 0.3);
}

.patients__empty-btn:active { transform: scale(0.95); }

/* ========== 列表 ========== */
.patients__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.patient-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--shadow);
  transition: transform 0.15s;
}

.patient-card:active { transform: scale(0.98); }

.patient-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.patient-card__avatar--self { background: linear-gradient(135deg, #2dd4a8, #14b8a6); }
.patient-card__avatar--child { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.patient-card__avatar--elderly { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.patient-card__avatar--other { background: linear-gradient(135deg, #a855f7, #7c3aed); }

.patient-card__main { flex: 1; min-width: 0; }

.patient-card__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.patient-card__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.patient-card__type {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 6px;
  font-weight: 600;
}

.patient-card__type--self { background: #e6faf4; color: #0e9f7c; }
.patient-card__type--child { background: #eff6ff; color: #2563eb; }
.patient-card__type--elderly { background: #fffbeb; color: #d97706; }
.patient-card__type--other { background: #f5f3ff; color: #7c3aed; }

.patient-card__default {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 6px;
  background: #fef2f2;
  color: #ef4444;
  font-weight: 600;
}

.patient-card__id {
  font-size: 12px;
  color: var(--text-sub);
  margin-bottom: 2px;
}

.patient-card__meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-light);
}

.patient-card__sep { color: #d1d5db; }

.patient-card__edit {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.patient-card__edit:active { background: var(--primary-light); color: var(--primary); }

.patient-card__edit svg { width: 18px; height: 18px; }

/* ========== 底部添加 ========== */
.patients__add-bottom {
  margin: 16px 0 4px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--primary);
  background: #fff;
  border: 1.5px dashed var(--primary);
  box-shadow: var(--shadow);
  transition: transform 0.15s;
}

.patients__add-bottom:active { transform: scale(0.97); }

.patients__add-icon { width: 20px; height: 20px; }

.patients__safe-space { height: 20px; }
</style>
