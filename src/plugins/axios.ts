import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const expectedError =
      error.response && error.response.status >= 400 && error.response.status < 500
    if (expectedError) {
      if (error.response.data.message) {
        alert(error.response.data.message)
      }
      // const errors = error.response.data.errors;
      // let i = 1;
      // let message = "";
      // for (const key in errors) {
      //   message += `${i}. ${errors[key]} \n`;
      //   i++;
      // }
    } else {
      alert('An expected error occurred')
    }

    return Promise.reject(error)
  },
)

export default api
