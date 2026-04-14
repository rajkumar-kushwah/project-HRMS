import { api } from "@/services/api.service";



//  permission api 

export const getPermissions = () => api.get("/permission");

//  create permision

export const createPermission = ( data: {name: string}) => api.post("/permission", data);

//  update permission

export const updatePermission = (id: number,data: {name: string}) => api.put(`/permission/${id}`, data);

//  delete permission

export const deletePermission = (id: number) => api.delete(`/permission/${id}`);