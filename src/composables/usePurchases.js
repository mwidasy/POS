import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function usePurchases() {
  const purchases = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchPurchases() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('purchases')
      .select('*, products(name, sku)')
      .order('purchased_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      purchases.value = data
    }
    loading.value = false
  }

  async function recordPurchase({ product_id, supplier_name, quantity, unit_cost }) {
    const { data: userData } = await supabase.auth.getUser()

    // Insert purchase record
    const { error: insertErr } = await supabase
      .from('purchases')
      .insert({
        owner_id: userData.user.id,
        product_id,
        supplier_name,
        quantity,
        unit_cost,
      })

    if (insertErr) throw insertErr

    // Increment stock on the product
    const { data: product, error: fetchErr } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', product_id)
      .single()

    if (fetchErr) throw fetchErr

    const { error: updateErr } = await supabase
      .from('products')
      .update({ stock_quantity: product.stock_quantity + quantity })
      .eq('id', product_id)

    if (updateErr) throw updateErr

    await fetchPurchases()
  }

  return { purchases, loading, error, fetchPurchases, recordPurchase }
}