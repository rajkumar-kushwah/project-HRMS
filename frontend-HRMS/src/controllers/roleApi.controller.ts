import { api } from "@/services/api.service";

interface Rolepayload {
   
    name: string;
    description: string;
    permissions: number[]
}

// role api

export const getRoles = () => api.get("/role");

// create role

export const createRole = (data: Rolepayload) => api.post("/role", data);

// update role

export const updateRole = (id: number, data: Rolepayload) => api.put(`/role/${id}`, data);

// delete role
export const deleteRole = (id: number)=> api.delete(`/role/${id}`);