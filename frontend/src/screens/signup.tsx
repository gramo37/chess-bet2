import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";
import { useGlobalStore } from "../contexts/global.context";
import { Link } from "react-router-dom";
import { getNames } from 'country-list';

export default function SignUP() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const countries = getNames();

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  async function onclick() {
    if (!email || !name || !password || !selectedCountry || !username) {
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: <div className="p-2">Please enter all details</div>,
      });
      return;
    }
    const url = `${BACKEND_URL}/auth/register`;

    try {
      const response = await axios.post(
        url,
        {
          email: email.toLowerCase(),
          name: name,
          password: password,
          referral: referral,
          country: selectedCountry,
          username,
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
      window.location.href = "/game";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      alertPopUp({
        message: "Error",
        type: "Error",
        showPopUp: true,
        body: (
          <div className="p-2">
            {error?.response?.data?.message ??
              "Registration failed. Please try again."}
          </div>
        ),
      });
    }
  }

  return (
    <section className="w-full bg-black py-5 text-black mx-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">
              Sign Up to Your Account
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
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Your Name
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
                  htmlFor="country"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">-- Select a Country --</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="text"
                  name="country"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  placeholder="Username"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                /> */}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="referral"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Referral (Optional)
                </label>
                <input
                  type="text"
                  name="referral"
                  placeholder="Referral ID"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-yellow-500"
                  required
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 font-semibold text-black py-2 rounded hover:bg-yellow-600 hover:text-white transition-colors"
                onClick={onclick}
              >
                Sign Up
              </button>
              <p className="text-sm font-light  flex gap-2 text-white dark:text-gray-400">
                Already Have an Account?
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
