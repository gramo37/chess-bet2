import { useEffect, useState } from "react";
import { WS_URL } from "../constants/routes";
import usePersonStore from "../contexts/auth";
import { useGameStore } from "../contexts/game.context";
import {
  ACCEPT_DRAW,
  ENDGAME,
  GAMEABORTED,
  GAMEOVER,
  GAMERESTARTED,
  GAMESTARTED,
  GET_TIME,
  GETFRIENDLYMATCHID,
  INVALID_MOVE,
  MOVESUCCESS,
  OFFER_DRAW,
  REJECT_DRAW,
  RESTART_SERVER,
  SEND_MESSAGE,
  SHOW_ERROR,
} from "../constants";
import { Chess } from "chess.js";
import useTimer from "./useTimer";
import { useGlobalStore } from "../contexts/global.context";

export const useInitSocket = () => {
  const { user, isVirtualAccount } = usePersonStore();
  const { setSocket, stake, type, gameId, gameTime } = useGameStore([
    "setSocket",
    "stake",
    "type",
    "gameId",
    "gameTime",
  ]);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=${user?.token}&type=${type}&stake=${stake}&gameId=${gameId}&gameTime=${gameTime}&isVirtual=${isVirtualAccount}`
    );
    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [gameId, gameTime, setSocket, stake, type, user?.token, isVirtualAccount]);
};

export const useSocketHandler = () => {
  const {
    setBoard,
    setMoves,
    setSans,
    setColor,
    setResult,
    setIsGameStarted,
    socket,
    setOpponent,
    setPlayer,
  } = useGameStore([
    "board",
    "setBoard",
    "isGameStarted",
    "setIsGameStarted",
    "setMoves",
    "setSans",
    "color",
    "setColor",
    "result",
    "setResult",
    "socket",
    "opponent",
    "setOpponent",
    "player",
    "setPlayer",
  ]);

  const [message, setMessage] = useState("");
  const [localGameId, setGameIdLocally] = useState("");
  const [loading, setLoading] = useState(false);
  const { alertPopUp } = useGlobalStore(["alertPopUp"]);
  const {
    timeLeft: player1timeLeft,
    start: startPlayer1Timer,
    stop: stopPlayer1Timer,
    setTimeLeft: setPlayer1TimeLeft,
  } = useTimer();
  const {
    timeLeft: player2timeLeft,
    start: startPlayer2Timer,
    stop: stopPlayer2Timer,
    setTimeLeft: setPlayer2TimeLeft,
  } = useTimer();

  const acceptDraw = () => {
    socket?.send(
      JSON.stringify({
        type: ENDGAME,
        payload: {
          status: ACCEPT_DRAW,
        },
      })
    );
  };

  const rejectDraw = () => {
    socket?.send(
      JSON.stringify({
        type: REJECT_DRAW,
      })
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === MOVESUCCESS) {
        setBoard(message.payload.board);
        setMoves(message.payload.moves);
        setSans(message.payload.sans);
        setLoading(false);
        const chess = new Chess(message.payload.board);
        if (chess.turn() === "w") {
          startPlayer1Timer(message.payload.player1TimeLeft);
          stopPlayer2Timer();
        } else {
          startPlayer2Timer(message.payload.player2TimeLeft);
          stopPlayer1Timer();
        }
      } else if (message.type === GAMESTARTED) {
        setColor(message.payload.color);
        setBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        setOpponent(message.payload.opponent);
        setPlayer(message.payload.player);
        startPlayer1Timer(message.payload.player1TimeLeft);
      } else if (message.type === GAMEOVER) {
        setMoves([]);
        setResult({
          winner: message.payload.winner?.color,
          loser: message.payload.loser?.color,
          gameResult: message.payload?.result,
        });
        setIsGameStarted(false);
        setLoading(false);
        stopPlayer1Timer();
        stopPlayer2Timer();
        // queryClient.invalidateQueries({ queryKey: ["myGames"] });
      } else if (message.type === GAMERESTARTED) {
        setBoard(message.payload.board);
        setMoves(message.payload.moves);
        setSans(message.payload.sans);
        setColor(message.payload.color);
        setOpponent(message.payload.opponent);
        setPlayer(message.payload.player);
        const chess = new Chess(message.payload.board);
        if (chess.turn() === "w") {
          startPlayer1Timer(message.payload.player1TimeLeft);
        } else {
          startPlayer2Timer(message.payload.player2TimeLeft);
        }
      } else if (message.type === OFFER_DRAW) {
        alertPopUp({
          message: "Draw Request",
          type: "confirm",
          showPopUp: true,
          body: (
            <div className="p-2">
              Opponent wants a draw. Do you want to draw ?
            </div>
          ),
          success: acceptDraw,
          failure: rejectDraw,
        });
      } else if (message.type === REJECT_DRAW) {
        alertPopUp({
          message: "Draw Rejected",
          type: "info",
          showPopUp: true,
          body: <div className="p-2">Opponent rejected the offer of draw</div>,
        });
      } else if (message.type === INVALID_MOVE) {
        console.log("Invalid move");
        setLoading(false);
        alertPopUp({
          message: message.payload.message ?? "Something went wrong",
          type: "error",
          showPopUp: true,
        });
      } else if (message.type === GAMEABORTED) {
        setIsGameStarted(false);
      } else if (message.type === GET_TIME) {
        setPlayer1TimeLeft(message.payload.player1TimeLeft);
        setPlayer2TimeLeft(message.payload.player2TimeLeft);
      } else if (message.type === GETFRIENDLYMATCHID) {
        setGameIdLocally(message.payload.gameId);
      } else if (message.type === SEND_MESSAGE) {
        console.log(message.payload.message);
        setMessage(message.payload.message);
      } else if (message.type === SHOW_ERROR) {
        alertPopUp({
          message: message.payload.message ?? "Something went wrong",
          type: "error",
          showPopUp: true,
        });
      } else if (message.type === RESTART_SERVER) {
        alert(
          "Server has restarted. Restarting the browser in 5 secs. Kindly click on play game to restart your game!"
        );
        setTimeout(() => {
          window.location.reload();
        }, 5000);
        window.location.reload();
      }
    };
    return () => {
      socket.onmessage = null;
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoard, setColor, setIsGameStarted, setMoves, setResult, socket]);

  return {
    loading,
    setLoading,
    message,
    setMessage,
    localGameId,
    player1timeLeft,
    player2timeLeft,
  };
};
