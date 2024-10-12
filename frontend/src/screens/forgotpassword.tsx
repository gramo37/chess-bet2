import { useState } from "react";
import { BACKEND_URL } from "../constants/routes";

export default function ForgotPassword(){
const [email,setEmail]=useState("")
async function onclick() {
    const url = `${BACKEND_URL}/auth/forgotpassword`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:email.toLowerCase()}),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      const data = await response.json();
      alert(data.message); 
      console.log(data); 
      setEmail("")
    } catch (error:any) {
      alert(error.message || "An error occurred. Please try again.");
      console.error(error); 
    }
  }
  

return  (  
  <div className="p-6 space-y-4 md:space-y-6 sm:p-8 pt-5  shadow-lg mt-8  w-full max-w-md m-auto xl:p-6">
  <h1 className="text-xl font-bold leading-tight tracking-tight text-yellow-400 md:text-2xl">
    Forgot Password
  </h1>

  <div>
    <label
      htmlFor="email"
      className="block mb-2 text-sm font-medium text-gray-200"
    >
      Your Email
    </label>
    <input
      type="email"
      name="email"
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500"
      placeholder="name@company.com"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <button
      type="submit"
      className="w-full text-white bg-yellow-600 mt-6 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200"
      onClick={onclick}
    >
      Log In
    </button>
  </div>
</div>

  )

}

