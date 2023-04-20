import { useEffect, useState } from "react";
import { Mode } from "../App";

type NicknameProps = {
  handleMode: (v: Mode) => void;
};

const Nickname = (props: NicknameProps) => {
  const [nickname, setNickname] = useState<string>("");

  const handleSubmitNickname = () => {
    localStorage.setItem("nickname", nickname);
    props.handleMode("chat");
  };

  useEffect(() => {
    setNickname(localStorage.getItem("nickname") ?? "");
  }, []);

  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-3xl">Enter your nickname</h1>
      <div className="flex flex-col p-3 rounded-lg gap-2 bg-slate-200 w-full max-w-xs">
        <input
          className="w-full h-12 p-2 rounded-md bg-slate-300"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button
          className="btn-primary"
          onClick={handleSubmitNickname}
          disabled={!nickname}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Nickname;
