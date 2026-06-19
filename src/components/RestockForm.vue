<script setup>
import { ref } from 'vue'

const props = defineProps({
  products: { type: Array, required: true },
})
const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  product_id: '',
  supplier_name: '',
  quantity: 1,
  unit_cost: 0,
})

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3 bg-white rounded-xl shadow p-4">
    <select v-model="form.product_id" required
      class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base">
      <option value="" disabled>Select product</option>
      <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>

    <input v-model="form.supplier_name" placeholder="Supplier name"
      class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-slate-500">Quantity</label>
        <input v-model.number="form.quantity" type="number" min="1" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
      <div>
        <label class="text-xs text-slate-500">Unit Cost</label>
        <input v-model.number="form.unit_cost" type="number" step="0.01" min="0" required
          class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-base" />
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <button type="submit" class="flex-1 bg-slate-800 text-white rounded-lg py-2.5 font-semibold">
        Record Purchase
      </button>
      <button type="button" @click="emit('cancel')" class="flex-1 bg-slate-200 text-slate-700 rounded-lg py-2.5 font-semibold">
        Cancel
      </button>
    </div>
  </form>
</template>