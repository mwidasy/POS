import { ref } from 'vue'
import { supabase } from '../lib/supabase'

function startOfPeriod(period) {
  const now = new Date()
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (period === 'week') {
    const d = new Date(now)
    const day = d.getDay() === 0 ? 6 : d.getDay() - 1 // Monday start
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
}

export function useReports() {
  const summary = ref({ revenue: 0, cost: 0, profit: 0, count: 0 })
  const topProducts = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchSummary(period = 'day') {
    loading.value = true
    error.value = ''
    const since = startOfPeriod(period).toISOString()

    const { data, error: err } = await supabase
      .from('sale_item_profit')
      .select('line_total, unit_cost, quantity, profit')
      .gte('sold_at', since)

    if (err) {
      error.value = err.message
      loading.value = false
      return
    }

    const revenue = data.reduce((sum, r) => sum + r.line_total, 0)
    const cost = data.reduce((sum, r) => sum + r.unit_cost * r.quantity, 0)
    const profit = data.reduce((sum, r) => sum + r.profit, 0)

    summary.value = { revenue, cost, profit, count: data.length }
    loading.value = false
  }

  async function fetchTopProducts(period = 'month', limit = 5) {
    const since = startOfPeriod(period).toISOString()

    const { data, error: err } = await supabase
      .from('sale_item_profit')
      .select('product_id, product_name, quantity, line_total')
      .gte('sold_at', since)

    if (err) {
      error.value = err.message
      return
    }

    const grouped = {}
    for (const row of data) {
      if (!grouped[row.product_id]) {
        grouped[row.product_id] = { name: row.product_name, quantity: 0, revenue: 0 }
      }
      grouped[row.product_id].quantity += row.quantity
      grouped[row.product_id].revenue += row.line_total
    }

    topProducts.value = Object.values(grouped)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
  }

  return { summary, topProducts, loading, error, fetchSummary, fetchTopProducts }
}