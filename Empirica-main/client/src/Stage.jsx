import {
  usePlayer,
  usePlayers,
  useRound,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React, { useState } from "react";
import { Advertisement } from "./examples/Advertise";
import { SalesResults } from "./examples/Results";
import { Profile } from "./Profile";
import products from "../data.json";

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();

  const [randomProduct, setRandomProduct] = useState(getRandomProduct());

  function getRandomProduct() {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }

  const taskMap = {
    advertise: 1,
    results: 1,
    advertise2: 2,
    results2: 2,
    advertise3: 3,
    results3: 3,
    advertise4: 4,
    results4: 4,
  };

  const task = round.get("task");
  const roundNumber = taskMap[task];

  if (roundNumber !== undefined) {
    switch (task) {
      case "advertise":
      case "advertise2":
      case "advertise3":
      case "advertise4":
        return (
          <div className="pt-2 flex flex-col justify-center">
            <div className="h-full w-full md:w-[80vw] md:h-[80vh] flex flex-col">
              <Profile productName={randomProduct.name} />
            </div>
            <div className="mt-32">
              <Advertisement roundNumber={roundNumber} selectedProduct={randomProduct} />
            </div>
          </div>
        );
      case "results":
      case "results2":
      case "results3":
      case "results4":
        return <SalesResults roundNumber={roundNumber} />;
      default:
        return null;
    }
  }

  return <div>Unknown task</div>;
}
