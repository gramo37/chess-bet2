import { BrowserRouter, Routes, Route } from "react-router-dom";
        import Game from "./screens/Game";
import { useGetUser } from "./hooks/useGetUser";
import usePersonStore from "./contexts/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/login";
import Signup from "./components/signup";
import Spinner from "./components/spinner";
import Account from "./components/account";
import { PrivateRoute, PublicRoute } from "./components/routeComponent";

function App() {
  useGetUser();
  const isLoading = usePersonStore((state) => state.isLoading); // Loading state from store
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-slate-900 min-h-screen w-screen">
        <BrowserRouter>
          {isLoading ? (
            <Spinner /> // Show spinner when loading user data
          ) : (
            <Routes>
              {/* Protected Routes */}
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

              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />

              {/* Another Protected Route */}
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <Account />
                  </PrivateRoute>
                }
              />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
