import { api } from "./api.service";


export const logout = () => api.post("/logout");



interface user {
    id?: number,
    email: string,
    password: string
}
// signin user
export const login = (user: user) => api.post("/login", user);


interface signUpUser {
    id?: number;
    name: string;
    email: string;
    password: string;
}



export const signUp = (user: signUpUser) => api.post("/users", user);

// profile api
export const getprofile = () => api.get("/profile");