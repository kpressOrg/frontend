<script setup lang="ts">
import { useAuthStore } from '@/stores'
const list_of_routers = ref<string[]>([])
const authStore = useAuthStore()


watchEffect(() => {
  list_of_routers.value = authStore.isAuthenticated || (localStorage.getItem('is_authenticated') === 'true') ? ['posts', 'todos', 'users'] : ['login', 'register']
});

</script>
<template>
  <h1 class="text-2xl text-white text-center font-bold mb-4">
    <template v-for="i in list_of_routers.length" :key="i--">
      <router-link :to="{ name: list_of_routers[i] }" class="text-blue-500 hover:underline p-2">{{
        list_of_routers[i] }}</router-link>
    </template>
  </h1>
</template>
