import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Game from "./screens/Game";
import Login from "./screens/login";
import Signup from "./screens/signup";
import ForgotPassword from "./screens/forgotpassword";
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
import NavBar from "./components/Navbar";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useChatStore } from "./contexts/auth";
import { useEffect, useRef, useState } from "react";
import HowItWorks from "./components/howitworks";
import Rules from "./components/rules";
import HomePage from "./components/learners/Homepage";
import Footer from "./components/Footer";
import About from "./components/learners/About";
import FAQ from "./components/learners/FAQ";
import Blog from "./components/learners/Blog";
import Content from "./components/learners/Content";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

function App() {
  const { isChatVisible, setChatVisibility } = useChatStore();
  const tawkMessengerRef = useRef(null);
  const [tawkLoaded, setTawkLoaded] = useState(false);

  // Listen for the Tawk.to widget load event
  useEffect(() => {
    const handleLoad = () => {
      setTawkLoaded(true);
    };
    window.addEventListener("tawkLoad", handleLoad);
  }, []);

  useEffect(() => {
    if (tawkLoaded && window.Tawk_API) {
      if (isChatVisible) {
        window.Tawk_API.showWidget();
      } else {
        window.Tawk_API.hideWidget();
      }
    }
  }, [isChatVisible, setChatVisibility]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className=" min-h-screen w-screen">
        <TawkMessengerReact
          propertyId="6706978802d78d1a30eefdb7"
          widgetId="1i9s2li2d"
          onLoad={() => window.dispatchEvent(new Event("tawkLoad"))}
          ref={tawkMessengerRef}
        />
        <PopUp />
        <BrowserRouter>
          <RecoilRoot>
            <NavBar />
            <Routes>
              {/* Private Routes */}
              {/* <Route
              path="/"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            /> */}
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
              <Route
                path="/forgotpassword"
                element={
                  <PublicRoute>
                    <ForgotPassword />
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
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faqs" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/learnchess" element={<Content />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/game/:id" element={<GameProfile />} />
              <Route path="/reset-password/:id" element={<ResetPassword />} />
            </Routes>
            <Footer />
          </RecoilRoot>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
