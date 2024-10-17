import { useState } from "react";
import { BACKEND_URL } from "../../constants/routes";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = `${BACKEND_URL}/auth/newsletter`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      alert(data.message);
      console.log(data);
      setEmail("");
      setMessage(data.message || "Thank You for Subscribing!!");
    } catch (error: any) {
      alert(error.message || "An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <section className="pt-32 relative w-screen bg-gray-100 text-black py-16 px-6 mx-auto">
      <div className="pt-20 text-center mb-12">
        <h2 className="text-4xl font-bold text-yellow-600">
          Subscribe to Our Newsletter
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-3/4 px-4 py-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-3/4 bg-yellow-500 text-black font-semibold py-3 px-6 rounded-full hover:bg-yellow-600 hover:text-white transition-colors duration-300"
        >
          Subscribe
        </button>
        {message && (
          <p className="mt-4 text-green-600 font-medium text-center">
            {message}
          </p>
        )}
      </form>
    </section>
  );
};

export default Newsletter;
