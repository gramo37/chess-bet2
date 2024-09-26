import { useState } from "react";
import usePersonStore from "../../contexts/auth";
import { IoMdArrowBack } from "react-icons/io";
import TransactionHistory from "./transactions";
import GameHistory from "./gamehistory";
import { Report } from "./report";
import DepositMoney from "./DepositMoney";
import WithdrawMoney from "./withdrawMoney";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const user = usePersonStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("transactions");
  const navigate = useNavigate()

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
        return <TransactionHistory />;
    }
  };

  return (
    <div className="text-white text-center max-w-full w-[900px] m-auto">
      <button className="absolute top-10 left-10" onClick={() => {
        navigate("/")
      }}>
        <IoMdArrowBack />
      </button>
      <Report token={user?.token || ""} />

      <h1 className="text-3xl mb-4">Account</h1>

      <h3 className="mb-2">Username: {user?.email || "Guest"}</h3>
      <h3 className="mb-2">Name: {user?.name || "Anonymous"}</h3>

      <div className="flex space-x-3 w-full my-4">
        <TabButton
          title="Transactions"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="transactions"
        />
        <TabButton
          title="Games Played"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="gamesplayed"
        />
        <TabButton
          title="Deposit Money"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="deposit"
        />
        <TabButton
          title="Withdraw Money"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="withdraw"
        />
      </div>

      <div className="mt-4">{renderActiveTab()}</div>
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
      className={`py-2 border-b-4 transition-colors cursor-pointer w-[48%] duration-300 ${
        tabKey === activeTab
          ? "border-teal-500"
          : "border-transparent hover:border-gray-200"
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      {title}
    </div>
  );
}
