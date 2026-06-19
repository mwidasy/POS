<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const mode = ref('login') // 'login' | 'signup'
const error = ref('')
const loading = ref(false)

const { signIn, signUp } = useAuth()
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)
    } else {
      await signUp(email.value, password.value)
    }
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
      <h1 class="text-xl font-bold text-slate-800">
        {{ mode === 'login' ? 'Log In' : 'Sign Up' }}
      </h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="6"
        class="w-full border border-slate-300 rounded-lg px-4 py-3 text-base"
      />

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-slate-800 text-white rounded-lg py-3 font-semibold disabled:opacity-50"
      >
        {{ loading ? 'Please wait...' : (mode === 'login' ? 'Log In' : 'Sign Up') }}
      </button>

      <button
        type="button"
        class="w-full text-sm text-slate-600"
        @click="mode = mode === 'login' ? 'signup' : 'login'"
      >
        {{ mode === 'login' ? "Need an account? Sign up" : 'Already have an account? Log in' }}
      </button>
    </form>
  </div>
</template>