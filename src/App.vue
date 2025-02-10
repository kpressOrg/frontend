<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import axios from 'axios'
const list_of_routers = [
  'posts',
  'todos',
  'users',
  'login',
  'register',
]

</script>

<template>
  <h1 class="text-2xl text-white text-center font-bold mb-4">
    <template v-for="i in list_of_routers.length" :key="i--">
      <router-link :to="{ name: list_of_routers[i] }" class="text-blue-500 hover:underline p-2">{{
        list_of_routers[i] }}</router-link>
    </template>
  </h1>
  <RouterView />
</template>
