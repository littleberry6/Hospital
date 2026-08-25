<template>
  <div class="page pedit">
    <!-- 导航栏 -->
    <header class="pedit__nav">
      <button class="pedit__back" type="button" @click="goBack">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M14 7l-5 5 5 5V7z"/></svg>
      </button>
      <span class="pedit__nav-title">{{ isEdit ? '编辑就诊人' : '添加就诊人' }}</span>
    </header>

    <div class="pedit__scroll scroll-y">
      <!-- 与就诊人关系 -->
      <section class="pedit__section">
        <h3 class="pedit__section-title">与就诊人关系</h3>
        <div class="pedit__chips">
          <button
            v-for="r in relationships"
            :key="r.value"
            class="pedit__chip"
            :class="{ 'pedit__chip--active': form.relationship === r.value }"
            type="button"
            @click="pickRelation(r)"
          >{{ r.label }}</button>
        </div>
      </section>

      <!-- 基本信息 -->
      <section class="pedit__section">
        <h3 class="pedit__section-title">基本信息</h3>
        <div class="pedit__form">
          <div class="pedit__row">
            <label class="pedit__label">姓名</label>
            <input v-model.trim="form.name" class="pedit__input" placeholder="请输入真实姓名" />
          </div>
          <div class="pedit__row">
            <label class="pedit__label">性别</label>
            <div class="pedit__radio-group">
              <label class="pedit__radio" :class="{ 'pedit__radio--on': form.gender === 'male' }">
                <input v-model="form.gender" type="radio" value="male" class="pedit__radio-input" />
                男
              </label>
              <label class="pedit__radio" :class="{ 'pedit__radio--on': form.gender === 'female' }">
                <input v-model="form.gender" type="radio" value="female" class="pedit__radio-input" />
                女
              </label>
            </div>
          </div>
          <div class="pedit__row">
            <label class="pedit__label">出生日期</label>
            <input v-model="form.birthDate" type="date" class="pedit__input" />
          </div>
        </div>
      </section>

      <!-- 证件信息 -->
      <section class="pedit__section">
        <h3 class="pedit__section-title">证件信息</h3>
        <div class="pedit__form">
          <div class="pedit__row">
            <label class="pedit__label">身份证号</label>
            <input v-model.trim="form.idCard" class="pedit__input" placeholder="18位身份证号" maxlength="18" />
          </div>
          <div class="pedit__row">
            <label class="pedit__label">手机号</label>
            <input v-model.trim="form.phone" type="tel" class="pedit__input" placeholder="11位手机号" maxlength="11" @input="onPhoneInput" />
          </div>
        </div>
      </section>

      <!-- 就诊卡绑定 -->
      <section class="pedit__section">
        <h3 class="pedit__section-title">就诊卡绑定<span class="pedit__section-hint">（选填）</span></h3>
        <div class="pedit__form">
          <div class="pedit__row">
            <label class="pedit__label">社保卡号</label>
            <input v-model.trim="form.socialSecurityCard" class="pedit__input" placeholder="社保卡卡号" />
          </div>
          <div class="pedit__row">
            <label class="pedit__label">就诊卡号</label>
            <input v-model.trim="form.medicalCard" class="pedit__input" placeholder="医院就诊卡号" />
          </div>
        </div>
      </section>

      <!-- 默认就诊人 -->
      <section class="pedit__section pedit__section--toggle">
        <div class="pedit__toggle-row">
          <div>
            <p class="pedit__toggle-title">设为默认就诊人</p>
            <p class="pedit__toggle-desc">挂号时优先选择此就诊人</p>
          </div>
          <label class="pedit__switch">
            <input v-model="form.isDefault" type="checkbox" class="pedit__switch-input" />
            <span class="pedit__switch-slider"></span>
          </label>
        </div>
      </section>

      <!-- 提示 -->
      <p class="pedit__tip">
        <svg viewBox="0 0 24 24" class="pedit__tip-icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        信息仅用于挂号就诊，绿芽健康将严格保护您的隐私
      </p>

      <!-- 底部操作 -->
      <div class="pedit__actions">
        <button v-if="isEdit" class="pedit__btn pedit__btn--del" type="button" @click="onDelete">删除</button>
        <button class="pedit__btn pedit__btn--save" type="button" @click="onSave">保存</button>
      </div>

      <div class="pedit__safe-space"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from '@/utils/toast'
import { getPatientById, addPatient, updatePatient, deletePatient } from '@/utils/patientStore'

const router = useRouter()
const route = useRoute()

const editId = computed(() => route.query.id || null)
const isEdit = computed(() => !!editId.value)

const relationships = [
  { value: '本人', type: 'self' },
  { value: '子女', type: 'child' },
  { value: '父母', type: 'elderly' },
  { value: '配偶', type: 'other' },
  { value: '其他', type: 'other' }
]

const form = ref({
  name: '',
  gender: 'male',
  birthDate: '',
  idCard: '',
  phone: '',
  relationship: '本人',
  type: 'self',
  socialSecurityCard: '',
  medicalCard: '',
  isDefault: false
})

onMounted(() => {
  if (editId.value) {
    const p = getPatientById(editId.value)
    if (p) {
      form.value = { ...p }
    } else {
      toast('就诊人不存在')
      router.replace('/patient')
    }
  }
})

function pickRelation(r) {
  form.value.relationship = r.value
  form.value.type = r.type
}

function onPhoneInput() {
  form.value.phone = (form.value.phone || '').replace(/\D/g, '').slice(0, 11)
}

function validate() {
  if (!form.value.name || form.value.name.length < 2) {
    toast('请输入姓名'); return false
  }
  if (!form.value.idCard || !/^[\dXx]{18}$/.test(form.value.idCard)) {
    toast('请输入正确的身份证号'); return false
  }
  if (!form.value.phone || !/^1\d{10}$/.test(form.value.phone)) {
    toast('请输入正确的手机号'); return false
  }
  return true
}

function onSave() {
  if (!validate()) return
  if (isEdit.value) {
    updatePatient(editId.value, { ...form.value })
    toast('已保存修改')
  } else {
    addPatient({ ...form.value })
    toast('就诊人添加成功')
  }
  setTimeout(() => router.replace('/patient'), 500)
}

function onDelete() {
  deletePatient(editId.value)
  toast('已删除就诊人')
  setTimeout(() => router.replace('/patient'), 500)
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.pedit {
  background: var(--bg);
  min-height: 100vh;
}

.pedit__nav {
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

.pedit__back {
  position: absolute;
  left: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pedit__back svg { width: 20px; height: 20px; }

.pedit__nav-title { font-size: 17px; font-weight: 600; }

.pedit__scroll {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ========== 卡片 ========== */
.pedit__section {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: var(--shadow);
}

.pedit__section--toggle { padding: 14px 16px; }

.pedit__section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pedit__section-hint {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-light);
}

/* ========== 关系 chips ========== */
.pedit__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pedit__chip {
  padding: 8px 18px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sub);
  background: #f3f4f6;
  border: 1.5px solid transparent;
  transition: all 0.18s;
}

.pedit__chip--active {
  color: var(--primary);
  background: var(--primary-light);
  border-color: var(--primary);
  font-weight: 600;
}

.pedit__chip:active { transform: scale(0.95); }

/* ========== 表单 ========== */
.pedit__form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pedit__row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 0 14px;
  background: #f9fafb;
  border-radius: 10px;
}

.pedit__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  flex-shrink: 0;
  width: 72px;
}

.pedit__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--text-main);
}

.pedit__input::placeholder { color: var(--text-light); }

.pedit__radio-group {
  display: flex;
  gap: 8px;
  flex: 1;
}

.pedit__radio {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: var(--text-sub);
  border: 1px solid #e5e7eb;
  transition: all 0.18s;
}

.pedit__radio--on {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-light);
  font-weight: 600;
}

.pedit__radio-input { display: none; }

/* ========== 开关 ========== */
.pedit__toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pedit__toggle-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.pedit__toggle-desc {
  font-size: 12px;
  color: var(--text-sub);
  margin-top: 2px;
}

.pedit__switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.pedit__switch-input { opacity: 0; width: 0; height: 0; }

.pedit__switch-slider {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: #d1d5db;
  transition: background 0.25s;
}

.pedit__switch-slider::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s;
}

.pedit__switch-input:checked + .pedit__switch-slider {
  background: var(--primary);
}

.pedit__switch-input:checked + .pedit__switch-slider::before {
  transform: translateX(20px);
}

/* ========== 提示 ========== */
.pedit__tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-light);
  padding: 0 8px;
}

.pedit__tip-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* ========== 底部操作 ========== */
.pedit__actions {
  display: flex;
  gap: 10px;
  margin: 4px 0;
}

.pedit__btn {
  flex: 1;
  height: 48px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  transition: transform 0.15s;
}

.pedit__btn--save {
  color: #fff;
  background: linear-gradient(135deg, #2dd4a8 0%, #14b8a6 100%);
  box-shadow: 0 4px 16px rgba(45, 212, 168, 0.35);
}

.pedit__btn--del {
  flex: 0 0 100px;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.pedit__btn:active { transform: scale(0.96); }

.pedit__safe-space { height: 20px; }
</style>
