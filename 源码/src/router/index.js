import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { keepAlive: true }
  },
  {
    path: '/inquiry',
    name: 'Inquiry',
    component: () => import('@/views/InquiryView.vue')
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/HealthArchiveView.vue')
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/DiscoverView.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/MessageView.vue')
  },
  {
    path: '/doctor/:id?',
    name: 'Doctor',
    component: () => import('@/views/DoctorHomeView.vue')
  },
  {
    path: '/find',
    name: 'FindDoctor',
    component: () => import('@/views/FindDoctorView.vue')
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/MineView.vue')
  },
  {
    path: '/appointment',
    name: 'Appointment',
    component: () => import('@/views/AppointmentView.vue')
  },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('@/views/BookingView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue')
  },
  {
    path: '/patient',
    name: 'PatientList',
    component: () => import('@/views/PatientListView.vue')
  },
  {
    path: '/patient/edit',
    name: 'PatientEdit',
    component: () => import('@/views/PatientEditView.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue')
  },
  {
    // 通用「更多 / 详情」页：/more/疾病百科 或 /more?title=疾病百科
    path: '/more/:title?',
    name: 'More',
    component: () => import('@/views/PlaceholderView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
