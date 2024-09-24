import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Game from "./screens/Game";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Spinner from "./components/spinner";
import {
  PrivateRoute,
  PublicRoute,
  AdminPrivateRoute,
} from "./components/routeComponent";
import usePersonStore from "./contexts/auth";
import { useGetUser } from "./hooks/useGetUser";
import Payment from "./screens/Payment";
import PlayerProfile from "./components/admin/playerprofile";
import Dashboard from "./screens/dashboard";
import AccountPage from "./screens/account";

// Initialize QueryClient outside the App component to prevent unnecessary reinitializations
const queryClient = new QueryClient();

function App() {
  useGetUser(); // Fetch and set the user on component mount
  const isLoading = usePersonStore((state) => state.isLoading); // Loading state from the store

  if (isLoading) {
    return <Spinner />; // Show spinner while loading user data
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-slate-900 min-h-screen w-screen">
        <BrowserRouter>
          <Routes>
            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            />
            <Route
              path="/game"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <AccountPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment/:secret_token"
              element={
                <PublicRoute>
                  <Payment />
                </PublicRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login admin={false} />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup admin={false} />
                </PublicRoute>
              }
            />
            <Route
              path="/adminsignup"
              element={
                <PublicRoute>
                  <Signup admin={true} />
                </PublicRoute>
              }
            />
            <Route
              path="/adminlogin"
              element={
                <PublicRoute>
                  <Login admin={true} />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AdminPrivateRoute>
                  <Dashboard />
                </AdminPrivateRoute>
              }
            />
            <Route path="/player/:id" element={<PlayerProfile />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
