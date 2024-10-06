import { useEffect, useState } from "react";
import fetchData  from "./fetch/fetchdata";
import { GamesList } from "./component/game";
import { ReportsList } from "./component/report";
import { TransactionsList } from "./component/transaction"
import { Users } from "./component/users";
import { Stats } from "./component/dashboardstats";
import { Modrator } from "./component/modrator";
import { IoIosLogOut } from "react-icons/io";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState<string>("reports");


  useEffect(() => {
    async function getdata() {
      const fetchedReports = await fetchData('reports');
      const fetchedTransactions = await fetchData('transactions');
      const fetchedGames = await fetchData('games');
      const fetchedUsers = await fetchData('users');
      setReports(fetchedReports);
      setTransactions(fetchedTransactions);
      setGames(fetchedGames);
      setUsers(fetchedUsers)
    }

    getdata();
  }, []);

function Logout(){
  localStorage.removeItem('token')
  window.location.reload();
}

  return (
    <div className="container mx-auto relative py-8">
      <div className="w-[90%]  rounded-lg p-3 mb-2 m-auto relative bg-amber-50">
      <button className="absolute top-2 right-2 text-white p-2 text-2xl rounded-lg bg-yellow-600 hover:bg-yellow-500" onClick={Logout}>
        <IoIosLogOut/>
      </button>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <Stats users={users}/>
      </div>
      <div className="w-[90%] m-auto">
        {/* Tabs Header */}
        <div className="flex space-x-3 w-full my-4 overflow-x-auto scrollbar-hide">
        <TabButton
          title={'Reports'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="reports"
          />
          <TabButton
          title={'Transactions'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="transactions"
          />
          <TabButton
          title={'Games'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="games"
          />
          <TabButton
          title={'Users'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="users"
          />
          <TabButton
          title={'Manage Modrators'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="modrator"
          />
        </div>

        {/* Tabs Content */}
        <div>
          {activeTab === "reports" && <ReportsList reports={reports} />}
          {activeTab === "transactions" && (
            <TransactionsList transactions={transactions} />
          )}
          {activeTab === "games" && <GamesList games={games} />}
          {activeTab === "users" && <Users users={users} />}
          {activeTab==="modrator" && <Modrator/>}
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
      className={`py-2 px-4 border-b-4 transition-colors whitespace-nowrap cursor-pointer text-sm md:text-base w-full md:w-[48%] text-center duration-300 ${tabKey === activeTab
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
