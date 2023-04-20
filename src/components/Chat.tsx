import { useEffect, useState } from "react";
import clsx from "clsx";
import { Message, Mode } from "../App";
import { socket } from "../socket";
import { format } from "date-fns";

type ChatProps = {
  onlineMember: number;
  handleMode: (v: Mode) => void;
};

const Chat = (props: ChatProps) => {
  const { onlineMember } = props;
  const nickname = localStorage.getItem("nickname")!;

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessage, setChatMessage] = useState<string>("");

  const handleSendMessage = () => {
    const message: Message = {
      id: socket.id,
      message: chatMessage,
      name: nickname,
      date: new Date(),
    };

    socket.emit("message", message);
    setMessages((prev) => [...prev, message]);
    setChatMessage("");
  };

  useEffect(() => {
    socket.on("emit-messages", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("emit-messages");
    };
  }, [messages]);

  return (
    <>
      <h1 className="text-3xl s">
        {`Welcome ${nickname} `}
        <span
          className="text-sm text-gray-400 cursor-pointer font-serif"
          onClick={() => props.handleMode("nickname")}
        >
          edit nickname
        </span>
      </h1>
      <div className="bg-slate-200 flex flex-col justify-between h-full w-full max-h-[70vh] max-w-lg rounded-md p-3">
        <ul className="display flex flex-col gap-2 max-h-[60vh] overflow-scroll">
          {messages.map((message, i) => {
            const isSender = socket.id === message.id;

            return (
              <li
                key={i}
                className={clsx(
                  "bg-slate-300 w-fit p-2 rounded-xl rounded-es-none",
                  !isSender &&
                    "!bg-slate-400 !self-end rounded-es-xl !rounded-ee-none"
                )}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xl">{message.message}</span>
                  <span className="text-[12px] text-gray-700">{`${
                    isSender ? "You" : message.name
                  }: ${format(
                    new Date(message.date),
                    "EE dd MMMM hh:mm a"
                  )}`}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-2">
          <input
            className="w-full h-10 p-2 rounded-md"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value || "")}
          />
          <button
            className="btn-primary"
            disabled={!chatMessage}
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <h4>{`Online Member: ${onlineMember}`}</h4>
    </>
  );
};

export default Chat;
