import { useEffect, useState } from "react";
import { fetchGames, fetchReports, fetchTransactions } from "./fetch";
import { GamesList, ReportsList, TransactionsList } from "./admincomponent";


   const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [games, setGames] = useState([]);
    const [activeTab, setActiveTab] = useState<string>('reports');
    useEffect(() => {
      async function fetchData() {
        const fetchedReports = await fetchReports();
        const fetchedTransactions = await fetchTransactions();
        const fetchedGames = await fetchGames();
  console.log(fetchGames,fetchReports,fetchTransactions);
  
        setReports(fetchedReports);
        setTransactions(fetchedTransactions);
        setGames(fetchedGames);

      }
  
      fetchData();
    }, []);
  
    return (
      <div className="container mx-auto py-8">
<div className="w-[90%] h-[300px] rounded-lg p-3 mb-2 m-auto  bg-amber-50">
<h2 className="text-2xl font-bold mb-4">Dashboard</h2>
<div className="inline-flex items-center gap-3"><h1 className="text-3xl">Profit: </h1> <div className="rounded-full w-[70px] h-[70px] grid place-content-center text-center bg-black text-white text-xl"> 100$</div></div>
</div>
<div className="w-[90%] m-auto">
      {/* Tabs Header */}
      <div className="flex space-x-8 border-b border-gray-300 mb-6">
        <button
          className={`text-xl font-bold pb-2 ${
            activeTab === 'reports' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          User Reports
        </button>
        <button
          className={`text-xl font-bold pb-2 ${
            activeTab === 'transactions' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`text-xl font-bold pb-2 ${
            activeTab === 'games' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white'
          }`}
          onClick={() => setActiveTab('games')}
        >
          Games
        </button>
      </div>

      {/* Tabs Content */}
      <div>
        {activeTab === 'reports' && <ReportsList reports={reports} />}
        {activeTab === 'transactions' && <TransactionsList transactions={transactions} />}
        {activeTab === 'games' && <GamesList games={games} />}
      </div>
    </div>
      </div>
    );
  };
  
  export default Dashboard;