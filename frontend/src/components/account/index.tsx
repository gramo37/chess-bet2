import { useState } from "react";
import usePersonStore from "../../contexts/auth";
import { IoMdArrowBack } from "react-icons/io";
import TransactionHistory from "./transactions";
import GameHistory from "./gamehistory";
import { Report } from "./report";
import DepositMoney from "./DepositMoney";
import WithdrawMoney from "./WithdrawMoney";
import { useNavigate } from "react-router-dom";
import { ReportHistory } from "./reporthistory";
import Refresh from "../Refresh";
import { BACKEND_URL } from "../../constants/routes";

export default function Account() {
  const user = usePersonStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("transactions");
  const navigate = useNavigate();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "transactions":
        return <TransactionHistory />;
      case "gamesplayed":
        return <GameHistory />;
      case "deposit":
        return <DepositMoney />;
      case "withdraw":
        return <WithdrawMoney />;
      default:
        return <ReportHistory />;
    }
  };

  async function VerifiedEmail() {
    const url = `${BACKEND_URL}/auth/verifyemail`;
   
    try {
  const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      const data = await response.json();
      alert(data.message); 
    } catch (error:any) {
      alert(error.message || "An error occurred. Please try again.");
      console.error(error); 
    }
  }
  

  return (
    <div className="text-white bg-black max-w-[1000px] min-h-[600px] w-full  m-auto px-4">
      <div className="flex justify-between mx-2 my-3">
        <button
          className=" p-2 bg-yellow-500 text-white rounded-full shadow-lg"
          onClick={() => {
            navigate("/");
          }}
        >
          <IoMdArrowBack size={24} /> 
        </button>
          <div className="flex gap-2 items-center">
        {user&&!user.emailVerified&&<button onClick={VerifiedEmail} className="text-yellow-500 hover:text-yellow-400 hover:underline">Verify Email</button>}
        <Report token={user?.token || ""} />
          </div>
      </div>

      <h1 className="text-2xl text-left mb-6 font-bold">Account</h1>
      <div className="flex justify-between flex-wrap">

        <div>

          <h3 className="mb-2 text-lg text-left">Username: {user?.email || "Guest"}</h3>
          <h3 className="mb-2 text-lg text-left">Name: {user?.name || "Anonymous"}</h3>
        </div>

        <div>

          
          <div className="flex text-white gap-3  items-center mb-4">
            <h2 className="text-lg text-left font-semibold">
              Balance: $
              {user?.balance && !Number.isNaN(Number(user?.balance))
                ? Number(user?.balance).toFixed(2)
                : 0}
            </h2>
            <Refresh />
          </div>
        </div>
      </div>
      <div className="flex space-x-3 w-full my-4 overflow-x-auto scrollbar-hide">
  <TabButton
    title="Transactions"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabKey="transactions"
  />
  <TabButton
    title="Games"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabKey="gamesplayed"
  />
  <TabButton
    title="Deposit"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabKey="deposit"
  />
  <TabButton
    title="Withdraw"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabKey="withdraw"
  />
  <TabButton
    title="Reports"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    tabKey="reports"
  />
</div>

      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
}

function TabButton({
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
      className={`py-2 px-4 border-b-4 transition-colors cursor-pointer text-sm md:text-base w-full md:w-[48%] text-center duration-300 ${tabKey === activeTab
          ? "border-yellow-500 text-yellow-500"
          : "border-transparent hover:border-gray-200 text-gray-400 hover:text-white"
        }`}
      onClick={() => setActiveTab(tabKey)}
    >
      {title}
    </div>
  );
}
