import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://sky-scrapper.p.rapidapi.com/api",
  headers: {
    "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
  },
});

export default apiClient;
