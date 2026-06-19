<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initial: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  sku: '',
  cost_price: 0,
  selling_price: 0,
  stock_quantity: 0,
  reorder_threshold: 5,
})

watch(
  () => props.initial,
  (val) => {
    if (val) form.value = { ...val }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3 bg-white rounded-xl shadow p-4">
    <input v-model="form.name" placeholder="Product name" required
      class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />

    <input v-model="form.sku" placeholder="SKU / Barcode"
      class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-slate-500">Cost Price</label>
        <input v-model.number="form.cost_price" type="number" step="0.01" min="0" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
      <div>
        <label class="text-xs text-slate-500">Selling Price</label>
        <input v-model.number="form.selling_price" type="number" step="0.01" min="0" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-slate-500">Stock Qty</label>
        <input v-model.number="form.stock_quantity" type="number" min="0" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
      <div>
        <label class="text-xs text-slate-500">Reorder At</label>
        <input v-model.number="form.reorder_threshold" type="number" min="0" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <button type="submit" class="flex-1 bg-slate-800 text-white rounded-lg py-2.5 font-semibold">
        Save
      </button>
      <button type="button" @click="emit('cancel')" class="flex-1 bg-slate-200 text-slate-700 rounded-lg py-2.5 font-semibold">
        Cancel
      </button>
    </div>
  </form>
</template>