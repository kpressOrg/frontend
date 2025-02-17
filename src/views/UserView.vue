<script setup lang="ts">
import api from '@/apis'
const users: any = ref([])

const isEditing = ref<number | null>(null)
const editedName = ref('')
const editedPassword = ref('')

const fetchUsers = async () => {
  try {
    const response = await api.user.getUsers()
    if (response.status === 200) {
      users.value = response.data
      console.log('Users:', users.value)
    } else if (response.status === 404) {
      console.log('No users found')
    } else {
      console.log('Unexpected response status:', response.status)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})

const editUser = (id: any) => {
  const user = users.value.find((user: any) => user.id === id)
  if (user) {
    isEditing.value = id
    editedName.value = user.username
    editedPassword.value = '' // Password should be reset for security reasons
  }
}

const saveUser = async (id: any) => {
  try {
    const response = await api.user.updateUser({
      username: editedName.value,
      password: editedPassword.value,
    })
    if (response.status === 200) {
      alert('User updated successfully')
      fetchUsers()
      isEditing.value = null
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert('All fields are required')
    } else {
      console.error('Error updating user:', error)
    }
  }
}

const deleteUser = async (id: string) => {
  try {
    const response = await api.user.deleteUser(id)
    if (response.status === 204) {
      alert('User deleted successfully')
      fetchUsers()
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

</script>

<template>
  <main class="p-4">
    <div v-if="users.length === 0" class="text-center text-white">
      No user found
    </div>
    <div v-else>
      <table class="min-w-full bg-gray-700 border border-gray-600">
        <thead>
          <tr class="bg-gray-500">
            <th class="py-2 px-4 border-b border-gray-600 text-left">ID</th>
            <th class="py-2 px-4 border-b border-gray-600 text-left">Username</th>
            <th class="py-2 px-4 border-b border-gray-600 text-left">Password</th>
            <th class="py-2 px-4 border-b border-gray-600 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-600">
            <td class="py-2 px-4 border-b border-gray-600 text-left">{{ user.id }}</td>
            <td class="py-2 px-4 border-b border-gray-600 text-left">
              <div v-if="isEditing === user.id">
                <input v-model="editedName" class="border p-1" />
              </div>
              <div v-else>
                {{ user.username }}
              </div>
            </td>
            <td class="py-2 px-4 border-b border-gray-600 text-left">
              <div v-if="isEditing === user.id">
                <input v-model="editedPassword" type="password" class="border p-1" />
              </div>
              <div v-else>
                ********
              </div>
            </td>
            <td class="py-2 px-4 border-b border-gray-600 text-left">
              <div v-if="isEditing === user.id">
                <button class="text-green-500 hover:underline mr-2" @click="saveUser(user.id)">Save</button>
                <button class="text-gray-500 hover:underline" @click="isEditing = null">Cancel</button>
              </div>
              <div v-else>
                <button class="text-blue-500 hover:underline mr-2" @click="editUser(user.id)">Edit</button>
                <button class="text-red-500 hover:underline" @click="deleteUser(user.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
