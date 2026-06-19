<script setup>
import { ref, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductForm from '../components/ProductForm.vue'

const { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts()

const showForm = ref(false)
const editingProduct = ref(null)

onMounted(fetchProducts)

function openAddForm() {
  editingProduct.value = null
  showForm.value = true
}

function openEditForm(product) {
  editingProduct.value = product
  showForm.value = true
}

async function handleSubmit(data) {
  if (editingProduct.value) {
    await updateProduct(editingProduct.value.id, data)
  } else {
    await addProduct(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('Delete this product?')) {
    await deleteProduct(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-lg font-bold text-slate-800">Inventory</h1>
      <button @click="openAddForm" class="bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-semibold">
        + Add
      </button>
    </header>

    <div v-if="showForm" class="mb-4">
      <ProductForm
        :initial="editingProduct"
        @submit="handleSubmit"
        @cancel="showForm = false"
      />
    </div>

    <p v-if="loading" class="text-slate-500 text-sm">Loading...</p>
    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

    <div class="space-y-2">
      <div
        v-for="p in products"
        :key="p.id"
        class="bg-white rounded-xl shadow p-4 flex justify-between items-start"
        :class="{ 'border-l-4 border-red-500': p.stock_quantity <= p.reorder_threshold }"
      >
        <div>
          <p class="font-semibold text-slate-800">{{ p.name }}</p>
          <p class="text-xs text-slate-500">{{ p.sku || 'No SKU' }}</p>
          <p class="text-sm text-slate-600 mt-1">
            Stock: <span class="font-medium">{{ p.stock_quantity }}</span>
            <span v-if="p.stock_quantity <= p.reorder_threshold" class="text-red-600 font-semibold ml-1">⚠ Low</span>
          </p>
          <p class="text-sm text-slate-600">
            Cost: {{ p.cost_price }} | Sell: {{ p.selling_price }}
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <button @click="openEditForm(p)" class="text-xs text-slate-600 font-medium">Edit</button>
          <button @click="handleDelete(p.id)" class="text-xs text-red-600 font-medium">Delete</button>
        </div>
      </div>
    </div>

    <p v-if="!loading && products.length === 0" class="text-slate-500 text-sm text-center mt-8">
      No products yet. Tap "+ Add" to get started.
    </p>
  </div>
</template>