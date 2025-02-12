<script setup lang="ts">
import api from '@/apis'
const posts: any = ref([])

const isEditing = ref<number | null>(null)
const editedTitle = ref('')
const editedContent = ref('')

const isCreating = ref(false)
const newTitle = ref('')
const newContent = ref('')

const fetchPosts = async () => {
  try {
    const response = await api.post.getPosts()
    if (response.status === 200) {
      posts.value = response.data
      console.log('Posts:', posts.value)
    } else if (response.status === 404) {
      console.log('No posts found')
    } else {
      console.log('Unexpected response status:', response.status)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

onMounted(() => {
  fetchPosts()
})

const createPost = () => {
  isCreating.value = true
}

const saveNewPost = async () => {
  try {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      alert('User ID not found in local storage')
      return
    }
    const response = await api.post.createPost({
      title: newTitle.value,
      content: newContent.value,
      user_id: userId
    })

    console.log(response)
    if (response.status === 201) {
      alert('Post created successfully')
      fetchPosts()
      newTitle.value = ''
      newContent.value = ''
      isCreating.value = false
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert('All fields are required')
    } else {
      console.error('Error creating post:', error)
    }
  }
}

const editPost = (id: any) => {
  const post = posts.value.find((post: any) => post.id === id)
  if (post) {
    isEditing.value = id
    editedTitle.value = post.title
    editedContent.value = post.content
  }
}

const savePost = async (id: any) => {
  try {
    const response = await api.post.updatePost({
      title: editedTitle.value,
      content: editedContent.value,
    })
    if (response.status === 200) {
      alert('Post updated successfully')
      fetchPosts()
      isEditing.value = null
    }
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      alert('All fields are required')
    } else {
      console.error('Error updating post:', error)
    }
  }
}

const deletePost = async (id: string) => {
  try {
    const response = await await api.post.deletePost(id)
    if (response.status === 204) {
      alert('Post deleted successfully')
      fetchPosts()
    }
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

</script>

<template>
  <main class="p-4">
    <div v-if="posts.length === 0" class="text-center text-white">
      No post found
    </div>
    <div v-else>
      <table class="min-w-full bg-gray-700 border">
        <thead>
          <tr class="bg-gray-500">
            <th class="py-2 px-4 border-b text-left">ID</th>
            <th class="py-2 px-4 border-b text-left">Title</th>
            <th class="py-2 px-4 border-b text-left">Content</th>
            <th class="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-600">
            <td class="py-2 px-4 border-b text-left">{{ post.id }}</td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === post.id">
                <input v-model="editedTitle" class="border p-1" />
              </div>
              <div v-else>
                {{ post.title }}
              </div>
            </td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === post.id">
                <input v-model="editedContent" class="border p-1" />
              </div>
              <div v-else>
                {{ post.content }}
              </div>
            </td>
            <td class="py-2 px-4 border-b text-left">
              <div v-if="isEditing === post.id">
                <button class="text-green-500 hover:underline mr-2" @click="savePost(post.id)">Save</button>
                <button class="text-gray-500 hover:underline" @click="isEditing = null">Cancel</button>
              </div>
              <div v-else>
                <button class="text-blue-500 hover:underline mr-2" @click="editPost(post.id)">Edit</button>
                <button class="text-red-500 hover:underline" @click="deletePost(post.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isCreating" class="mt-4">
      <input v-model="newTitle" placeholder="Title" class="border p-1 mr-2" />
      <input v-model="newContent" placeholder="Content" class="border p-1 mr-2" />
      <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="saveNewPost">Save</button>
      <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        @click="isCreating = false">Cancel</button>
    </div>

    <button v-else class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="createPost">Create
      Post</button>
  </main>
</template>
