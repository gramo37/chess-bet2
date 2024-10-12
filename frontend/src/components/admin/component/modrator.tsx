import { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";



export function Modrator() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  async function onclick(e: any) {
    e.preventDefault();
    const url = `${BACKEND_URL}/admin/create-modrator`
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.toLowerCase(),
          name
        }),
      });

      if (response.status === 400) {
        throw new Error("Already Exists");
      } else if (response.status >= 500) {
        throw new Error("Internal server error. Please try again later.");
      }

      const data = await response.json();

      setEmail("")
      setName("")
      alert(data.message);
    } catch (e: any) {
      alert(e.message)
      console.log("Error", e);
    }
  }

  return <div className="space-y-4">
    <div className="">
      <h1 className="text-lg text-white">Add Modrators</h1>
      <form className=" mt-4 items-center">
        <div className="flex gap-3 mb-3">
        <div className="w-[40%]">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
          <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="w-[40%]">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
          <input type="text" name="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        </div>
        <button
          type="submit"
          className=" min-h-[40px] w-[200px] self-center text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          onClick={(e) => onclick(e)}
        >
          Create Modrator
        </button>
      </form>
    </div>
  </div>
}