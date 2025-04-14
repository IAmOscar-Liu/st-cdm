import { User } from "@/types/general";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        enabled,
        setEnabled,
        accessToken,
        setAccessToken,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
