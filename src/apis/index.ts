import userApi from './user-api'
import authApi from './auth-api'
import todoApi from './todo-api'
import postApi from './post-api'

const api = {
  user: userApi,
  auth: authApi,
  todo: todoApi,
  post: postApi,
}

export default api
