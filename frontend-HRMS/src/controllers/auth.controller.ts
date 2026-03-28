import { api } from "../services/api.service";

interface user {
    id?: number,
    name?: string,
    email: string,
    password: string
}

// signin user
export const signIn = (user: user) => api.post("/auth/signin", user);

// signup user
export const signUp = (user: user) => api.post("/auth/users", user);

// logout user
export const logout = () => api.post("/auth/logout");



// delete user
// export const deleteUser = (id: number) => api.delete(`/users/${id}`);


