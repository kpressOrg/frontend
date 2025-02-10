<script setup lang="ts">
    import { ref } from 'vue'
    import axios from 'axios'

    const form = ref({
      name: '',
      email: '',
      password: '',
    })

    const register = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, form.value)
        console.log('Registration successful:', response.data)
      } catch (error) {
        console.error('Registration failed:', error)
      }
    };
</script>

    <template>
      <div class="min-h-screen flex items-center justify-center">
        <div class="p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 class="text-2xl font-bold mb-6 text-center text-white">Register</h2>
          <form @submit.prevent="register">
            <div class="mb-4">
              <label class="block text-gray-100 text-sm font-bold mb-2" for="name">Name</label>
              <input v-model="form.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" required>
            </div>
            <div class="mb-4">
              <label class="block text-gray-100 text-sm font-bold mb-2" for="email">Email</label>
              <input v-model="form.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required>
            </div>
            <div class="mb-6">
              <label class="block text-gray-100 text-sm font-bold mb-2" for="password">Password</label>
              <input v-model="form.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" required>
            </div>
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

