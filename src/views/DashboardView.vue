<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const { user, signOut } = useAuth()
const { fetchLowStock } = useProducts()
const router = useRouter()

const lowStockItems = ref([])

onMounted(async () => {
  lowStockItems.value = await fetchLowStock()
})

async function handleLogout() {
  await signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-bold text-slate-800">Dashboard</h1>
      <button @click="handleLogout" class="text-sm text-red-600 font-medium">Log out</button>
    </header>

    <p class="text-slate-600 mb-4">Logged in as: {{ user?.email }}</p>

    <div v-if="lowStockItems.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <p class="font-semibold text-red-700 mb-2">⚠ {{ lowStockItems.length }} item(s) low on stock</p>
      <ul class="space-y-1">
        <li v-for="item in lowStockItems" :key="item.id" class="text-sm text-red-600">
          {{ item.name }} — {{ item.stock_quantity }} left (reorder at {{ item.reorder_threshold }})
        </li>
      </ul>
    </div>
    
    <router-link to="/pos" class="text-sm text-slate-800 font-medium underline block mt-2">
        Go to POS →
      </router-link>
      <router-link to="/inventory" class="text-xs text-red-700 underline mt-2 block">
        Go restock →
      </router-link>
    <router-link to="/inventory" class="text-sm text-slate-800 font-medium underline block">
      Go to Inventory →
    </router-link>
    <router-link to="/purchases" class="text-sm text-slate-800 font-medium underline block mt-2">
      Go to Purchases →
    </router-link>
    <router-link to="/reports" class="text-sm text-slate-800 font-medium underline block mt-2">
      Go to Reports →
    </router-link>
  </div>
</template>