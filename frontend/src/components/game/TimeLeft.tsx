import { useGameStore } from "../../contexts/game.context";

export default function TimeLeft(props: { timeLeft: string }) {
  const { timeLeft } = props;
  const { opponent } = useGameStore(["opponent"]);

  return (
    <div className="mb-4 text-center">
      <h2 className="text-xl font-bold text-gray-300">
        {opponent?.name ?? ""}
      </h2>
      <p className="text-gray-400">Time left: {timeLeft}</p>
    </div>
  );
}
