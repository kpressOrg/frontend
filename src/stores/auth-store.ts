import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // const isAuthenticated = ref(JSON.parse(localStorage.getItem('is_authenticated') || 'false'))
  const isAuthenticated = ref(false)

  return {
    isAuthenticated,
  }
})
