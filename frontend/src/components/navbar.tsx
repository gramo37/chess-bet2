import { useState } from "react";
import usePersonStore from "../contexts/auth";
import { useGetUser } from "../hooks/useGetUser";
import { Link } from "react-router-dom";

export default function NavBar() {
  useGetUser();
  const user = usePersonStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white w-full shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-3 px-4">
        <a
          href="/"
          className="relative text-black hover:text-yellow-500 transition-colors duration-300"
        >
          <span className="text-2xl font-extrabold">ProChesser</span>
          <span className="block text-sm font-medium absolute -bottom-3 -right-3 text-gray-500">
            Gamer
          </span>
        </a>

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
          <ul className="flex items-center">
            <li className="m-2 text-black text-lg font-medium">
              <Link to="/" className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300">
                Home
              </Link>
            </li>

            <li className="m-2 text-black text-lg font-medium">
              <Link to="/about" className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300">
                About
              </Link>
            </li>

            <li className="m-2 text-black text-lg font-medium">
              <Link to="/faqs" className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300">
                FAQs
              </Link>
            </li>

            <li className="m-2 text-black text-lg font-medium">
              <Link to="/blog" className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300">
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
          <a
            href="/how-it-works"
            className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
          >
            How It Works
          </a>
          <div className="w-[2px] h-[20px] bg-black"></div>
          <a
            href="/rules"
            className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
          >
            Rules
          </a>
          <div className="w-[2px] h-[20px] bg-black"></div>
          {!user ? (
            <div className="flex gap-2">
              <a
                href="/login"
                className="bg-yellow-500 text-black font-semibold py-2 px-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-transparent  border-2 border-yellow-500 hover:bg-yellow-500 hover:text-white text-black font-semibold py-1 px-2 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Signup
              </a>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              {user?.role === "USER" && (
                <a
                  href="/account"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  Account
                </a>
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
          <a
            href="/how-it-works"
            className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
          >
            How It Works
          </a>
          <a
            href="/rules"
            className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
          >
            Rules
          </a>
          {!user ? (
            <div className="flex flex-col gap-2">
              <a
                href="/login"
                className="bg-yellow-500 text-black font-semibold py-2 px-3 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-transparent  border-2 border-yellow-500 hover:bg-yellow-500 hover:text-white text-black font-semibold py-1 px-2 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Signup
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {user?.role === "USER" && (
                <a
                  href="/account"
                  className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
                >
                  Account
                </a>
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
