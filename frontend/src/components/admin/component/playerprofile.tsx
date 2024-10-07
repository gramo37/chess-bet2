import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Spinner from "../../spinner";
import  bannedUser from "../fetch/banneduser";
import  updateUser from "../fetch/updateuser";
import usePersonStore from "../../../contexts/auth";
import { useGetUser } from "../../../hooks/useGetUser";
import fetchPlayer from "../fetch/fetchplayer"

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useGetUser(); // Fetch and set the user on component mount
  const user = usePersonStore((state) => state.user);

  useEffect(() => {
    console.log(id);
    const data = async ()=>{
      try{
  setIsLoading(true)
  if(!id)throw Error("Player not found")
  const player =await fetchPlayer(id);
  setPlayer(player)
}catch(e:any){
  setError(e);
}finally{
  setIsLoading(false)
}     
    }
data();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-xl text-center text-white">{error}</p>;
  }

  if (!player) {
    return <p>Player not found</p>;
  }

  async function Edit(type: string) {
    if (!id) return;
    if (type === "suspend" || type === "active") {
      updateUser(type, id);
      return;
    }
    const a = Number(prompt(`Enter the amount you want to change ${type}:`));
    if (isNaN(a) || a < 0) {
      alert("Please enter a valid amount that is zero or greater.");
    } else {
      console.log(`You entered: ${a}`);
    }
    updateUser(type, id, a);
  }

  function onViewProfile(id:string): void {
    console.log(id);
    
  window.location.href = `/game/${id}`    
  }

   function DeleteUser() {
    if (!id) return;
  
    const confirmation = prompt("ARE YOU SURE TO BAN THIS USER PERMANENTLY? THEN TYPE 'YES'");
    if (confirmation !== 'YES') return;

    const reason = prompt("WHY DO U WANT TO PERMANENTLY BAN THIS USER?");
    if(!reason)return;
    
    bannedUser(id,reason)
  }
  

  return (
    <div className="flex flex-col relative w-full items-center p-8 min-h-screen ">
      <a className="absolute top-10 left-10 text-white" href="/dashboard">
        <IoMdArrowBack />
      </a>
      <div className="p-6 bg-gray-50 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 capitalize">
            {player.name}'s Profile
          </h1>

          {(user&&user.role==='ADMIN'&&player.status!=='BANNED')&&<div>
            {player.status === "ACTIVE" && (
              <button
                className="bg-yellow-500 rounded-lg text-white px-3 py-1 m-2"
                onClick={() => Edit("suspend")}
              >
                Suspended
              </button>
            )}
            {player.status !== "ACTIVE" && (
              <button
                className="bg-green-500 rounded-lg text-white px-3 py-1 m-2"
                onClick={() => Edit("active")}
              >
                ACTIVATE
              </button>
            )}
            {player.status!=="BANNED"&&<button className="bg-red-500 px-3 rounded-lg text-white py-1 m-2" onClick={DeleteUser}>
              BANNED
            </button>}
            
          </div>}
        </div>
<div className="flex justify-between">
  <div>

        <div className="text-gray-600 text-lg">
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {player.email}
        </div>
        <div className="text-gray-600 text-lg">
          <span className="font-semibold text-gray-700">Status:</span>{" "}
          {player.status}
        </div>
        </div><div>
        <div className="text-gray-600 text-lg ">
          <span className="font-semibold text-gray-700">Total Earnings: </span>
          {player.totalEarnings} $
        </div>
        <div className="flex gap-1 cursor-pointer items-center text-gray-600 text-lg">
          <span className="font-semibold text-gray-700">Balance:</span>{" "}
          <span className="text-green-600">${player.balance.toFixed(2)}</span>
          {user&&user.role==="ADMIN"&&<div onClick={() => Edit("balance")}>
            <MdEdit />
          </div>}
        </div>
        <div className="flex gap-1 items-center cursor-pointer text-gray-600 text-lg ">
          <span className="font-semibold text-gray-700">Rating:</span>{" "}
          <span className="text-indigo-600">{player.rating}</span>
          <div onClick={() => Edit("rating")}>
            <MdEdit />
          </div>
        </div>
        </div>
</div>

        {/* Games as White */}
        <div className="mt-6">
  <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
    Games Played
  </h2>
  {player.gamesAsWhite.length > 0 || player.gamesAsBlack.length > 0 ? (
    <ul className="space-y-2">
      {[...player.gamesAsWhite.map((game:any) => ({ ...game, color: 'White' })), 
        ...player.gamesAsBlack.map((game:any) => ({ ...game, color: 'Black' }))].map((game: any) => (
        <li
          key={game.id}
          className="bg-gray-100 p-4 flex justify-between rounded-md shadow-sm"
        ><div>

          <p className="text-gray-800">
            <span className="font-semibold">Game ID:</span> {game.id}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Result:</span>
            {game.result ? (
              game.result === 'WHITE_WINS' ? (
                <span className={game.color === 'White' ? 'text-green-500' : 'text-red-500'}>
                  {game.result} ({game.color === 'White' ? 'Won' : 'Lost'})
                </span>
              ) : game.result === 'BLACK_WINS' ? (
                <span className={game.color === 'Black' ? 'text-green-500' : 'text-red-500'}>
                  {game.result} ({game.color === 'Black' ? 'Won' : 'Lost'})
                </span>
              ) : (
                <span>{game.result}</span>
              )
            ) : (
              "N/A"
            )}
          </p>
          
          {(user && user.role === 'ADMIN') && (
            <p
              className="font-semibold cursor-pointer inline text-blue-500 hover:underline"
              onClick={() => onViewProfile(game.id)}
            >
              Game Report
            </p>
          )}
        </div>
<div>
<p className="text-gray-600">
            <span className="font-semibold">Color:</span> {game.color}
          </p>
          
          <p className="text-gray-600">
            <span className="font-semibold">Status:</span> {game.status}
          </p>
          
          <p className="text-gray-600">
            <span className="font-semibold">Stake:</span> {game.stake}
          </p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No games played as White or Black player.</p>
  )}
</div>

        {/* Transactions */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600">
            Transactions
          </h2>
          {player.transactions.length > 0 ? (
            <ul className="space-y-2">
              {player.transactions.map((transaction: any) => (
                <li
                  key={transaction.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <p className="text-gray-800">
                    <span className="font-semibold">Transaction ID:</span>
                    {transaction.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> {transaction.currency + " "+ transaction.amount.toFixed(2)} 
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span>{" "}
                    {transaction.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No transactions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
