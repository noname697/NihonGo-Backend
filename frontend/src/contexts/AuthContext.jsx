import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe, loginUser } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("@NihonGo:token");

      if (!token) {
        setUser(null);
        return;
      }

      const data = await getMe();

      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("@NihonGo:token");
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("@NihonGo:token", data.token);
    setUser(data.user);

    return data;
  };

  const register = async (formData) => {
    const data = await register(formData);

    localStorage.setItem("@NihonGo:token", data.token);
    setUser(data.user);

    return data;
  };

  const logout = (formData) => {
    localStorage.removeItem("@NihonGo:token");
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      isLoadingUser,
      login,
      register,
      logout,
    };
  }, [user, isLoadingUser]);

  return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
};
