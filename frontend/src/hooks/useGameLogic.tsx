import { useEffect, useRef } from "react";
import { CHECKMATE, GET_TIME, RESIGN } from "../constants";
import { useGameStore } from "../contexts/game.context";
import { useGlobalStore } from "../contexts/global.context";

export const useGameLogic = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isGameStarted, color, result, socket } = useGameStore([
    "isGameStarted",
    "color",
    "result",
    "socket",
  ]);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);

  useEffect(() => {
    if (result?.gameResult === CHECKMATE) {
      alertPopUp({
        message:
          result.winner === color
            ? "Congrats. You Won by checkmate"
            : "You lose by Checkmate",
        type: "success",
        showPopUp: true,
      });
    } else if (result?.gameResult === RESIGN) {
      alertPopUp({
        message:
          result.winner === color
            ? "Congrats. You Won! Opponent has resigned"
            : "You Lose by resignation",
        type: "success",
        showPopUp: true,
      });
    } else if (["DRAW", "ACCEPT_DRAW"].includes(result?.gameResult ?? "")) {
      alertPopUp({
        message: "Game is Drawn",
        type: "success",
        showPopUp: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted, result]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!socket) return;
      socket.send(
        JSON.stringify({
          type: GET_TIME,
        })
      );
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [socket]);
};
