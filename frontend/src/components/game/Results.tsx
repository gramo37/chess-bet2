import { ACCEPT_DRAW, DRAW } from "../../constants";
import { useGameStore } from "../../contexts/game.context";
import PopUp from "../popup";

export default function Results(props: { loading: boolean }) {
  const { loading } = props;
  const { color, result } = useGameStore(["color", "result"]);
  return (
    <div>
      <p className="text-center text-gray-400">
        {[DRAW, ACCEPT_DRAW].includes(result?.gameResult ?? "") &&
           <PopUp  title="Game is Drawn"/>}
      </p>
      {![DRAW, ACCEPT_DRAW].includes(result?.gameResult ?? "") && result && (
        <p className="text-center text-gray-400">
          {result.winner === color ?  <PopUp  title="You Won"/> : <PopUp title="You lose"/>}
        </p>
      )}
      <div className="hidden">{loading}</div>
    </div>
  );
}
