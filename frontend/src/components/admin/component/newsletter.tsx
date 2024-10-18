import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  useEffect(() => {
    const fetchNewsLetter = async () => {
      const url = `${BACKEND_URL}/admin/newsletter-subscribers`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setSubscribers(data.subscribers);
      } catch (e) {
        console.log(e);
      }
    };
    fetchNewsLetter();
  }, []);
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Newsletter Subscribers
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Subscribed On</th>
            </tr>
          </thead>
          <tbody>
            {subscribers && subscribers.length > 0 ? (
              subscribers.map((subscriber: any, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
                  } hover:bg-gray-300`}
                >
                  <td className="py-2 px-4">{subscriber.email || "N/A"}</td>
                  <td className="py-2 px-4">
                    {subscriber.date
                      ? new Date(subscriber.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center" colSpan={2}>
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
