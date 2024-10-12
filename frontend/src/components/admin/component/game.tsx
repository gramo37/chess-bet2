import  { useState } from "react";
import { BACKEND_URL } from "../../../constants/routes";
import { IoMdRefresh } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import fetchData from "../fetch/fetchdata";

type GamesListProps = {
  games:any[],
  setGames:(arg:any)=>void
}

export const GamesList = ({ games,setGames }:GamesListProps) => {
  const [search,setSearch]=useState("")
 const [filterGames,SetFilterGames]=useState(games);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

async function SearchGameById(){
  if(!search)return

    const url = `${BACKEND_URL}/admin/game/${search}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
        },
      });
      if (!response.ok) {
        throw new Error("Game not found");
      }
      const data = await response.json();
      SetFilterGames([data]);
    } catch (err) {
      alert((err as Error).message)??"invalid Id";
    } finally {
    }

 }

 
 const LoadMoreGames = async ()=>{
  setIsLoadingMore(true);
  const data = await fetchData('games',page+1)
  setPage(page+1);
  setGames([...games,...data])
  setHasMore(data.length > 0); 
  setIsLoadingMore(false);
  console.log('nlmklasv')
 }


  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center">
      <input type="text" placeholder="Search game by game Id" value={search} onChange={(e)=>setSearch(e.target.value)} className="py-2 max-w-[60%] w-[500px] px-4 rounded" />
        <button onClick={SearchGameById}  className="bg-yellow-600 py-3 px-4 text-white hover:bg-yellow-500 rounded ml-2"><FaSearch/></button>
        <button onClick={()=>{
          SetFilterGames(games)
          setSearch("")
        }} className="bg-yellow-600 py-3 px-4  text-white hover:bg-yellow-500 rounded ml-2"><IoMdRefresh/></button>
      </div>
      {filterGames&&filterGames.map((game) => (
        <Game game={game}/>
      ))}
      
      {isLoadingMore && <p className="text-white text-xl m-3">Loading more games...</p>}

      {hasMore && !isLoadingMore && (
        <button
          onClick={LoadMoreGames}
          className="mt-4 bg-yellow-500 mx-auto text-white py-2 px-4 rounded"
        >
          Load More
        </button>
      )}

      {!hasMore && <p className="text-white text-xl m-3">No more users</p>}
    </div>
  );
};

type GameProps ={
  game:any
}

const Game = ({game}:GameProps)=>{
  
  function onViewProfile(id:string): void {
    console.log(id);
    
  window.location.href = `/game/${id}`    
  }
return (
<div key={game.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-bold">Game ID: {game.id}</p>
              <p>Status: {game.status}</p>
              <p>Outcome: {game.gameOutCome}</p>
              <p className="font-semibold cursor-pointer inline text-yellow-600 hover:underline" onClick={() => onViewProfile(game.id)}>Game Report</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Start Time: {new Date(game.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                End Time: {new Date(game.endTime).toLocaleString()}
              </p>
              <p>Result: {game.result}</p>
              <p>Stake: ${game.stake}</p>
              
            </div>
          </div>
        </div>
)
}
