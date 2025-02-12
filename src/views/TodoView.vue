<script setup lang="ts">
import api from '@/apis'
const todos: any = ref([])

const isEditing = ref<number | null>(null)
const editedTitle = ref('')
const editedDescription = ref('')

const isCreating = ref(false)
const newTitle = ref('')
const newDescription = ref('')

const fetchTodos = async () => {
  try {
    const response = await api.todo.getTodos()
    if (response.status === 200) {
      todos.value = response.data
      console.log('Todos:', todos.value)
    } else if (response.status === 404) {
      console.log('No todos found')
    } else {
      console.log('Unexpected response status:', response.status)
    }
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
}

onMounted(() => {
  fetchTodos()
})

const createTodo = () => {
  isCreating.value = true
}

const saveNewTodo = async () => {
  try {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      alert('User ID not found in local storage')
      return
    }

    const response = await api.todo.createTodo({
      title: newTitle.value,
      description: newDescription.value,
      user_id: userId,
    })

    console.log(response)
    if (response.status === 201) {
      alert('Todo created successfully')
      fetchTodos()
      newTitle.value = ''
      newDescription.value = ''
      isCreating.value = false
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert('All fields are required')
    } else {
      console.error('Error creating todo:', error)
    }
  }
}

const editTodo = (id: any) => {
  const todo = todos.value.find((todo: any) => todo.id === id)
  if (todo) {
    isEditing.value = id
    editedTitle.value = todo.title
    editedDescription.value = todo.description
  }
}

const saveTodo = async (id: any) => {
  try {
    const response = await api.todo.updateTodo({
      title: editedTitle.value,
      description: editedDescription.value,
    })

    if (response.status === 200) {
      alert('Todo updated successfully')
      fetchTodos()
      isEditing.value = null
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert('All fields are required')
    } else {
      console.error('Error updating todo:', error)
    }
  }
}

const deleteTodo = async (id: string) => {
  try {
    const response = await api.todo.deleteTodo(id)
    if (response.status === 204) {
      alert('Todo deleted successfully')
      fetchTodos()
    }
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

</script>

<template>
  <main class="p-4">
    <div v-if="todos.length === 0" class="text-left text-white">
      No todo found
    </div>
    <div v-else>
      <table class="min-w-full bg-gray-700 border">
        <thead>
          <tr class="bg-gray-500">
            <th class="py-2 px-4 border-b text-left">ID</th>
            <th class="py-2 px-4 border-b text-left">Title</th>
            <th class="py-2 px-4 border-b text-left">Description</th>
            <th class="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="todo in todos" :key="todo.id" class="hover:bg-gray-600">
            <td class="py-2 px-4 border-b text-left">{{ todo.id }}</td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === todo.id">
                <input v-model="editedTitle" class="border p-1" />
              </div>
              <div v-else>
                {{ todo.title }}
              </div>
            </td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === todo.id">
                <input v-model="editedDescription" class="border p-1" />
              </div>
              <div v-else>
                {{ todo.description }}
              </div>
            </td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === todo.id">
                <button class="text-green-500 hover:underline mr-2" @click="saveTodo(todo.id)">Save</button>
                <button class="text-gray-500 hover:underline" @click="isEditing = null">Cancel</button>
              </div>
              <div v-else>
                <button class="text-blue-500 hover:underline mr-2" @click="editTodo(todo.id)">Edit</button>
                <button class="text-red-500 hover:underline" @click="deleteTodo(todo.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isCreating" class="mt-4">
      <input v-model="newTitle" placeholder="Title" class="border p-1 mr-2" />
      <input v-model="newDescription" placeholder="Description" class="border p-1 mr-2" />
      <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="saveNewTodo">Save</button>
      <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        @click="isCreating = false">Cancel</button>
    </div>

    <button v-else class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="createTodo">Create
      Todo</button>
  </main>
</template>
