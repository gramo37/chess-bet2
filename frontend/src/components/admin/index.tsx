import { useEffect, useState } from "react";
import fetchData from "./fetch/fetchdata";
import { GamesList } from "./component/game";
import { ReportsList } from "./component/report";
import { TransactionsList } from "./component/transaction";
import { Users } from "./component/users";
import { Stats } from "./component/dashboardstats";
import { Modrator } from "./component/modrator";
import { useChatStore } from "../../contexts/auth";
import Newsletter from "./component/newsletter";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState<string>("reports");
  const { setChatVisibility } = useChatStore();

  useEffect(() => {
    async function getdata() {
      const fetchedReports = await fetchData("reports");
      const fetchedTransactions = await fetchData("transactions");
      const fetchedGames = await fetchData("games");
      const fetchedUsers = await fetchData("users");
      setReports(fetchedReports);
      setTransactions(fetchedTransactions);
      setGames(fetchedGames);
      setUsers(fetchedUsers);
      setChatVisibility(false);
    }

    getdata();
  }, []);

  return (
    <div className="container mx-auto relative bg-black py-8">
      <div className="w-[90%]  rounded-lg p-3 mb-2 m-auto relative bg-amber-50">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <Stats />
      </div>
      <div className="w-[90%] m-auto min-h-[200px]">
        {/* Tabs Header */}
        <div className="flex space-x-3 w-full my-4 overflow-x-auto scrollbar-hide">
          <TabButton
            title={"Reports"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="reports"
          />
          <TabButton
            title={"Transactions"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="transactions"
          />
          <TabButton
            title={"Games"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="games"
          />
          <TabButton
            title={"Users"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="users"
          />
          <TabButton
            title={"Manage Moderators"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="modrator"
          />
          <TabButton
            title={"Newsletter Subscribers"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabKey="newsletter"
          />
        </div>

        {/* Tabs Content */}
        <div>
          {activeTab === "reports" && <ReportsList reports={reports} />}
          {activeTab === "transactions" && (
            <TransactionsList
              transactions={transactions}
              setTransactions={setTransactions}
            />
          )}
          {activeTab === "games" && (
            <GamesList games={games} setGames={setGames} />
          )}
          {activeTab === "users" && <Users users={users} setUsers={setUsers} />}
          {activeTab === "modrator" && <Modrator />}
          {activeTab === "newsletter" && <Newsletter />}
        </div>
      </div>
    </div>
  );
};

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
      className={`py-2 px-4 border-b-4 transition-colors whitespace-nowrap cursor-pointer text-sm md:text-base w-full md:w-[48%] text-center duration-300 ${
        tabKey === activeTab
          ? "border-yellow-500 text-yellow-500"
          : "border-transparent hover:border-gray-200 text-gray-400 hover:text-white"
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      {title}
    </div>
  );
}

export default Dashboard;
