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
        // const isLoginPage = window.location.pathname === "/";
        const status = error.response?.status  // error response status handling ke liye 

        // if (error.response?.status === 401 && !isLoginPage) {
        //     window.location.href = "/";
        // }
        
        if (status === 403) {
            window.location.href = "/403";
        }

        if (status === 404) {
            window.location.href = "/404";
        }

        if (status === 500) {
            window.location.href = "/500";
        }
        return Promise.reject(error)
    }
)

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     if (status === 403) {
//       window.location.href = "/403";
//     }

//     if (status === 404) {
//       window.location.href = "/404";
//     }

//     if (status === 500) {
//       window.location.href = "/500";
//     }

//     //  DO NOT auto redirect on 401 here
//     return Promise.reject(error);
//   }
// );

