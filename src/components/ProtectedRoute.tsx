// src/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAppSelector((s) => s.auth);
  const location = useLocation();

  const token =
    auth.token ||
    localStorage.getItem("nxellent_access_token") ||
    localStorage.getItem("nx_token");

  // If no token, send to login and remember where user was going
  if (!token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
