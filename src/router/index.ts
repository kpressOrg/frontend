import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '../views/TodoView.vue'
import PostView from '../views/PostView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todos',
      component: TodoView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
    },
  ],
})

export default router
