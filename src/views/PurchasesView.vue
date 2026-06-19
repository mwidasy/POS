<script setup>
import { ref, onMounted } from 'vue'
import { usePurchases } from '../composables/usePurchases'
import { useProducts } from '../composables/useProducts'
import RestockForm from '../components/RestockForm.vue'
import BottomNav from '../components/BottomNav.vue'

const { purchases, loading, error, fetchPurchases, recordPurchase } = usePurchases()
const { products, fetchProducts } = useProducts()

const showForm = ref(false)

onMounted(async () => {
  await fetchProducts()
  await fetchPurchases()
})

async function handleSubmit(data) {
  await recordPurchase(data)
  showForm.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-lg font-bold text-slate-800">Purchases</h1>
      <button @click="showForm = !showForm" class="bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-semibold">
        {{ showForm ? 'Close' : '+ Restock' }}
      </button>
    </header>

    <div v-if="showForm" class="mb-4">
      <RestockForm
        :products="products"
        @submit="handleSubmit"
        @cancel="showForm = false"
      />
    </div>

    <p v-if="loading" class="text-slate-500 text-sm">Loading...</p>
    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div class="space-y-2">
      <div v-for="pu in purchases" :key="pu.id" class="bg-white rounded-xl shadow p-4">
        <p class="font-semibold text-slate-800">{{ pu.products?.name }}</p>
        <p class="text-xs text-slate-500">{{ pu.supplier_name || 'No supplier' }}</p>
        <p class="text-sm text-slate-600 mt-1">
          Qty: {{ pu.quantity }} @ {{ pu.unit_cost }} = <span class="font-medium">{{ pu.total_cost }}</span>
        </p>
        <p class="text-xs text-slate-400 mt-1">{{ new Date(pu.purchased_at).toLocaleString() }}</p>
      </div>
    </div>

    <p v-if="!loading && purchases.length === 0" class="text-slate-500 text-sm text-center mt-8">
      No purchases recorded yet.
    </p>
    <BottomNav />
  </div>
</template>