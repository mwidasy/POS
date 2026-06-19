<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const { user, signOut } = useAuth()
const { fetchLowStock } = useProducts()
const router = useRouter()

const lowStockItems = ref([])
const loading = ref(true)

const initial = computed(() => user.value?.email?.charAt(0).toUpperCase() || '?')

onMounted(async () => {
  lowStockItems.value = await fetchLowStock()
  loading.value = false
})

async function handleLogout() {
  await signOut()
  router.push('/login')
}

const tiles = [
  { to: '/inventory', label: 'Inventory', icon: '📦', bg: '#FFE8E2' },
  { to: '/pos', label: 'POS', icon: '🧾', bg: '#E2F0FF' },
  { to: '/purchases', label: 'Purchases', icon: '🚚', bg: '#E8F7E5' },
  { to: '/reports', label: 'Reports', icon: '📊', bg: '#FFF3D6' },
]
</script>

<template>
  <div class="min-h-screen bg-[#F7F5F2]">
    <header class="flex justify-between items-center px-5 pt-6 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-[#FF5630] flex items-center justify-center text-white font-bold text-lg shrink-0">
          {{ initial }}
        </div>
        <div>
          <p class="text-xs text-[#8A8F98]">{{ user?.email }}</p>
          <h1 class="text-2xl font-bold text-[#1F2024] mt-0.5">Dashboard</h1>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="text-sm font-semibold text-[#FF5630] bg-white shadow-sm rounded-full px-4 py-2"
      >
        Log out
      </button>
    </header>

    <div class="px-5 space-y-5">
      <div v-if="!loading && lowStockItems.length > 0" class="bg-white rounded-3xl shadow-sm p-5">
        <p class="text-sm font-bold text-[#FF5630] mb-3">⚠ {{ lowStockItems.length }} item(s) need restocking</p>
        <div class="space-y-2 mb-4">
          <div v-for="item in lowStockItems" :key="item.id" class="flex justify-between items-center">
            <span class="text-sm text-[#1F2024]">{{ item.name }}</span>
            <span class="text-sm font-bold text-[#FF5630]">{{ item.stock_quantity }} left</span>
          </div>
        </div>
        <router-link
          to="/inventory"
          class="block text-center bg-[#FF5630] text-white font-bold rounded-2xl py-3.5 text-base shadow-lg shadow-orange-200"
        >
          Restock now
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <router-link
          v-for="tile in tiles"
          :key="tile.to"
          :to="tile.to"
          class="bg-white rounded-3xl shadow-sm p-5 flex flex-col items-start gap-3 active:scale-95 transition-transform"
        >
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            :style="{ backgroundColor: tile.bg }"
          >
            {{ tile.icon }}
          </div>
          <span class="text-base font-bold text-[#1F2024]">{{ tile.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>