import { useGameStore } from "../../../contexts/game.context";

const MainOptions = () => {
  const { type, setType, setGameId } = useGameStore([
    "type",
    "setType",
    "setGameId",
  ]);
  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => setType("friend")}
          className={`btn m-2 p-2 ${
            type === "friend" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Friendly Match
        </button>
        <button
          onClick={() => {
            setType("random");
            setGameId("");
          }}
          className={`btn m-2 p-2 ${
            type === "random" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Play Random
        </button>
        <button
          onClick={() => {
            setType("lobby");
            setGameId("");
          }}
          className={`btn m-2 p-2 ${
            type === "lobby" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Choose your opponent
        </button>
      </div>
    </>
  );
};

export default MainOptions;
