import { useEffect, useState } from "react";
import { socket } from "./socket";
import Nickname from "./components/Nickname";
import Chat from "./components/Chat";

export type Message = {
  id: string;
  message: string;
  name: string;
  date: Date;
};

export type Mode = "connect" | "nickname" | "chat";

function App() {
  const [mode, setMode] = useState<Mode>("connect");
  const [onlineMember, setOnlineMember] = useState<number>(0);

  useEffect(() => {
    const nickname = localStorage.getItem("nickname");
    function onConnect() {
      setMode(nickname ? "chat" : "nickname");
    }

    function onDisconnect() {
      setMode("connect");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("online-member", (data: number) => {
      setOnlineMember(data);
    });

    return () => {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.off("online-member");
    };
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-9">
      {mode === "connect" && <div>Connecting...</div>}

      {mode === "nickname" && <Nickname handleMode={(m) => setMode(m)} />}

      {mode === "chat" && (
        <Chat onlineMember={onlineMember} handleMode={(m) => setMode(m)} />
      )}
    </div>
  );
}

export default App;
