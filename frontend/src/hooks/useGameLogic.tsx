import { useEffect, useRef } from "react";
import {
  ABANDON,
  CHECKMATE,
  GET_TIME,
  RESIGN,
  TIMER_EXPIRED,
} from "../constants";
import { useGameStore } from "../contexts/game.context";
import { useGlobalStore } from "../contexts/global.context";
import { useQueryClient } from "@tanstack/react-query";

export const useGameLogic = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isGameStarted, color, result, socket } = useGameStore([
    "isGameStarted",
    "color",
    "result",
    "socket",
  ]);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const qc = useQueryClient();

  useEffect(() => {
    console.log(result);
    if (result?.gameResult === CHECKMATE) {
      alertPopUp({
        message: "Game Over!",
        type: "success",
        showPopUp: true,
        body: (
          <div className="p-2">
            {result.winner === color
              ? "Congrats. You Won by checkmate"
              : "You lose by Checkmate"}
          </div>
        ),
      });
    } else if (result?.gameResult === RESIGN) {
      alertPopUp({
        message: "Game Over!",
        type: "success",
        showPopUp: true,
        body: (
          <div className="p-2">
            {result.winner === color
              ? "Congrats. You Won! Opponent has resigned"
              : "You Lose by resignation"}
          </div>
        ),
      });
    } else if (result?.gameResult === TIMER_EXPIRED) {
      alertPopUp({
        message: "Game Over!",
        type: "success",
        showPopUp: true,
        body: (
          <div className="p-2">
            {result.winner === color
              ? "Congrats. You Won! Opponents Timeout"
              : "You Lose by Timeout"}
          </div>
        ),
      });
    } else if (result?.gameResult === ABANDON) {
      alertPopUp({
        message: "Game Abandoned",
        type: "success",
        showPopUp: true,
        body: (
          <div className="p-2">
            Game has been Abandoned because of no activity
          </div>
        ),
      });
    } else if (["DRAW", "ACCEPT_DRAW"].includes(result?.gameResult ?? "")) {
      alertPopUp({
        message: "Thats a Tie",
        type: "success",
        showPopUp: true,
        body: <div className="p-2">Game is Drawn</div>,
      });
    }
    qc.invalidateQueries({
      queryKey: ["UserDetails"],
    });
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
