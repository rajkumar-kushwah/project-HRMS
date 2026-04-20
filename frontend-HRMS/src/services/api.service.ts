import axios from "axios";


export const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})


api.interceptors.response.use(
    (response) => response,
    error => {
        const isLoginPage = window.location.pathname === "/";

        if (error.response?.status === 401 && !isLoginPage) {
            window.location.href = "/";
        }
        return Promise.reject(error)
    }
)


// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },
//     (error) => {
//         return Promise.reject(error)
//     }

// )
