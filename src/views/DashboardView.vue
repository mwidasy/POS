<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const { user, signOut } = useAuth()
const { fetchLowStock } = useProducts()
const router = useRouter()

const lowStockItems = ref([])
const loading = ref(true)

onMounted(async () => {
  lowStockItems.value = await fetchLowStock()
  loading.value = false
})

async function handleLogout() {
  await signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#14171C] text-[#F4F1EA]">
    <!-- Header -->
    <header class="flex justify-between items-center px-4 py-4 border-b border-white/10">
      <div>
        <p class="text-[10px] uppercase tracking-widest text-[#8B8F98] font-mono">Workshop</p>
        <h1 class="text-xl font-black tracking-tight">Dashboard</h1>
      </div>
      <button
        @click="handleLogout"
        class="text-xs font-mono uppercase tracking-wide text-[#8B8F98] border border-white/15 rounded px-3 py-1.5 active:bg-white/5"
      >
        Log out
      </button>
    </header>

    <div class="p-4 space-y-4">
      <!-- User strip -->
      <p class="text-sm text-[#8B8F98] font-mono">{{ user?.email }}</p>

      <!-- Low stock ledger -->
      <div v-if="loading" class="text-sm text-[#8B8F98] font-mono">Loading...</div>

      <div v-else-if="lowStockItems.length > 0" class="space-y-2">
        <p class="text-[10px] uppercase tracking-widest text-[#F2A93B] font-mono font-bold">
          ⚠ Reorder ({{ lowStockItems.length }})
        </p>
        <div
          v-for="item in lowStockItems"
          :key="item.id"
          class="relative bg-[#1E2229] rounded-md pl-4 pr-3 py-3 overflow-hidden"
        >
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F2A93B]"></div>
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold text-sm">{{ item.name }}</p>
              <p class="text-xs text-[#8B8F98] font-mono mt-0.5">
                threshold {{ item.reorder_threshold }}
              </p>
            </div>
            <p class="font-mono text-lg font-bold text-[#E2533D]">{{ item.stock_quantity }}</p>
          </div>
        </div>
        <router-link
          to="/inventory"
          class="block text-center text-xs font-mono uppercase tracking-wide text-[#F2A93B] border border-[#F2A93B]/30 rounded py-2 active:bg-[#F2A93B]/10"
        >
          Go restock →
        </router-link>
      </div>

      <div v-else class="bg-[#1E2229] rounded-md px-4 py-3">
        <p class="text-sm text-[#8B8F98]">All stock levels healthy.</p>
      </div>

      <!-- Nav tiles -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <router-link
          to="/inventory"
          class="bg-[#1E2229] rounded-lg p-4 active:bg-[#252A33] transition-colors"
        >
          <p class="text-2xl mb-1">📦</p>
          <p class="text-sm font-semibold">Inventory</p>
        </router-link>
        <router-link
          to="/pos"
          class="bg-[#1E2229] rounded-lg p-4 active:bg-[#252A33] transition-colors"
        >
          <p class="text-2xl mb-1">🧾</p>
          <p class="text-sm font-semibold">POS</p>
        </router-link>
        <router-link
          to="/purchases"
          class="bg-[#1E2229] rounded-lg p-4 active:bg-[#252A33] transition-colors"
        >
          <p class="text-2xl mb-1">🚚</p>
          <p class="text-sm font-semibold">Purchases</p>
        </router-link>
        <router-link
          to="/reports"
          class="bg-[#1E2229] rounded-lg p-4 active:bg-[#252A33] transition-colors"
        >
          <p class="text-2xl mb-1">📊</p>
          <p class="text-sm font-semibold">Reports</p>
        </router-link>
      </div>
    </div>
  </div>
</template>