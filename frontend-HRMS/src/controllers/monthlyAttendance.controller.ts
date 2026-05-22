import { api } from "@/services/api.service";


export interface AttendanceFilterParams {
    month?: number;
    year?: number;
    employeeId?: number;
    departmentId?: number;
    status?: string;
}

//  monthly attendance api 
export const getMonthlyAttendance = (month: number, year: number) =>
    api.get(`/monthly-attendance/monthly?month=${month}&year=${year}`);

// filter api

export const filterMonthlyAttendance = (params: AttendanceFilterParams) => api.get("/monthly-attendance/filter", { params, });