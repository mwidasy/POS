<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/inventory', label: 'Inventory', icon: '📦' },
  { to: '/pos', label: 'POS', icon: '🧾' },
  { to: '/purchases', label: 'Purchases', icon: '🚚' },
  { to: '/reports', label: 'Reports', icon: '📊' },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-between px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
    <router-link
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors"
      :class="route.path === item.to ? 'text-[#FF5630]' : 'text-[#8A8F98]'"
    >
      <span class="text-xl">{{ item.icon }}</span>
      <span class="text-[11px] font-semibold">{{ item.label }}</span>
    </router-link>
  </nav>
</template>