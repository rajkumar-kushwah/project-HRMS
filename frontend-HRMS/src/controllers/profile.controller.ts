
import { api } from "../services/api.service";

// profile api
export const getprofile = () => api.get("/auth/profile");