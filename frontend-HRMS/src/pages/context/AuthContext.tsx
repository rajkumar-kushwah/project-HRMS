import { createContext, useContext, useEffect, useState } from "react";
import { getprofile } from "@/controllers/profile.controller";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await getprofile();
      setUser(res.data);
      setAuthenticated(true);
    } catch (err) {
      setUser(null);
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser(); // This will be called when the app load hote hi session check
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);