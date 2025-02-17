import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

// The userApi object contains methods to interact with the user endpoints of the backend.
const userApi = {
  getUsers: () => axios.get(`${BASE_URL}/users/all`),
  updateUser: (userData: any) => axios.patch(`${BASE_URL}/users/user/${userData.id}`, userData),
  deleteUser: (id: string) => axios.delete(`${BASE_URL}/users/user/${id}`),
}

export default userApi
