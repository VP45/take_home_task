import {
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Button3 } from "../components/Button3";
import { Button4 } from "../components/Button4";
import { Modal } from "../components/Modal";
import "@empirica/core/player/classic/react";

export function Advertisement({ roundNumber, selectedProduct }) {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const roundNumberText = 'round' + roundNumber;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);

  const [selectedWarrants, setSelectedWarrants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWarrantAddition = () => {
      setIsModalOpen(true);
      console.log("warrant opened");
  };

  const handleNextPage = () => {
      setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
      setCurrentPage(currentPage - 1);
  };

  const onWarrantAddition = () => {
      setIsModalOpen(true);
  };

  //console.log('roundNumberText', roundNumberText);
  function handleChange() {
      // console.log("something happened");
  }
  function handleSubmit() {
      // console.log("Player.stage set to true");

      player.set(roundNumberText.concat("_choices"),
          [player.round.get("productionQuality"),
          player.round.get("advertisementQuality"),
          player.round.get("priceOfProduct"),
          player.round.get("productionCost"),
          player.round.get("imageURL"),
          player.round.get("warrants")])

      player.stage.set("submit", true);
  }

  const onWarrantSelection = (e, price, description) => {
      if (selectedWarrants.includes(price)) {
          onWarrantDeselection(e, price, description);
      } else {
          setSelectedWarrants((prevSelected) => [...prevSelected, price]);
          handleWarrantSelection(e, price);
          handleWarrantUpdate(e, description, price);
      }
  };

  const onWarrantDeselection = (e, price, description) => {
      setSelectedWarrants((prevSelected) =>
          prevSelected.filter((selectedPrice) => selectedPrice !== price)
      );
      handleWarrantDeselection(e, price);
      handleWarrantDeupdate(e, description, price);
  };

  const handleWarrantUpdate = (e, warrantDesc, warrantPrice) => {
      const warrantarr = player.round.get("warrants") || [];
      warrantarr.push({ warrantDesc, warrantPrice });
      player.round.set("warrants", warrantarr);
  };

  const handleWarrantSelection = (e, warrantCost) => {
      let sum = parseFloat(
          parseFloat(player.round.get("priceOfProduct")) + parseFloat(warrantCost)
      );
      player.round.set("priceOfProduct", sum);
      // console.log("Saved warranted priceOfProduct to player.round object: ", sum);
  };

  const handleWarrantDeselection = (e, warrantCost) => {
      let diff = parseFloat(
          parseFloat(player.round.get("priceOfProduct")) - parseFloat(warrantCost)
      );
      player.round.set("priceOfProduct", diff);
      // console.log("Updated priceOfProduct after warrant deselection: ", diff);
  };

  const handleWarrantDeupdate = (e, warrantDesc, warrantPrice) => {
      const warrantarr = player.round.get("warrants") || [];
      const updatedWarrants = warrantarr.filter(
          (warrant) =>
              warrant.warrantDesc !== warrantDesc || warrant.warrantPrice !== warrantPrice
      );
      player.round.set("warrants", updatedWarrants);
  };

  function handleProductionChoice(e, productionQuality, cost) {
      const { low, high } = selectedProduct;
      setSelectedQuality(productionQuality);
      setSelectedPrice(cost);
      player.round.set("productionQuality", productionQuality);
      if (player.round.get("productionQuality") === "low") { player.round.set("productionCost", low.price) }
      if (player.round.get("productionQuality") === "high") { player.round.set("productionCost", high.price) }
      // console.log("Saved production quality to player.round object: ", productionQuality);
      // console.log("Saved production cost to player.round object: ", player.round.get("productionCost"));
  }

  function handleImageURL(e, imgURL) {
      player.round.set("imageURL", imgURL);
      // console.log("Image URL is set for ", player.round.get("productionQuality"))
  }

  function handleAdvertisementChoice(e, advertisementQuality) {
      player.round.set("advertisementQuality", advertisementQuality);
      // console.log("Saved advertisement quality to player.round object: ", advertisementQuality);
  }

  function handlePriceChoice(e, priceOfProduct) {
      player.round.set("priceOfProduct", priceOfProduct);
      // console.log("Saved priceOfProduct to player.round object: ", priceOfProduct);
  }

  let product = {};

  const isResultStage = stage.get("name") === "result";

  if (players.length > 1) {
      product = (
          <div className="grid grid-cols-2 items-center">
              {product}
              <div>
                  {isResultStage ? (
                      <>
                          <div className="text-gray-500 text-2xl">You</div>
                          <div className="border-b-3 border-blue-500/50 pb-2 mb-8">
                              {PlayerScore(player, () => { }, isResultStage)}
                          </div>
                      </>
                  ) : null}
                  {players
                      .filter((p) => p.id !== player.id)
                      .map((p) => PlayerScore(p, handleChange, isResultStage))}
              </div>
          </div>
      );
  } else if (players.length == 1 && isResultStage) {
      product = (
          <div className="grid grid-cols-2 items-center">
              {product}
              <div>
                  {isResultStage ? PlayerScore(player, () => { }, isResultStage) : null}
              </div>
          </div>
      );
  }

  return (
      <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
          {currentPage === 1 && (
              <Part1
                  selectedProduct={selectedProduct}
                  onProductionChoice={handleProductionChoice}
                  onImageChoice={handleImageURL}
                  onNextPage={handleNextPage}
                  player={player}
              />
          )}
          {currentPage === 2 && (
              <Part2
                  selectedProduct={selectedProduct}
                  selectedQuality={selectedQuality}
                  onAdvertisementChoice={handleAdvertisementChoice}
                  onPriceChoice={handlePriceChoice}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  player={player}
              />
          )}
          {currentPage === 3 && (
              <Part3
                  player={player}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  selectedProduct={selectedProduct}
                  selectedQuality={selectedQuality}
                  selectedPrice={selectedPrice}
                  onPriceChoice={handlePriceChoice}
                  onWarrantAddition={handleWarrantAddition}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  onWarrantSelection={onWarrantSelection}
                  handleSubmit={handleSubmit}
                  onWarrantUpdate={handleWarrantUpdate}
              />
          )}
      </div>
  );
}

function NextRoundButton({ on_button_click }) {
  return (
      <Button3 handleClick={on_button_click}> Go to market (next round) &nbsp; →</Button3>
  )
}

function ProductionAlternative({ title, imageUrl, cost, quality, on_button_click, category }) {
  const qualityClass = quality === "low" ? "bg-orange-500" : "bg-green-500";
  return (
      <div className="p-4 h-75 w-75">
          <img
              src={imageUrl}
              alt={title}
              style={{ filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3))' }}
              className="mb-4"
          />
          <h1 className="flex justify-center font-bold">{title}</h1>
          <h2 className={`flex justify-center text-white rounded-lg pl-2 pr-2 pt-1 pb-1 ${qualityClass}`}>
              <em>{quality} quality — {category}</em>
          </h2>
          <div className="pt-2">
              <Button handleClick={on_button_click} adQuality={quality} primary>
                  💸 Produce this quality at a cost of ${cost} per unit
              </Button>
          </div>
      </div>
  );
}

function AdvertisementAlternative({ title, imageUrl, quality, on_button_click }) {
  const qualityClass = quality === "low" ? "bg-orange-500" : "bg-teal-500";
  return (
      <div className="h-75 w-64 pb-6 mt-6">
          <img
              src={imageUrl}
              alt={title}
              style={{ filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.3))' }}
              className="mb-4"
          />
          <br />
          <div className="flex justify-center">
              <h2 className={`flex justify-center text-white rounded-lg pl-2 pr-2 pt-1 pb-1 ${qualityClass}`}>
                  <b><em>{title}</em></b>
              </h2>
          </div>
          <div className="pt-2 flex justify-center">
              <Button handleClick={on_button_click} adQuality={quality} primary>
                  📣 Advertise as {quality} quality
              </Button>
          </div>
      </div>
  );
}

function PriceButton({ text, price, on_button_click }) {
  return (
      <Button handleClick={on_button_click} >
          🏷️ Sell my product for {text}
      </Button>
  )
}

function PlayerScore(player, onChange, isResultStage) {
  return (
      <div key={player.id} className="py-4">
          <div className="flex items-center space-x-6">
              <div className="h-12 w-12 shrink-0">
                  <Avatar player={player} />
              </div>

              {isResultStage ? (
                  <div className="flex flex-col items-center space-y-0.5">
                      <div className="text-2xl font-semibold leading-none font-mono">
                          {player.round.get("score") || 0}
                      </div>
                      <h1 className="text-xs font-semibold uppercase tracking-wider leading-none text-gray-400">
                          Score
                      </h1>
                  </div>
              ) : null}
          </div>
      </div>
  );
}


function ProfitMarginCalculation({ producerPlayer }) {
  let profit = producerPlayer.round.get("priceOfProduct") - producerPlayer.round.get("productionCost")
  return (
      <div className="mt-8">
          <p className="mb-4">✅ Your current choice is to sell at a price of: <b>$ {producerPlayer.round.get("priceOfProduct")} </b></p>
          <p className="mb-4">ℹ️ You have chosen to produce <b>{producerPlayer.round.get("productionQuality")}</b> quality product and advertise it as <b>{producerPlayer.round.get("advertisementQuality")}</b> quality product at a <b>price of ${producerPlayer.round.get("productionCost")}</b>.</p>
          <p className="mb-4">📈 This gives a <b>profit of  ${Math.ceil(profit.toFixed(2))}</b> per product sold.</p>

      </div>
  )
}

// Part 1 Component
function Part1({ selectedProduct, onProductionChoice, onImageChoice, onNextPage, player }) {
  const { low, high } = selectedProduct;

  return (
      <div className="flex flex-col -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative">

          <h1 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap', textAlign: 'center' }}>
              You are the producer of <b>{selectedProduct.name}</b>{" "}
          </h1>


          <h1 className="flex justify-center mb-4">You will now decide what to produce, how to advertise it, and the price.</h1>

          <div className="flex justify-center space-x-4 h-full">
              <ProductionAlternative
                  title={`Standard ${selectedProduct.name}`}
                  cost={low.price}
                  quality="low"
                  imageUrl={low.image}
                  category={selectedProduct.category}
                  on_button_click={(e) => { onProductionChoice(e, "low", `${low.price}`); onImageChoice(e, `${low.image}`) }}
              />
              <ProductionAlternative
                  title={`Amazing ${selectedProduct.name}`}
                  cost={high.price}
                  quality="high"
                  imageUrl={high.image}
                  category={selectedProduct.category}
                  on_button_click={(e) => { onProductionChoice(e, "high", `${high.price}`); onImageChoice(e, `${high.image}`) }}
              />
          </div>

          <div className="flex justify-center mt-40">
              <Button3 disabled={!player.round.get("productionQuality")} handleClick={onNextPage}>Continue &nbsp; →</Button3>
          </div>
          <div className="flex justify-center mt-6">
              <h1>💡 <b>NOTE:</b> If no option is chosen, the value is treated as undefined by default.</h1>
          </div>
      </div>
  );
}

// Part 2 Component
function Part2({
  selectedProduct,
  selectedQuality,
  onAdvertisementChoice,
  onPriceChoice,
  onNextPage,
  onPreviousPage,
}) {
  const { low, high } = selectedProduct;
  return (
      <div className="flex flex-col -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative p-10">
          <h1 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap', textAlign: 'center' }}>
              <b>Choose how you want to Advertise</b>{" "}
          </h1>
          <div className="flex justify-center space-x-4 h-full">
              <AdvertisementAlternative
                  title={`Standard ${selectedQuality} quality`}
                  quality="low"
                  imageUrl={low.image}
                  on_button_click={(e) => onAdvertisementChoice(e, "low")}
              />
              <AdvertisementAlternative
                  title={`Amazing ${selectedQuality} quality`}
                  quality="high"
                  imageUrl={high.image}
                  on_button_click={(e) => onAdvertisementChoice(e, "high")}
              />
          </div>

          <div className="flex justify-between mt-32 items-center">
              <Button3 handleClick={onPreviousPage} primary>← &nbsp; Back</Button3>
              <Button3 handleClick={onNextPage}>Continue &nbsp; →</Button3>
          </div>
          <div className="flex justify-center mt-8">
              <h1>💡 <b>NOTE:</b> If no option is chosen, the value is treated as undefined by default.</h1>
          </div>
      </div>
  );
}

// Part 3 Component
function Part3({
  player,
  setIsModalOpen,
  isModalOpen,
  selectedProduct,
  onPriceChoice,
  onWarrantAddition,
  onPreviousPage,
  onWarrantSelection,
  handleSubmit
}) {

  const { low, high, warrants } = selectedProduct;
  const initialSelectedCards = player.round.get("warrants") || [];
  const [selectedCards, setSelectedCards] = useState(initialSelectedCards);

  const isSelected = (index) => selectedCards.includes(index);

  const toggleSelection = (index) => {
      setSelectedCards((prevSelected) => {
          const newSelected = prevSelected.includes(index)
              ? prevSelected.filter((selectedIndex) => selectedIndex !== index)
              : [...prevSelected, index];
          return newSelected;
      });
  };

  const selectedCardStyle = {
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      borderRadius: "6px",
      padding: "10px",
  }

  return (
      <div className="flex flex-col gap-2 -top-6 justify-center border-3 border-indigo-800 p-6 rounded-lg h-full shadow-md relative p-10">
          <h1 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-teal-600 pl-2 pr-2 rounded-lg text-lg mb-4" style={{ fontFamily: "'Archivo', sans-serif", whiteSpace: 'nowrap', textAlign: 'center' }}>
              <b>Choose your product price.</b>
          </h1>

          <div className="flex justify-center mt-6 mb-6 space-x-4 h-full">
              <div>
                  <p className="mb-2">A typical price for <b>low</b> quality is: ${low['price']}</p>
                  <p className="mb-2">A typical price for <b>high</b> quality is: ${high['price']}</p>
              </div>
          </div>

          <Modal isOpen={isModalOpen} 
                 onClose={() => {
                 setIsModalOpen(false);
                 setSelectedCards(initialSelectedCards.map((_, index) => index));
                 }} 
                  title="Warrant" children={
              <>
                  {Array.isArray(warrants) && warrants.length > 0 && (
                      <div className="flex justify-center space-x-4">
                          {warrants.map((warrant, index) => {
                              return (
                                  <div
                                          style={isSelected(index) ? selectedCardStyle : {}}
                                          className="flex flex-col items-center cursor-pointer select:border-2 border-black"
                                          key={index}
                                          onClick={(e) => {
                                              toggleSelection(index);
                                              onWarrantSelection(e, warrant.price, warrant.description);
                                          }}
                                      >
                                      <img src={warrant.icon} alt="icon" className="mb-2 max-w-full h-auto rounded-lg" />
                                      <h1 className="font-bold text-center mb-4">{warrant.description}</h1>
                                      <h1 className="font-semibold text-xl text-center"><span style={{ color: "green" }}>${warrant.price}</span></h1>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </>
          } />

          <div className="flex justify-center space-x-8">
              <PriceButton text={`$${low.price}`} price={low.price} on_button_click={(e) => { onPriceChoice(e, `${low.price}`); player.round.set("warrants", []) }} /> 
              <PriceButton text={`$${high.price}`} price={high.price} on_button_click={(e) => { onPriceChoice(e, `${high.price}`); player.round.set("warrants", []) }} />
          </div>

          <Button4 className="w-fit p-4 mt-6 mx-auto" handleClick={onWarrantAddition}>Add a warrant</Button4>

          <ProfitMarginCalculation producerPlayer={player} />
          <div className="mt-4">
              <h1 className="mb-2 text-xl font-bold">{player.round.get("warrants") ? "▼ ㅤ Warrants chosen:" : "➤ No Warrants chosen."}</h1>
              <ol>
                  {player.round.get("warrants") && player.round.get("warrants").map((warrant, index) => (
                      <li key={index}>
                          {`• Description: ${warrant.warrantDesc}, Price: ${warrant.warrantPrice}`}
                      </li>
                  ))}
              </ol>
          </div>
          <div className="flex justify-between mt-10 items-center">
              <Button3 handleClick={onPreviousPage} primary>← &nbsp; Back</Button3>
              <NextRoundButton on_button_click={(e) => handleSubmit(e)} />
          </div>
      </div>
  );
}
