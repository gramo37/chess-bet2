import { useGameStore } from "../contexts/game.context";

const Abondon = ({ timeLeft }: { timeLeft: number }) => {
  const { color, moves, isGameStarted } = useGameStore([
    "color",
    "moves",
    "isGameStarted",
  ]);

  if (!isGameStarted || timeLeft < 0) return null;
  return (
    <>
      {color === "white" && moves.length === 0 && (
        <p className="text-white">Game will be abandoned in {timeLeft} secs</p>
      )}
      {color === "black" && moves.length === 1 && (
        <p className="text-white">Game will be abandoned in {timeLeft} secs</p>
      )}
    </>
  );
};

export default Abondon;
