import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import usePersonStore from "../contexts/auth";
import { useGetUser } from "../hooks/useGetUser";
import ModratorDashboard from "./modrator";
import Spinner from "./spinner";

interface RouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: RouteProps) => {
  const { isLoading } = useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/dashboard" />;
    case "MODRATOR":
      return <ModratorDashboard />;
    default:
      return <>{children}</>;
  }
};

export const PublicRoute = ({ children }: RouteProps) => {
  const { isLoading } = useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);
  
  if (isLoading) return <Spinner />;

  return user ? <Navigate to="/game" /> : <>{children}</>;
};

export const AdminPrivateRoute = ({ children }: RouteProps) => {
  const { isLoading } = useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);
  
  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "USER":
      return <Navigate to="/game" />;
    case "MODRATOR":
      return <ModratorDashboard />;
    case "ADMIN":
      return <>{children}</>;
    default:
      return <Navigate to="/login" />;
  }
};
