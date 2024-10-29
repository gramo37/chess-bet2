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
import NavBar from "./components/navbar";
import usePersonStore, { useChatStore } from "./contexts/auth";
import { useEffect, useState } from "react";
import HowItWorks from "./components/howitworks";
import Rules from "./components/rules";
import HomePage from "./components/learners/Homepage";
import Footer from "./components/Footer";
import About from "./components/learners/About";
import FAQ from "./components/learners/FAQ";
import Blog from "./components/blog/Blog";
import Content from "./components/learners/Content";
import { RecoilRoot } from "recoil";
import Newsletter from "./components/learners/NewsLetter";
import AffiliateProgram from "./components/learners/AffiliateProgram";
import PrivacyPolicy from "./components/learners/privacy";
import TermsOfService from "./components/learners/termsofservices";
import ScrollToTop from "./components/scrolltop";
import BlogPost from "./components/blog/blogPost";
import LiveChat from "./components/liveChat";
// import PaypalPage from "./components/account/DepositMoney/paypal";

const queryClient = new QueryClient();

function App() {
  const { isChatVisible, setChatVisibility } = useChatStore();
  const [tawkLoaded, setTawkLoaded] = useState(false);
  const user = usePersonStore((state) => state.user);

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

  function LiveChatMaximize() {
    if (tawkLoaded && window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className=" min-h-screen w-screen">
        <PopUp />
        <BrowserRouter>
          <ScrollToTop />
  
          <RecoilRoot>
            <NavBar />
            <Routes>
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
                    <>
                    <Login />
                    <LiveChat/>
                    </>
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <>
                    <Signup />
                    <LiveChat/>
                    </>
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
              <Route path="/how-it-works" element={<>
              <HowItWorks />
              <LiveChat/>
              </>} />
              <Route path="/" element={<><HomePage />
                <LiveChat/>
              </>} />
              {/* <Route path="/paypal" element={<PaypalPage />} /> */}
              <Route path="/about" element={<><About /><LiveChat/></>} />
              <Route path="/faqs" element={<><FAQ /><LiveChat/></>} />
              <Route path="/blog" element={<><Blog /><LiveChat/></>} />
              <Route path="/blog/:id" element={<><BlogPost /><LiveChat/></>} />
              <Route path="/learnchess" element={<><Content /><LiveChat/></>} />
              <Route path="/subscribe" element={<><Newsletter /><LiveChat/></>} />
              <Route path="/affliate" element={<><LiveChat/><AffiliateProgram /></>} />
              <Route path="/privacy-policy" element={<><PrivacyPolicy /><LiveChat/></>} />
              <Route path="/terms" element={<><TermsOfService /><LiveChat/></>} />
              <Route path="/rules" element={<><Rules /><LiveChat/></>} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/game/:id" element={<GameProfile />} />
              <Route path="/reset-password/:id" element={<ResetPassword />} />
            </Routes>
            {!user && <Footer maxLiveChat={LiveChatMaximize} />}
          </RecoilRoot>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
