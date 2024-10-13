import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";

export default function ReferralComponent() {
  const { user } = usePersonStore(); // Access user state from your store
  const [referralDetails, setReferralDetails] = useState<any>(null);

  // Function to fetch referral details
  const fetchReferralDetails = async () => {
    if (!user || !user.token) return [];

    try {
      const response = await axios.get(
        `${BACKEND_URL}/auth/get-referral-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setReferralDetails(response.data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch referral details:", err);
      throw new Error("Error fetching referral details");
    }
  };

  // Use React Query to fetch referral details with loading and error states
  const { isLoading, error } = useQuery({
    queryKey: ["referralDetails"],
    queryFn: fetchReferralDetails,
  });

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return <Spinner />;
  }

  // Display error message if fetching fails
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        {(error as Error).message}
      </div>
    );
  }

  if (!referralDetails || !referralDetails.referredUsers?.length) {
    return <div className="text-center py-6">No referred users yet.</div>;
  }
  async function AddCommissionToAccountBalance() {
    try {
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      // if (nextDay.getDate() !== 1) {
      //   alert("You can withdraw at the end of the month");
      //   return;
      // }
      // if (referralDetails.totalCommission < 50) {
      //   alert("Total Commission should be greater than $50");
      //   return;
      // }
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const url = `${BACKEND_URL}/auth/update-balance-commission`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      alert(data.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      console.error(error);
      alert(errorMessage);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Referral Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Referred Users Section */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Referred Users
          </h2>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Names</h3>

          <ul className="list-disc list-inside pl-4">
            {referralDetails.referredUsers.map(
              (user: { name: string; email: string }, index: number) => (
                <li
                  key={index}
                  className="text-base text-gray-700 capitalize mb-1"
                >
                  {user.name}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Commission Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Total Commission Earned
          </h2>
          <div className="flex items-center justify-between mb-6">
            <p className="text-3xl font-bold text-green-600">
              ${referralDetails.totalCommission.toFixed(2)}
            </p>
            <button
              onClick={AddCommissionToAccountBalance}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-400 transition duration-200"
            >
              Get Commission
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Note: You can add your referral earnings when they are $50 or above,
            and at the end of each month.
          </p>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Commission Deposits
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 bg-gray-100 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left px-4 py-2 bg-gray-100 font-semibold text-gray-700">
                      Commission
                    </th>
                    <th className="text-left px-4 py-2 bg-gray-100 font-semibold text-gray-700">
                      Deposit
                    </th>
                    <th className="text-left px-4 py-2 bg-gray-100 font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {referralDetails.commissionDeposits.map(
                    (deposit: any, index: number) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">
                          {deposit.user}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          ${deposit.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          ${deposit.deposit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-gray-700">
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
