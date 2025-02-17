import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL

const todoApi = {
  getTodos: () => axios.get(`${BASE_URL}/todos/all`),
  createTodo: (todoData: any) => axios.post(`${BASE_URL}/todos/create`, todoData),
  updateTodo: (todoData: any) => axios.patch(`${BASE_URL}/todos/todo/${todoData.id}`, todoData),
  deleteTodo: (id: string) => axios.delete(`${BASE_URL}/todos/todo/${id}`),
}

export default todoApi
