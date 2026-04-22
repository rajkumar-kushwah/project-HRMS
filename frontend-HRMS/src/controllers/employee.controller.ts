import { api } from "@/services/api.service";


interface Employee {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;


    // Professional details
    employeeCode: string;
    joiningDate: string;
    dateOfBirth: string;
    roleId: number;
    departmentId: number;
    designation: string;


    // Address
    address: string;
    city: string;
    state: string;
    pincode: string;
}


export const getEmployees = () => api.get("/employee");

// create employee

export const createEmployee = (data: Employee) => api.post("/employee", data);

// update employee

export const updateEmployee = (id: number, data: Employee) => api.put(`/employee/${id}`, data);

// delete employee

export const deleteEmployee = (id: number) => api.delete(`/employee/${id}`);

// filter employee

export const filterEmployee = (searchTerm: string) => api.get(`/employee/filter?search=${searchTerm}`);