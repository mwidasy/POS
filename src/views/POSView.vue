<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import { useSales } from '../composables/useSales'

const { products, fetchProducts } = useProducts()
const { checkout } = useSales()

const cart = ref([])
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

const cartCount = computed(() => cart.value.reduce((sum, i) => sum + i.quantity, 0))

const tileColors = ['#FFE8E2', '#E2F0FF', '#E8F7E5', '#FFF3D6', '#F3E8FF', '#E2FBF6']
function colorFor(id) {
  let hash = 0
  for (const c of id) hash = (hash + c.charCodeAt(0)) % tileColors.length
  return tileColors[hash]
}

function addToCart(product) {
  const existing = cart.value.find((i) => i.product_id === product.id)
  if (existing) {
    if (existing.quantity < product.stock_quantity) existing.quantity++
  } else if (product.stock_quantity > 0) {
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

function incrementItem(item) {
  if (item.quantity < item.stock_quantity) item.quantity++
}

function decrementItem(item) {
  item.quantity--
  if (item.quantity <= 0) cart.value = cart.value.filter((i) => i.product_id !== item.product_id)
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
  <div class="min-h-screen bg-[#F7F5F2] pb-36">
    <div class="px-5 pt-6 pb-3">
      <h1 class="text-2xl font-bold text-[#1F2024] mb-4">POS</h1>
      <input
        v-model="search"
        placeholder="Search product or SKU..."
        class="w-full bg-white rounded-2xl px-4 py-3.5 text-base shadow-sm placeholder:text-[#8A8F98]"
      />
    </div>

    <div class="px-5 grid grid-cols-2 gap-4">
      <button
        v-for="p in filteredProducts"
        :key="p.id"
        @click="addToCart(p)"
        :disabled="p.stock_quantity === 0"
        class="bg-white rounded-3xl shadow-sm p-4 text-left active:scale-95 transition-transform disabled:opacity-40"
      >
        <div
          class="w-full h-20 rounded-2xl flex items-center justify-center text-3xl mb-3"
          :style="{ backgroundColor: colorFor(p.id) }"
        >
          🔧
        </div>
        <p class="font-bold text-[#1F2024] text-sm truncate">{{ p.name }}</p>
        <p class="text-[#FF5630] font-bold text-base mt-1">{{ p.selling_price }}</p>
        <p class="text-xs text-[#8A8F98] mt-0.5">Stock: {{ p.stock_quantity }}</p>
      </button>
    </div>

    <!-- Cart sheet -->
    <div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] p-5">
      <div v-if="cart.length > 0" class="max-h-36 overflow-y-auto mb-3 space-y-3">
        <div v-for="item in cart" :key="item.product_id" class="flex justify-between items-center">
          <span class="text-sm font-medium text-[#1F2024] flex-1 truncate">{{ item.name }}</span>
          <div class="flex items-center gap-3">
            <button @click="decrementItem(item)" class="w-9 h-9 bg-[#F7F5F2] rounded-full font-bold text-lg text-[#1F2024]">−</button>
            <span class="w-6 text-center font-bold">{{ item.quantity }}</span>
            <button @click="incrementItem(item)" class="w-9 h-9 bg-[#F7F5F2] rounded-full font-bold text-lg text-[#1F2024]">+</button>
          </div>
        </div>
      </div>

      <p v-if="message" class="text-sm mb-2 font-medium" :class="message.startsWith('Error') ? 'text-red-600' : 'text-green-600'">
        {{ message }}
      </p>

      <button
        @click="handleCheckout"
        :disabled="cart.length === 0 || processing"
        class="w-full bg-[#FF5630] text-white font-bold rounded-2xl py-4 text-lg shadow-lg shadow-orange-200 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <span v-if="!processing">Checkout · {{ cartTotal }}</span>
        <span v-else>Processing...</span>
        <span v-if="cartCount > 0 && !processing" class="bg-white/20 rounded-full px-2 py-0.5 text-sm">{{ cartCount }}</span>
      </button>
    </div>
  </div>
</template>