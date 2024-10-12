import { useEffect, useState } from "react"
import { fetchedStatsData } from "../fetch/fetchstats";
import { calculateStartDate } from "../../../types/utils/utils";
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   status: string;
// };


export  function Stats() {
    const [statsProfits, setStatsProfits] = useState(0);
    const [statsGamePlayed, setStatsGamePlayed] = useState([]);
    const [StatsWin, setStatsWin] = useState([]);
    const [timeRange, setTimeRange] = useState<string>("allTime");
    const [activeuser,setActiveUser]=useState(0)
    const [suspendeduser,setSuspendedUser]=useState(0);
    useEffect(()=>{

getStats();

},[])

async function getStats(){
    const date = calculateStartDate(timeRange);
    const fetchedStats = await fetchedStatsData(date);

    setStatsGamePlayed(fetchedStats.totalGamesPlayed);
    setStatsProfits(fetchedStats.businessProfit);
    setStatsWin(fetchedStats.totalWinners);

    setActiveUser(fetchedStats.activeUsers);
    setSuspendedUser(fetchedStats.suspendedUsers);

}

    return <div>
        <div className="mb-4">
            <div className="flex gap-4">
          <h3 className="text-lg font-semibold">Select Time Range</h3>
               <button onClick={getStats} className="px-2 rounded-lg py-1 text-white bg-yellow-600">GET</button>   
            </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="1month">Last 1 Month</option>
            <option value="1year">Last 1 Year</option>
          </select>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Total Wins</h3>
            <p className="text-lg">{StatsWin}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Business Profits</h3>
            <p className="text-lg">$ {statsProfits}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Games Played</h3>
            <p className="text-lg">{statsGamePlayed}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Active Users</h3>
            <p className="text-lg">{activeuser}</p>
          </div><div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Suspended Users</h3>
            <p className="text-lg">{suspendeduser}</p>
          </div>
        </div>
    </div>
}