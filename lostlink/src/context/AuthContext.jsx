import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Temporary mock users — will be replaced by real API calls
const MOCK_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@lostlink.com",
    password: "admin123",
    role: "ADMIN",
    phone: "+251911000000",
    isActive: true,
  },
  {
    id: 2,
    name: "Abebe Kebede",
    email: "abebe@example.com",
    password: "user123",
    role: "USER",
    phone: "+251911111111",
    isActive: true,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user was previously logged in (stored in localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("lostlink_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password");
    }

    if (!found.isActive) {
      throw new Error("Your account has been suspended");
    }

    // Remove password before storing — never keep it in state
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("lostlink_user", JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 500));

    // Check if email already exists
    const exists = MOCK_USERS.some((u) => u.email === email);
    if (exists) {
      throw new Error("Email is already registered");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      role: "USER", // Always USER — never ADMIN
      phone: "",
      isActive: true,
    };

    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem("lostlink_user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lostlink_user");
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("lostlink_user", JSON.stringify(updated));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}