<script setup>
import { supabase } from './lib/supabase'
console.log('Supabase client:', supabase)
</script>

<template>
  <router-view />
</template>
