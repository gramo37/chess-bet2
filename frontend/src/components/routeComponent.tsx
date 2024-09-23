import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import usePersonStore from "../contexts/auth"; // Your auth store
import Landing from "../screens/Landing";

interface RouteProps {
  children: ReactNode;
}

// PrivateRoute: Redirect to /login if user is not logged in
export const PrivateRoute = ({ children }: RouteProps) => {
  const user = usePersonStore((state) => state.user);
  return user ? <>{children}</> : <Landing/>;
};

// PublicRoute: Redirect to /game if user is logged in
export const PublicRoute = ({ children }: RouteProps) => {
  const user = usePersonStore((state) => state.user);
  return user ? <Navigate to="/game" /> : <>{children}</>;
};

export const AdminPrivateRoute = ({children}:RouteProps)=>{
  const user = usePersonStore((state) => state.user);
if(user && user.role==='USER'){
  return <Navigate to="/dashboard"/>
}else if (user){
return <>{children}</>
}
return <Navigate to="/adminlogin"/>
}

