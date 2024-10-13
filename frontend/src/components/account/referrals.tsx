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

  if (
    referralDetails &&
    referralDetails.referredBy &&
    !referralDetails.referredUsers?.length
  ) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Referred By</h2>
        <p className="text-sm">
          <strong>Name:</strong> {referralDetails.referredBy.name}
        </p>
        <p className="text-sm">
          <strong>Email:</strong> {referralDetails.referredBy.email}
        </p>
      </div>
    );
  }
  // If referralDetails or referredUsers are missing or empty, show fallback message
  if (!referralDetails || !referralDetails.referredUsers?.length) {
    return <div className="text-center py-6">No referred users yet.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Referral Details</h1>

      {/* Show the list of referred users */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Referred Users</h2>
        <ul className="list-disc ml-6">
          {referralDetails.referredUsers.map(
            (user: { name: string; email: string }) => (
              <li key={user.email} className="text-sm mb-2">
                <strong>Name:</strong> {user.name} <br />
                <strong>Email:</strong> {user.email}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Display total commission earned */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Total Commission Earned</h2>
        <p className="text-sm">${referralDetails.totalCommission.toFixed(2)}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Commission Deposits</h2>
        <ul className="list-disc ml-6">
          {referralDetails.commissionDeposits.map(
            (deposit: { amount: number; date: string }, index: number) => (
              <li key={index} className="text-sm mb-2">
                <strong>Amount:</strong> ${deposit.amount.toFixed(2)} <br />
                <strong>Date:</strong>{" "}
                {new Date(deposit.date).toLocaleDateString()}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
