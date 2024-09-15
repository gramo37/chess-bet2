import { ACCEPT_DRAW, DRAW } from "../../constants";
import { useGameStore } from "../../contexts/game.context";

export default function Results(props: { loading: boolean }) {
  const { loading } = props;
  const { color, result } = useGameStore(["color", "result"]);
  return (
    <div>
      <p className="text-center text-gray-400">
        {[DRAW, ACCEPT_DRAW].includes(result?.gameResult ?? "") &&
          "Game is Drawn"}
      </p>
      {![DRAW, ACCEPT_DRAW].includes(result?.gameResult ?? "") && result && (
        <p className="text-center text-gray-400">
          {result.winner === color ? "You Won" : "You Lose"}
        </p>
      )}
      <div className="hidden">{loading}</div>
    </div>
  );
}
