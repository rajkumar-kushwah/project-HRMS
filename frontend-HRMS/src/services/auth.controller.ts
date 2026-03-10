import { api } from "./api.service";


interface user {
    id?: number,
    name?: string,
    email: string,
    password: string
}
// signin user
export const login = (user: user) => api.post("/login", user);

// signup user
export const signUp = (user: user) => api.post("/users", user);

// logout user
export const logout = () => api.post("/logout");

// profile api
export const getprofile = () => api.get("/profile");