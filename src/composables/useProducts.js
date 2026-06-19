import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchProducts() {
    loading.value = true
    error.value = ''
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      products.value = data
    }
    loading.value = false
  }

  async function addProduct(product) {
    const { data: userData } = await supabase.auth.getUser()
    const { error: err } = await supabase
      .from('products')
      .insert({ ...product, owner_id: userData.user.id })

    if (err) throw err
    await fetchProducts()
  }

  async function updateProduct(id, updates) {
    const { error: err } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)

    if (err) throw err
    await fetchProducts()
  }

  async function deleteProduct(id) {
    const { error: err } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (err) throw err
    await fetchProducts()
  }

  async function fetchLowStock() {
    const { data, error: err } = await supabase
      .from('low_stock_products')
      .select('*')
      .order('stock_quantity', { ascending: true })

    if (err) {
      error.value = err.message
      return []
    }
    return data
  }

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, fetchLowStock }
}