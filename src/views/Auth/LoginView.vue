<script setup lang="ts">
import api from '@/apis'
import { useAuthStore } from '@/stores'
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    const credentials = {
      username: username.value,
      password: password.value
    }
    const response = await api.auth.login(credentials)
    alert('Login successful!')
    // Store user data in local storage
    localStorage.setItem('username', username.value)
    localStorage.setItem('user_id', response.data.userId)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('is_authenticated', 'true')
    authStore.isAuthenticated = true
    // Redirect to posts route
    router.push({ name: 'posts' })
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials and try again.'
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center ">
    <div class="p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl text-white font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="username" class="block text-gray-100">Username</label>
          <input type="text" id="username" v-model="username"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-100">Password</label>
          <input type="password" id="password" v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required />
        </div>
        <div class="mb-4 text-red-500" v-if="errorMessage">{{ errorMessage }}</div>
        <button type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Login
        </button>
      </form>
    </div>
  </div>
</template>
