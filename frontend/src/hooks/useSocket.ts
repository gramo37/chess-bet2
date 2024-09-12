import { useEffect } from "react";
import { WS_URL } from "../constants/routes";
import { usePersonStore } from "../contexts/auth";
import { useGameStore } from "../contexts/game.context";

export const useInitSocket = () => {
  const user = usePersonStore((state) => state.user);
  const { setSocket, stake, type, gameId } = useGameStore(["setSocket", "stake", "type", "gameId"]);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${user?.token}&type=${"random"}&stake=${"10"}`);
    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [setSocket, user?.token]);
};
