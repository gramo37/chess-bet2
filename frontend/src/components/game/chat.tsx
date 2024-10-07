import { useEffect, useState } from "react";
import { useGameStore } from "../../contexts/game.context";
import { SEND_MESSAGE } from "../../constants";

interface ChatContainerProps {
  message: string;
}

export default function ChatContainer({ message }: ChatContainerProps) {
  const { socket } = useGameStore(["socket"]);
  const [input, setInput] = useState("");

  const { isGameStarted } = useGameStore(["isGameStarted"]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !input.trim()) return;

    socket.send(
      JSON.stringify({
        type: SEND_MESSAGE,
        payload: { message: input },
      })
    );

    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.innerHTML += `<div class="bg-white p-1">${input}</div>`;
    }

    setInput("");
  };

  useEffect(() => {
    if (message) {
      const messageContainer = document.getElementById("message-container");
      if (messageContainer) {
        messageContainer.innerHTML += `<div class="bg-gray-300 p-1">${message}</div>`;
      }
    }
  }, [message]);

  if (!isGameStarted) return null;

  return (
    <div className="relative min-h-80 w-full mt-4 bg-gray-400">
      <div
        id="message-container"
        className="h-[85%] max-w-[1200px] overflow-y-auto"
      >
        <div className="bg-gray-300 p-1"></div>
        <div className="bg-white p-1"></div>
      </div>

      <form
        id="send-container"
        className="absolute h-[15%] bottom-0 w-full flex justify-between"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Type your message"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
