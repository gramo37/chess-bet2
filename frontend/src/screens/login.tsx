import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";
import { useGlobalStore } from "../contexts/global.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);

  async function onclick() {
    if (!email || !password) {
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: <div className="p-2">Please enter all details</div>,
      });
      return;
    }

    const url = `${BACKEND_URL}/auth/login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();
      if (response.status === 400) {
        throw new Error("Invalid username or password.");
      } else if (response.status >= 500) {
        throw new Error("Internal server error. Please try again later.");
      } else if (response.status === 403) {
        throw new Error(data.message);
      }
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);

      // alertPopUp({
      //   message: "Suucess",
      //   type: "Error",
      //   showPopUp: true,
      //   body: <div className="p-2">Login successful</div>
      // })

      // alert("Login successful");
      window.location.href = "/game";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: (
          <div className="p-2">{error.message ?? "Something went wrong"}</div>
        ),
      });
    }

    setEmail("");
    setPassword("");
  }

  return (
    <section className="bg-black">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[500px] lg:py-0">
        <div className="w-full rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">
              Login In to Your Account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Your Email
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
                onClick={() => (window.location.href = "/forgotpassword")}
                className="text-sm font-medium text-white hover:underline "
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                className="w-full mb-2 bg-yellow-500 font-semibold text-black py-2 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                onClick={onclick}
              >
                Login
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t Have a Account?{" "}
                <a
                  href="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
