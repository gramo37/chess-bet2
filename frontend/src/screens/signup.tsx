import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";
import { useGlobalStore } from "../contexts/global.context";

export default function SignUP() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);

  async function onclick() {
    if (!email || !name || !password) {
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: <div className="p-2">Please enter all details</div>,
      });
      return;
    }
    const url = `${BACKEND_URL}/auth/register`
      
    try {
      const response = await axios.post(
        url,
        {
          username: email,
          name: name,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      localStorage.setItem("token", data.token);

      setEmail("");
      setName("");
      setPassword("");

      console.log(data, response);
      // alert(data.message);
      window.location.href ="/game";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: <div className="p-2">{error?.response?.data?.message ?? "Registration failed. Please try again."}</div>
      })
    }
  }

  return (
    <section className="w-full bg-black text-black mx-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[500px] lg:py-0">
          <div className="w-full rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">
              Sign up to your account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Your name
                </label>
                <input
                  type="text"
                  name="username"
className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  placeholder="Full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full mb-2 bg-yellow-500 font-semibold text-black py-2 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                onClick={onclick}
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account ?{" "}
                <a
                  href= "/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
        </div>
    </section>
  );
}
