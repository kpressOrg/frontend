import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_URL

const authApi = {
  login: (credentials: any) => axios.post(`${BASE_URL}/users/auth/login`, credentials),
  register: (userData: any) => axios.post(`${BASE_URL}/users/auth/register`, userData),
  logout: () => axios.post(`${BASE_URL}/users/auth/logout`),
}

export default authApi
