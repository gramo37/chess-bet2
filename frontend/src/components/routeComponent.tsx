import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import usePersonStore from "../contexts/auth"; // Your auth store
import Login from "../screens/login";
import { useGetUser } from "../hooks/useGetUser";
import ModratorDashboard from "./modrator";

interface RouteProps {
  children: ReactNode;
}

// PrivateRoute: Redirect to /login if user is not logged in
export const PrivateRoute = ({ children }: RouteProps) => {
  useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);
  if (user && user.role === "ADMIN") return <Navigate to="/dashboard" />;
  if(user&&user.role === "MODRATOR") return <ModratorDashboard/>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// PublicRoute: Redirect to /game if user is logged in
export const PublicRoute = ({ children }: RouteProps) => {
  const user = usePersonStore((state) => state.user);
  return user ? <Navigate to="/game" /> : <>{children}</>;
};

export const AdminPrivateRoute = ({ children }: RouteProps) => {
  useGetUser();
  const user = usePersonStore((state) => state.user);
  console.log(user)
  if (!user) return <Navigate to="/login" />;
  if (user.role === "USER") {
    return <Navigate to="/game" />;
  }
 else if (user.role === "MODRATOR") {
    return <ModratorDashboard/>;
  }
  else if (user) {
    return <>{children}</>;
  }
  return <Login admin={true} />;
};
