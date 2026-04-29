import { api } from "@/services/api.service";

 interface AttendanceFilterParams {
  search?: string;
  date?: string;
  status?: string;
}

// checkin api
export const getAttendance = () => api.get("/checkin");
// checkin api
export const checkIn = () => api.post("/checkin");
// checkout api
export const checkOut = () => api.post("/checkin/checkout");

// filter api
export const filterAttendance = (params: AttendanceFilterParams) => api.get("/checkin/filter", {params});
