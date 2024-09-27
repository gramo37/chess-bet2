import { useEffect, useState } from "react"
import { BACKEND_URL } from "../constants/routes";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";

export default function ResetPassword(){
    const [pass,setPass]=useState("");
    const [repass,setRePass]=useState("")
    const [error,setError]=useState("")
    const { id } = useParams<{ id: string }>();
    const [email,setEmail]=useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = id;
    console.log(id);
    
        if (!token) {
          alert("No reset token provided");
          return;
        }
        async function verifyToken() {
          try {
            const response = await fetch(`${BACKEND_URL}/auth/verifyResetToken/${token}`, {
              method: "GET",
            });
    
            const result = await response.json();
    
            if (!response.ok) {
              setError(result.message || "Invalid or expired token");
              navigate("/login"); 
            }
            else{
                setEmail(result.email)
                console.log(email);
                
            }
          } catch (err) {
            console.log("Failed to verify token",err);
          }
        }
    
        verifyToken();
      }, [navigate]);
    
    
    async function onclick(e:any) {
        e.preventDefault();
       const token = id;
        if (pass !== repass) {
          alert("Passwords do not match");
          return;
        }
    
    
        if (!token) {
          alert("url is not right");
          return;
        }
     const url = `${BACKEND_URL}/auth/updateforgotpassword`
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword: pass }),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            alert("Password reset successfully");
            navigate("/login");
          } else {
            setError(result.message || "An error occurred");
          }
        } catch (err) {
          setError("Failed to reset password");
        }
      }
    
    return <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset Password
          </h1>
          <p className="leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">Email: {email}</p>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <input
                type="password"
                name="pass"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="new Password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
               Re Password
              </label>
              <input
                type="password"
                name="Repassword"
                placeholder="Re Enter New password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={repass}
                onChange={(e) => setRePass(e.target.value)}
              />
            </div>
            {(repass!==pass) && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              onClick={onclick}
            >
              Reset password
            </button>
           
          </form>
        </div>
      </div>
    </div>
  </section>
}