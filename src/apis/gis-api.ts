import axios from 'axios'


const BASE_URL = import.meta.env.VITE_API_URL

const gisApi = {
  getAreas: () => axios.get(`${BASE_URL}/gis/all`),
  createAOI: (postData: any) => axios.post(`${BASE_URL}/gis/create`, postData),
  deleteAOI: (id: string) => axios.delete(`${BASE_URL}/gis/delete/all`),
}

export default gisApi
