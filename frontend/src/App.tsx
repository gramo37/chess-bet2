import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./screens/Landing";
import Game from "./screens/Game";
import { useGetUser } from "./hooks/useGetUser";
import  usePersonStore  from "./contexts/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/login";
import Signup from "./components/signup";
import Spinner from "./components/spinner";

function App() {
  useGetUser();
  const user = usePersonStore((state) => state.user);
  const isLoading = usePersonStore((state) => state.isLoading);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-slate-900 min-h-screen w-screen">
        <BrowserRouter>
          {isLoading ? (
            <Spinner/>  // Show loading text when fetching user
          ) : (
            <Routes>
              <Route path="/" element={user ? <Game /> : <Landing />} />
              <Route path="/game" element={user ? <Game /> : <Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
