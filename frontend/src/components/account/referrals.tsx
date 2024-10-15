import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../spinner";
import { FaCopy } from "react-icons/fa";

export default function ReferralComponent() {
  const { user, transactions } = usePersonStore();
  const [referralDetails, setReferralDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("General");
  const [earnedCommission, setEarnedCommission] = useState<number>(0);
  const [totalPayouts, setTotalPayouts] = useState(0);

  useEffect(() => {
    const withdrawalsPayout = transactions?.filter(
      (t) => t.type === "REFERRAL_COMMISSION"
    );
    const earnedCommission = withdrawalsPayout?.reduce(
      (total, current) => total + current.amount,
      0
    );
    const totalpayouts = withdrawalsPayout?.length;
    setEarnedCommission(earnedCommission || 0);
    setTotalPayouts(totalpayouts || 0);
  }, [transactions]);

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
      throw new Error("Error fetching referral details");
    }
  };

  const { isLoading, error } = useQuery({
    queryKey: ["referralDetails"],
    queryFn: fetchReferralDetails,
  });

  if (isLoading || !referralDetails) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        {(error as Error).message}
      </div>
    );
  }

  if (referralDetails && !referralDetails.referredUsers?.length) {
    return <div className="text-center py-6">No referred users yet.</div>;
  }

  async function AddCommissionToAccountBalance() {
    try {
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();

      console.log(today.getDate(), lastDayOfMonth);

      if (
        today.getDate() !== lastDayOfMonth ||
        referralDetails.totalCommission < 50
      ) {
        alert(
          "Commission withdrawals are only allowed at the end of the month, and the total commission must be at least $50 to proceed."
        );
        return;
      }

      if (referralDetails.totalCommission < 50) {
        alert("Total Commission should be greater than $50");
        return;
      }

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
      console.log(data);
      alert(data.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      alert(errorMessage);
    }
  }

  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch (err) {
      console.error("Failed to copy transaction ID:", err);
    }
  };

  const GeneralTab = () => {
    return (
      <div className="p-4 bg-white border rounded-md shadow-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Referral balance: ${referralDetails.totalCommission.toFixed(2)}
          </p>
          <p className="text-sm text-yellow-600 break-all flex gap-2 items-center">
            Referral Id: {user?.referralId}
            <FaCopy
              className="cursor-pointer"
              onClick={() => copyTransactionId(user?.referralId || "")}
            />
          </p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">
            Percent: <span className="font-bold">3%</span>
          </p>
          <p className="text-sm">
            Referrals:{" "}
            <span className="font-bold">
              {referralDetails.referredUsers.length}
            </span>
          </p>
          <p className="text-sm">
            Payments: <span className="font-bold">{totalPayouts}</span>
          </p>
          <p className="text-sm">
            Earned:{" "}
            <span className="font-bold">${earnedCommission.toFixed(2)}</span>
          </p>
        </div>

        <div className="my-4 text-gray-600">
          <p>
            Refer an individual and earn a 3% commission on every deposit they
            make for the duration of their account. You can withdraw your
            referral earnings to your account balance once they total $50 or
            more, with withdrawals available at the end of each month. For
            further details, please <a href="#">read more here</a>.
          </p>
        </div>

        <div className="grid w-full place-content-center">
          <button
            onClick={AddCommissionToAccountBalance}
            className="px-4 py-2 bg-green-100 text-green-600 border border-green-500 rounded-md"
          >
            Withdraw to balance
          </button>
        </div>
      </div>
    );
  };

  const DetailsTab = () => {
    return (
      <div className="p-4 bg-white border rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Referred Users</h2>
        <ul className="space-y-3">
          {referralDetails.referredUsers.map((user: any, index: number) => (
            <li
              key={index}
              className="flex justify-between bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <p className="text-sm text-gray-700">
                <span className="font-semibold">User:</span> {user.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Joined on:</span>{" "}
                {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">Commission Deposits</h2>
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
                    <td className="px-4 py-2 text-gray-700">{deposit.user}</td>
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
    );
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-white text-black mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Referral Program</h1>
      <div className="flex  w-full mb-6">
        <TabButton
          title="General"
          tabKey="General"
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
        <TabButton
          title="Details"
          tabKey="Details"
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      {activeTab === "General" && <GeneralTab />}
      {activeTab === "Details" && <DetailsTab />}
    </div>
  );
}

export function TabButton({
  title,
  activeTab,
  setActiveTab,
  tabKey,
}: {
  title: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabKey: string;
}) {
  return (
    <div
      className={`py-2 px-4 text-sm font-medium cursor-pointer border-b-2 ${
        tabKey === activeTab
          ? "border-yellow-500 text-yellow-600"
          : "border-transparent text-gray-500 hover:text-yellow-500"
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      {title}
    </div>
  );
}
