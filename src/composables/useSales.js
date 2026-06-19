import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useSales() {
  const sales = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchSales() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('sales')
      .select('*, sale_items(*, products(name))')
      .order('sold_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      sales.value = data
    }
    loading.value = false
  }

  async function checkout(cartItems) {
    // cartItems: [{ product_id, name, quantity, selling_price, cost_price }]
    const { data: userData } = await supabase.auth.getUser()
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.selling_price, 0)

    const { data: sale, error: saleErr } = await supabase
      .from('sales')
      .insert({ owner_id: userData.user.id, total_amount: total })
      .select()
      .single()

    if (saleErr) throw saleErr

    const items = cartItems.map((item) => ({
      sale_id: sale.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.selling_price,
      unit_cost: item.cost_price,
    }))

    const { error: itemsErr } = await supabase.from('sale_items').insert(items)
    if (itemsErr) throw itemsErr

    // Decrement stock for each item
    for (const item of cartItems) {
      const { data: product, error: fetchErr } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single()

      if (fetchErr) throw fetchErr

      const { error: updateErr } = await supabase
        .from('products')
        .update({ stock_quantity: product.stock_quantity - item.quantity })
        .eq('id', item.product_id)

      if (updateErr) throw updateErr
    }

    await fetchSales()
    return sale
  }

  return { sales, loading, error, fetchSales, checkout }
}