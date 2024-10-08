import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Game from "./screens/Game";
import Login from "./screens/login";
import Signup from "./screens/signup";
import ForgotPassword from "./screens/forgotpassword"
import {
  PrivateRoute,
  PublicRoute,
  AdminPrivateRoute,
} from "./components/routeComponent";
import Payment from "./screens/Payment";
import PlayerProfile from "./components/admin/component/playerprofile";
import Dashboard from "./screens/dashboard";
import AccountPage from "./screens/account";
import GameProfile from "./components/admin/component/gameprofile";
import ResetPassword from "./screens/resetPassword";
import PopUp from "./components/popup";
import NavBar from "./components/navbar"

// Initialize QueryClient outside the App component to prevent unnecessary reinitializations
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className=" min-h-screen w-screen">
        <PopUp />
        <NavBar/>
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
              path="/payment/:secret_token/:api_ref/:mode"
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
                  <Login  />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup  />
                </PublicRoute>
              }
            /><Route
            path="/forgotpassword"
            element={
              <PublicRoute>
                <ForgotPassword/>
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
            <Route path="/game/:id" element={<GameProfile />} />
            <Route path="/reset-password/:id" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
