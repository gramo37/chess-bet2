import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Game from "./screens/Game";
import Login from "./components/login";
import Signup from "./components/signup";
import Spinner from "./components/spinner";
import Account from "./components/account/account";
import { PrivateRoute, PublicRoute,AdminPrivateRoute } from "./components/routeComponent";
import usePersonStore from "./contexts/auth";
import { useGetUser } from "./hooks/useGetUser";
import Payment from "./screens/Payment";
import Dashboard from "./components/admin";

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
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/payment/:secret_token"
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login admin={false}/>
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup admin={false}/>
                </PublicRoute>
              }
            />
            <Route 
            path="/adminsignup"
            element={
              <AdminPrivateRoute>
              <Signup admin={true}/>
              </AdminPrivateRoute>

            }
            />
            <Route 
            path="/adminlogin"
            element={
              <AdminPrivateRoute>
              <Login admin={true}/>
              </AdminPrivateRoute>
            }
            />
            <Route path="/dashboard" element={
              <AdminPrivateRoute>
              <Dashboard/>
              </AdminPrivateRoute>
          }/>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
