import { api } from "@/services/api.service";




// create department 
export const createDepartment = (name: string) => api.post("/department", { name });

// update department
export const updateDepartment = (id: number, name: string) => api.put(`/department/${id}`, { name });

// delete department
export const deleteDepartment = (id: number) => api.delete(`/department/${id}`);

// get department
export const getDepartments = () => api.get("/department");