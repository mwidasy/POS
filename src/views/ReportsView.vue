<script setup>
import { ref, onMounted, watch } from 'vue'
import { useReports } from '../composables/useReports'
import BottomNav from '../components/BottomNav.vue'

const { summary, topProducts, loading, fetchSummary, fetchTopProducts } = useReports()

const period = ref('day')

async function loadData() {
  await fetchSummary(period.value)
  await fetchTopProducts(period.value)
}

onMounted(loadData)
watch(period, loadData)
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <h1 class="text-lg font-bold text-slate-800 mb-4">Reports</h1>

    <div class="flex gap-2 mb-4">
      <button
        v-for="p in ['day', 'week', 'month']"
        :key="p"
        @click="period = p"
        class="flex-1 py-2 rounded-lg text-sm font-semibold capitalize"
        :class="period === p ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 shadow'"
      >
        {{ p }}
      </button>
    </div>

    <p v-if="loading" class="text-slate-500 text-sm">Loading...</p>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-white rounded-xl shadow p-4">
        <p class="text-xs text-slate-500">Revenue</p>
        <p class="text-xl font-bold text-slate-800">{{ summary.revenue.toFixed(0) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <p class="text-xs text-slate-500">Profit</p>
        <p class="text-xl font-bold text-green-600">{{ summary.profit.toFixed(0) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <p class="text-xs text-slate-500">Cost</p>
        <p class="text-xl font-bold text-slate-800">{{ summary.cost.toFixed(0) }}</p>
      </div>
      <div class="bg-white rounded-xl shadow p-4">
        <p class="text-xs text-slate-500">Line Items Sold</p>
        <p class="text-xl font-bold text-slate-800">{{ summary.count }}</p>
      </div>
    </div>

    <h2 class="text-sm font-bold text-slate-700 mb-2">Top Products ({{ period }})</h2>
    <div class="space-y-2">
      <div v-for="(p, i) in topProducts" :key="i" class="bg-white rounded-xl shadow p-3 flex justify-between">
        <span class="text-sm text-slate-800">{{ i + 1 }}. {{ p.name }}</span>
        <span class="text-sm text-slate-600">{{ p.quantity }} sold · {{ p.revenue.toFixed(0) }}</span>
      </div>
      <p v-if="topProducts.length === 0 && !loading" class="text-slate-500 text-sm text-center mt-4">
        No sales in this period.
      </p>
    </div>
    <BottomNav />
  </div>
</template>