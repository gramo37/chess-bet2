import { useEffect, useRef } from "react";
import { GET_TIME, RESIGN } from "../constants";
import { useGameStore } from "../contexts/game.context";

export const useGameLogic = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isGameStarted, color, result, socket } = useGameStore([
    "isGameStarted",
    "color",
    "result",
    "socket",
  ]);

  useEffect(() => {
    if (result?.gameResult === RESIGN && result.winner === color) {
      alert("Congrats. You Won. Opponent has resigned");
    } else if (["DRAW", "ACCEPT_DRAW"].includes(result?.gameResult ?? "")) {
      alert("Game is Drawn!");
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
