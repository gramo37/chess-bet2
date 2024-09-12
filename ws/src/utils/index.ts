import { WebSocket } from "ws";

export const broadCastMessage = (
  sockets: Array<WebSocket | null> | null,
  data: object
) => {
  if (!sockets) return;
  sockets.forEach((socket) => {
    sendMessage(socket, data);
  });
};

export const sendMessage = (socket: WebSocket | null, data: object) => {
  if (socket) socket.send(JSON.stringify(data));
};

export function isCloseTo(
  num1: number,
  num2: number,
  tolerance: number = 100
): boolean {
  const upperBound = num2 + tolerance;
  const lowerBound = num2 - tolerance;

  return num1 >= lowerBound && num1 <= upperBound;
}
