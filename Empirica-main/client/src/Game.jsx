import { Chat, useGame } from "@empirica/core/player/classic/react";
import React, { useState } from "react";

// import { Profile } from "./Profile";
import { Stage } from "./Stage";
import Drawer from "./components/Drawer";

export function Game() {
  const game = useGame();
  const { playerCount } = game.get("treatment");

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatDrawer = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative h-full w-full flex bg-gradient-to-r from-yellow-100 to-pink-100 justify-center">
      {/* <div className="h-full w-full md:w-[80vw] md:h-[80vh] flex flex-col"> */}
        {/* <Profile /> */}
        <div className="h-max">
          <Stage />
        </div>
      {/* </div> */}

      {playerCount > 1 && (
        <div className="absolute bottom-4 right-4">
          <button title="Open Chat" className="h-[60px] w-[60px] p-4 place-self-end rounded-lg motion-reduce:animate-bounce hover:animate-none mr-2 hover:mb-2 border-2 border-indigo-400" onClick={toggleChatDrawer}><img width="80" height="80" src="https://img.icons8.com/officel/80/chat.png" alt="chat" /></button>
          <Drawer isOpen={isChatOpen} callback={toggleChatDrawer} position="right">
            <Chat scope={game} attribute="chat" />
          </Drawer>
        </div>
      )}
    </div>
  );
}
