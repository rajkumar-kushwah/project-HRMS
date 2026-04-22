import { api } from "@/services/api.service";


// checkin api
export const getAttendance = () => api.get("/checkin");
// checkin api
export const checkIn = () => api.post("/checkin");
// checkout api
export const checkOut = () => api.post("/checkin/checkout");
