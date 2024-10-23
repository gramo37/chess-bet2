import { useState } from "react";
import usePersonStore from "../contexts/auth";
import { useGetUser } from "../hooks/useGetUser";
import { Link } from "react-router-dom";
import { ACADEMY_FRONTEND_URL } from "../constants/learner";

export default function NavBar() {
  useGetUser();
  const user = usePersonStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // Submenu state for account creation
  const [loginSubmenuOpen, setLoginSubmenuOpen] = useState(false); // Submenu state for login
  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);
  const toggleLoginSubmenu = () => setLoginSubmenuOpen(!loginSubmenuOpen);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white w-full shadow-md" id="nav">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-3 px-4">
        <Link
          to="/"
          className="relative text-black hover:text-yellow-500 transition-colors duration-300"
        >
          <div className="flex">
            <img width={50} height={50} src="/piece.png" />
            <div className="flex flex-col items-end justify-center relative">
              <span className="text-2xl font-extrabold mr-3">ProChesser</span>
              <span className="text-sm font-medium text-gray-500 absolute bottom-1">
                Gamer
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4 px-4">
          {!user && (
            <ul className="flex items-center">
              <li className="m-2 text-black text-lg font-medium">
                <Link
                  to="/"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>

              <li className="m-2 text-black text-lg font-medium">
                <Link
                  to="/about"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  About
                </Link>
              </li>

              <li className="m-2 text-black text-lg font-medium">
                <Link
                  to="/faqs"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  FAQs
                </Link>
              </li>

              <li className="m-2 text-black text-lg font-medium">
                <Link
                  to="/blog"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>

              <li className="m-2 text-black text-lg font-medium">
                <Link
                  to="/learnchess"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  Academy
                </Link>
              </li>
            </ul>
          )}
          {(!user || (user && user.role === "USER")) && (
            <>
              <Link
                to="/how-it-works"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                How It Works
              </Link>
              <div className="w-[2px] h-[20px] bg-black"></div>
              <Link
                to="/rules"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Rules
              </Link>
              <div className="w-[2px] h-[20px] bg-black"></div>
            </>
          )}
          {!user ? (
            <div className="flex gap-2">
              <button
                onClick={toggleLoginSubmenu}
                className="text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform"
              >
                Login
              </button>

              {/* Login Submenu for login options */}
              {loginSubmenuOpen && (
                <div className="absolute top-12 right-60 bg-white shadow-lg rounded-lg z-10 p-4">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to={`${ACADEMY_FRONTEND_URL}/signin`}
                        className="block text-black hover:text-yellow-500"
                        onClick={() => setLoginSubmenuOpen(false)}
                      >
                        Learners
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="block text-black hover:text-yellow-500"
                        onClick={() => setLoginSubmenuOpen(false)}
                      >
                        Gamers
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              <button
                onClick={toggleSubmenu}
                className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-400"
              >
                Create Account
              </button>

              {/* Submenu for account creation */}
              {submenuOpen && (
                <div className="absolute top-12 right-10 bg-white shadow-lg rounded-lg z-10 p-4">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to={`${ACADEMY_FRONTEND_URL}/register`}
                        className="block text-black hover:text-yellow-500"
                        onClick={() => setSubmenuOpen(false)}
                      >
                        Learners Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="block text-black hover:text-yellow-500"
                        onClick={() => setSubmenuOpen(false)}
                      >
                        Gamers Account
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              {user?.role === "USER" && (
                <>
                  <Link
                    to="/game"
                    className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                  >
                    Game
                  </Link>
                  <div className="w-[2px] h-[20px] bg-black"></div>

                  <Link
                    to="/account"
                    className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                  >
                    Account
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-yellow-500 text-black font-semibold py-2 px-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col lg:hidden px-4 py-2 gap-2">
          {!user && (
            <>
              <Link
                to="/"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                About
              </Link>
              <Link
                to="/faqs"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                FAQs
              </Link>
              <Link
                to="/blog"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Blog
              </Link>
              <Link
                to="/learnchess"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Academy
              </Link>
            </>
          )}
          {(!user || (user && user.role === "USER")) && (
            <>
              <Link
                to="/how-it-works"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                How It Works
              </Link>
              <Link
                to="/rules"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Rules
              </Link>
            </>
          )}
          {!user ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={toggleLoginSubmenu}
                className="text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform"
              >
                Login
              </button>
              {loginSubmenuOpen && (
                <ul className="space-y-2 pl-4">
                  <li>
                    <Link
                      to={`${ACADEMY_FRONTEND_URL}/login`}
                      className="block text-black hover:text-yellow-500"
                      onClick={toggleMenu}
                    >
                      Learners
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="block text-black hover:text-yellow-500"
                      onClick={toggleMenu}
                    >
                      Gamers
                    </Link>
                  </li>
                </ul>
              )}
              <button
                onClick={toggleSubmenu}
                className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-400"
              >
                Create Account
              </button>
              {submenuOpen && (
                <ul className="space-y-2 pl-4">
                  <li>
                    <Link
                      to={`${ACADEMY_FRONTEND_URL}/register`}
                      className="block text-black hover:text-yellow-500"
                      onClick={toggleMenu}
                    >
                      Learners Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="block text-black hover:text-yellow-500"
                      onClick={toggleMenu}
                    >
                      Gamers Account
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {user?.role === "USER" && (
                <>
                  <Link
                    to="/game"
                    className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                  >
                    Game
                  </Link>
                  <Link
                    to="/account"
                    className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                  >
                    Account
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="bg-yellow-500 text-black font-semibold py-2 px-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
