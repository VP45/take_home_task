import React, { useEffect, useState } from "react";
import { usePlayer } from "@empirica/core/player/classic/react";
import * as util from 'util';
import { Button3 } from "../components/Button3";

export function SalesResults({ roundNumber }) {
  console.log('calculating advertiser score');
  const player = usePlayer();
  const roundNumberText = 'round' + roundNumber;

  console.log("-----Player-----");
  console.log(util.inspect(player));

  const productionQuality = player.get(roundNumberText.concat("_choices"))[0];
  const advertisementQuality = player.get(roundNumberText.concat("_choices"))[1];
  const priceOfProduct = player.get(roundNumberText.concat("_choices"))[2];
  const productionCost = player.get(roundNumberText.concat("_choices"))[3];
  const imageURL = player.get(roundNumberText.concat("_choices"))[4];
  const warrants = player.get(roundNumberText.concat("_choices"))[5];

  const currentScore = player.get("score") || 0;
  let points = priceOfProduct;

  const min = 10;
  const max = 90;
  const numBuyers = Math.floor((Math.random() * (max - min) + min));

  const salesCount = numBuyers * (priceOfProduct - productionCost);
  const finalScore = currentScore + salesCount;

  function handleSubmit() {
    console.log('Moving on from results round');
    player.stage.set("submit", true);
    player.set("score", finalScore);
  }

  return (
    <div className="mt-3 sm:mt-5 p-20 flex items-center justify-between">
      <div className="w-2/3">
        <h1 className="text-3xl leading-6 font-medium text-gray-900" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap' }}>
          🛒 Sales
        </h1>
        <hr className="p-.5 border-none bg-green-600 mt-2" style={{ backgroundImage: 'linear-gradient(to right, #24C4EA, #000395)' }} />
        <div className="text-lg mt-2">
          <p className="mt-4">
            ➤ You chose to produce a <b>{productionQuality}</b> quality product.
          </p>
          <p>
            ➤ You chose to advertise it as a <b>{advertisementQuality}</b> quality product. You sold it at a price of <b>${priceOfProduct.toFixed(2)}</b>.
          </p>
          <h1 className="mt-10 text-3xl leading-6 font-medium text-gray-900" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap' }}>🔏 Warrants chosen </h1>
          <hr className="p-.5 border-none bg-green-600 mt-2" style={{ backgroundImage: 'linear-gradient(to right, #FD5A0E, #7382DF)' }} />
          <ul className="mt-4">
            {warrants && warrants.map((warrant, index) => (
              <li key={index}>
                ➤ Description: <b>{`${warrant.warrantDesc}`}</b>
                  <br/>
                  ↪ Warrant Price: <b>{`$${warrant.warrantPrice}`}</b>
                <br/><br/>
              </li>
              
            ))}
          </ul>
          <br/>
          <p>
            ℹ️ It was advertised to an audience of 100 users, and <b><em>{numBuyers}</em></b> users bought your product.
          </p>
          <p>
            💸 You earned ${priceOfProduct - productionCost} per product x {numBuyers} units sold = <b><em>{Math.ceil(salesCount)}</em></b> points in sales.
          </p><br />
          <p className="text-2xl"> • Your score for this round is: <b>{Math.ceil(salesCount)}</b> </p>
          <p className="text-2xl relative">
            • Your total score is: &nbsp; {" "}
            <span className="text-green-800">
              <b>{Math.ceil(salesCount + currentScore)}</b>
              <img
                src="https://pnghq.com/wp-content/uploads/hand-drawn-circle-png-free-png-image-downloads-95891.png"
                alt="Hand-drawn circle"
                style={{
                  width: "80px",
                  height: "80px",
                  position: "absolute",
                  top: "-23px", 
                  left: "213px", 
                }}
              />
            </span>
          </p>
          <div className="flex items-left gap-6">
          <p className="mt-10">
            Click to proceed to the next round to sell products in this marketplace ➔
          </p>
          <Button3 className="mt-8" handleClick={handleSubmit}>
            I'm done!
          </Button3>
        </div>
      </div>
      </div>
      <div className="w-1/3 mt-12">
        <img src={imageURL} alt="Toothpaste Standard" width="8000" height="800" style={{ filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3))' }} />
      </div>
    </div>
  );
}
