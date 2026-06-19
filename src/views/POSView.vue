<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import { useSales } from '../composables/useSales'

const { products, fetchProducts } = useProducts()
const { checkout } = useSales()

const cart = ref([]) // { product_id, name, quantity, selling_price, cost_price, stock_quantity }
const search = ref('')
const message = ref('')
const processing = ref(false)

onMounted(fetchProducts)

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(
    (p) => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q))
  )
})

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity * item.selling_price, 0)
)

function addToCart(product) {
  const existing = cart.value.find((i) => i.product_id === product.id)
  if (existing) {
    if (existing.quantity < product.stock_quantity) {
      existing.quantity++
    }
  } else {
    if (product.stock_quantity > 0) {
      cart.value.push({
        product_id: product.id,
        name: product.name,
        quantity: 1,
        selling_price: product.selling_price,
        cost_price: product.cost_price,
        stock_quantity: product.stock_quantity,
      })
    }
  }
}

function incrementItem(item) {
  if (item.quantity < item.stock_quantity) item.quantity++
}

function decrementItem(item) {
  item.quantity--
  if (item.quantity <= 0) {
    cart.value = cart.value.filter((i) => i.product_id !== item.product_id)
  }
}

async function handleCheckout() {
  if (cart.value.length === 0) return
  processing.value = true
  message.value = ''
  try {
    await checkout(cart.value)
    message.value = 'Sale recorded.'
    cart.value = []
    await fetchProducts()
  } catch (e) {
    message.value = 'Error: ' + e.message
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-32">
    <div class="p-4">
      <h1 class="text-lg font-bold text-slate-800 mb-3">POS</h1>
      <input
        v-model="search"
        placeholder="Search product or SKU..."
        class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base mb-3"
      />

      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="p in filteredProducts"
          :key="p.id"
          @click="addToCart(p)"
          :disabled="p.stock_quantity === 0"
          class="bg-white rounded-xl shadow p-3 text-left disabled:opacity-40"
        >
          <p class="font-semibold text-slate-800 text-sm">{{ p.name }}</p>
          <p class="text-xs text-slate-500">{{ p.selling_price }}</p>
          <p class="text-xs text-slate-400">Stock: {{ p.stock_quantity }}</p>
        </button>
      </div>
    </div>

    <!-- Cart bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
      <div v-if="cart.length > 0" class="max-h-40 overflow-y-auto mb-3 space-y-2">
        <div v-for="item in cart" :key="item.product_id" class="flex justify-between items-center text-sm">
          <span class="text-slate-700">{{ item.name }}</span>
          <div class="flex items-center gap-2">
            <button @click="decrementItem(item)" class="w-7 h-7 bg-slate-200 rounded-full font-bold">-</button>
            <span class="w-6 text-center">{{ item.quantity }}</span>
            <button @click="incrementItem(item)" class="w-7 h-7 bg-slate-200 rounded-full font-bold">+</button>
            <span class="w-16 text-right font-medium">{{ item.quantity * item.selling_price }}</span>
          </div>
        </div>
      </div>

      <p v-if="message" class="text-sm mb-2" :class="message.startsWith('Error') ? 'text-red-600' : 'text-green-600'">
        {{ message }}
      </p>

      <div class="flex justify-between items-center mb-2">
        <span class="font-semibold text-slate-800">Total</span>
        <span class="font-bold text-lg text-slate-800">{{ cartTotal }}</span>
      </div>

      <button
        @click="handleCheckout"
        :disabled="cart.length === 0 || processing"
        class="w-full bg-slate-800 text-white rounded-lg py-3 font-semibold disabled:opacity-40"
      >
        {{ processing ? 'Processing...' : 'Checkout' }}
      </button>
    </div>
  </div>
</template>