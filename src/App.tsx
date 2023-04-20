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

export type Mode = "nickname" | "chat";

function App() {
  const [mode, setMode] = useState<Mode>("nickname");
  const [onlineMember, setOnlineMember] = useState<number>(0);

  useEffect(() => {
    socket.on("online-member", (data: number) => {
      setOnlineMember(data);
    });

    if (localStorage.getItem("sender-name")) {
      setMode("chat");
    }

    return () => {
      socket.off("online-member");
    };
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-9">
      {mode === "nickname" && <Nickname handleMode={(m) => setMode(m)} />}

      {mode === "chat" && (
        <Chat onlineMember={onlineMember} handleMode={(m) => setMode(m)} />
      )}
    </div>
  );
}

export default App;
