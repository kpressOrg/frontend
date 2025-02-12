import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_URL

const postApi = {
  getPosts: () => axios.get(`${BASE_URL}/posts/all`),
  createPost: (postData: any) => axios.post(`${BASE_URL}/posts/create`, postData),
  updatePost: (postData: any) => axios.patch(`${BASE_URL}/posts/post/${postData.id}`, postData),
  deletePost: (id: string) => axios.delete(`${BASE_URL}/posts/post/${id}`),
}

export default postApi
