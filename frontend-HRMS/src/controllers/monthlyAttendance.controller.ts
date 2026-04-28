import { api } from "@/services/api.service";


//  monthly attendance api 
export const getMonthlyAttendance = (month: number, year: number) =>
    api.get(`/monthly-attendance/monthly?month=${month}&year=${year}`);