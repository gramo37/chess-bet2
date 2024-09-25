import { useEffect, useState } from "react"
import { fetchedStatsData } from "../fetch";


export  function Stats() {
    const [statsProfits, setStatsProfits] = useState(0);
    const [statsGamePlayed, setStatsGamePlayed] = useState([]);
    const [StatsWin, setStatsWin] = useState([]);
    const [timeRange, setTimeRange] = useState<string>("allTime");
    
    useEffect(()=>{
getStats();
},[])

async function getStats(){
    const date = calculateStartDate()
    const fetchedStatsGames = await fetchedStatsData('daily-games',date);
    const fetchedStatsProfits = await fetchedStatsData('business-profits',date)
    const fetchedStatsUserWin = await fetchedStatsData("users-won-lost",date);

    setStatsGamePlayed(fetchedStatsGames.totalGamesPlayed);
    setStatsProfits(fetchedStatsProfits.businessProfit);
    setStatsWin(fetchedStatsUserWin.totalWinners)
}


  const calculateStartDate = () => {
    const range = timeRange;
    const currentDate = new Date();

    if (range === "today") {
      const startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0); // Set the time to the start of the day (00:00:00)
      return startDate;
    }

    if (range === "7days") {
      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 7);
      return startDate;
    }

    if (range === "1month") {
      const startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 1);
      return startDate;
    }

    if (range === "1year") {
      const startDate = new Date(currentDate);
      startDate.setFullYear(currentDate.getFullYear() - 1);
      return startDate;
    }

    return null;
  };
    return <div>
        <div className="mb-4">
            <div className="flex gap-4">
          <h3 className="text-lg font-semibold">Select Time Range</h3>
               <button onClick={getStats} className="px-2 rounded-lg py-1 text-white bg-blue-500">GET</button>   
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
            <p className="text-lg">{statsProfits}$</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Games Played</h3>
            <p className="text-lg">{statsGamePlayed}</p>
          </div>
        </div>
    </div>
}