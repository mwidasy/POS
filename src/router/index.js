import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import PurchasesView from '../views/PurchasesView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InventoryView from '../views/InventoryView.vue'
import POSView from '../views/POSView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/purchases', name: 'purchases', component: PurchasesView, meta: { requiresAuth: true } },
  { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/inventory', name: 'inventory', component: InventoryView, meta: { requiresAuth: true } },
  { path: '/pos', name: 'pos', component: POSView, meta: { requiresAuth: true } },
  { path: '/reports', name: 'reports', component: ReportsView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const isAuthed = !!data.session

  if (to.meta.requiresAuth && !isAuthed) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthed) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router