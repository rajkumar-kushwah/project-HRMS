import { createContext, useContext, useEffect, useState } from "react";
import { getprofile } from "@/controllers/profile.controller";

// type User = {
//   id: number;
//   email: string;
//   role: string;
//   roles: string[];
//   permission: string[];
// };

// type AuthContextType = {
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
//   authenticated: boolean | null;
//   setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
//   fetchUser: () => Promise<void>;
// };


const AuthContext = createContext<any>(null);
type authSate = boolean | null;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState<authSate>(null);

  const fetchUser = async () => {
    try {
      const res = await getprofile();
      setUser(res.data.user);
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
    <AuthContext.Provider value={{ user, setUser, authenticated, setAuthenticated, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
    if(!context) {
      throw new Error("useAuth must be used within a AuthProvider.")
    }

    return context
}