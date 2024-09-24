import { useEffect, useState } from "react";
import { fetchData } from "./fetch";
import { GamesList } from "./component/game";
import { ReportsList } from "./component/report";
import { TransactionsList} from "./component/transaction"
import { Users } from "./component/users";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [games, setGames] = useState([]);
  const [users,setUsers]=useState([])
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

  return (
    <div className="container mx-auto py-8">
      <div className="w-[90%] h-[300px] rounded-lg p-3 mb-2 m-auto  bg-amber-50">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="inline-flex items-center gap-3">
          <h1 className="text-3xl">Profit: </h1>{" "}
          <div className="rounded-full w-[70px] h-[70px] grid place-content-center text-center bg-black text-white text-xl">
            {" "}
            100$
          </div>
        </div>
      </div>
      <div className="w-[90%] m-auto">
        {/* Tabs Header */}
        <div className="flex space-x-8 border-b border-gray-300 mb-6">
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "reports"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            User Reports
          </button>
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "transactions"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "games"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white"
            }`}
            onClick={() => setActiveTab("games")}
          >
            Games
          </button>
          <button
            className={`text-xl font-bold pb-2 ${
              activeTab === "users"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-white"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        {/* Tabs Content */}
        <div>
          {activeTab === "reports" && <ReportsList reports={reports} />}
          {activeTab === "transactions" && (
            <TransactionsList transactions={transactions} />
          )}
          {activeTab === "games" && <GamesList games={games} />}
          {activeTab === "users" && <Users users={users}/>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
