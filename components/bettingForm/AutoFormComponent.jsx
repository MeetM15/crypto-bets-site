import {
  VariableIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "@heroicons/react/solid";
import { useState, useEffect, useRef } from "react";
import { Tab } from "@headlessui/react";
import Slider from "react-input-slider";
import BetValueField from "./fields/BetValueField";
import ChancesFields from "./fields/ChancesFields";
import { placeBet, getMyBets } from "../../services/betsService";

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
const placeBetLocal = (sliderValue, rollType) => {
  const result = [];
  result[1] = getRandomArbitrary(0.0, 100.0);
  if (rollType) {
    if (result[1] >= sliderValue) {
      console.log("You win ! Result: ", result);
      result[0] = "win";
    } else {
      console.log("You Lose ! Result: ", result);
      result[0] = "lose";
    }
  } else {
    if (result[1] <= sliderValue) {
      console.log("You win ! Result: ", result);
      result[0] = "win";
    } else {
      console.log("You Lose ! Result: ", result);
      result[0] = "lose";
    }
  }
  return result;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const AutoFormComponent = ({
  user,
  walletBalance,
  bnbWalletBalance,
  setWalletBalance,
  setBnbWalletBalance,
  polyWalletBalance,
  setPolyWalletBalance,
  chain,
  socket,
  setMyBets,
}) => {
  const btnRef = useRef(false);
  const [disableClick, setDisableClick] = useState(false);
  const [betAmt, setBetAmt] = useState(0.0);
  const [noOfBets, setNoOfBets] = useState(1);
  const [toggleRollOver, setToggleRollOverOver] = useState(true); //true - roll over , false - roll under
  const [sliderValue, setSliderValue] = useState(
    parseFloat((100.0 - parseFloat((99.0 / 2.0).toFixed(2))).toFixed(2))
  );
  const [multiplierValue, setMultiplierValue] = useState(2.0);
  const [winChance, setWinChance] = useState(
    parseFloat((99.0 / 2.0).toFixed(2))
  );
  const [showDice, setShowDice] = useState("hidden");
  const [result, setResult] = useState();
  const [onWin, setOnWin] = useState(0);
  const [onLoss, setOnLoss] = useState(0);
  const [stopProfit, setStopProfit] = useState(-1);
  const [stopLoss, setStopLoss] = useState(-1);

  const handlePlaceBet = async (currentBet, currentProf, totalProf) => {
    if (user && currentBet > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: currentBet,
        multiplier: multiplierValue,
      };
      const response = await placeBet(user?.token, betData)
        .then((res) => {
          console.log(res);
          const betResult = res.result;
          const diceValue = res.number;
          //set dice position acc. to bet result
          document.getElementById("dice").style.left = `calc(${Math.floor(
            diceValue
          )}% - 2rem)`;
          //set dice result color acc to win/loss
          document.getElementById("diceResult").style.color =
            betResult == "win" ? "green" : "red";
          setResult(parseFloat(diceValue.toFixed(2)));
          if (betResult == "win") {
            currentProf = parseFloat(
              (
                parseFloat(multiplierValue) * parseFloat(currentBet) -
                parseFloat(currentBet)
              ).toFixed(6)
            );
            totalProf = parseFloat(
              (parseFloat(totalProf) + parseFloat(currentProf)).toFixed(6)
            );
            setWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(currentProf)
            );
          } else {
            currentProf = parseFloat((-parseFloat(currentBet)).toFixed(6));
            totalProf = parseFloat(
              (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(6)
            );
            setWalletBalance((prev) =>
              parseFloat(parseFloat(prev) - parseFloat(currentBet))
            );
          }
          // set bet amt incr. on win/loss
          if (betResult == "win") {
            setBetAmt((prev) => {
              const increasedBetWin = (onWin * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetWin;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onWin) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          } else {
            setBetAmt((prev) => {
              const increasedBetLoss = (onLoss * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetLoss;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onLoss) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          }
          setShowDice("flex");
          setTimeout(() => {
            setShowDice("hidden");
          }, 3000);
          socket.emit("placeBet");
          return getMyBets(user?.token, {});
        })
        .then((res) => {
          setMyBets(res);
          return {
            currentBet: currentBet,
            currentProf: currentProf,
            totalProf: totalProf,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      return sleep(1000).then((v) => {
        return response;
      });
    } else {
      //place bet
      const result = placeBetLocal(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;
      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color =
        betResult == "win" ? "green" : "red";
      setResult(parseFloat(diceValue.toFixed(2)));

      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);

      return sleep(1000).then((v) => {
        return {
          currentBet: 0,
          currentProf: 0,
          totalProf: 0,
        };
      });
    }
  };
  const handlePlaceBetBnb = async (currentBet, currentProf, totalProf) => {
    if (user && currentBet > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: currentBet,
        multiplier: multiplierValue,
      };
      const response = await placeBet(user?.token, betData)
        .then((res) => {
          const betResult = res.result;
          const diceValue = res.number;
          //set dice position acc. to bet result
          document.getElementById("dice").style.left = `calc(${Math.floor(
            diceValue
          )}% - 2rem)`;
          //set dice result color acc to win/loss
          document.getElementById("diceResult").style.color =
            betResult == "win" ? "green" : "red";
          setResult(parseFloat(diceValue.toFixed(2)));
          //set profitAmtAuto on win and on loss
          if (betResult == "win") {
            currentProf = parseFloat(
              (
                parseFloat(multiplierValue) * parseFloat(currentBet) -
                parseFloat(currentBet)
              ).toFixed(6)
            );
            totalProf = parseFloat(
              (parseFloat(totalProf) + parseFloat(currentProf)).toFixed(6)
            );
            setBnbWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(currentProf)
            );
          } else {
            currentProf = parseFloat((-parseFloat(currentBet)).toFixed(6));
            totalProf = parseFloat(
              (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(6)
            );
            setBnbWalletBalance((prev) =>
              parseFloat(parseFloat(prev) - parseFloat(currentBet))
            );
          }
          // set bet amt incr. on win/loss
          // set bet amt incr. on win/loss
          if (betResult == "win") {
            setBetAmt((prev) => {
              const increasedBetWin = (onWin * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetWin;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onWin) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          } else {
            setBetAmt((prev) => {
              const increasedBetLoss = (onLoss * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetLoss;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onLoss) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          }
          setShowDice("flex");
          setTimeout(() => {
            setShowDice("hidden");
          }, 3000);
          socket.emit("placeBet");
          return getMyBets(user?.token, {});
        })
        .then((res) => {
          setMyBets(res);
          return {
            currentBet: currentBet,
            currentProf: currentProf,
            totalProf: totalProf,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      return sleep(1000).then((v) => {
        return response;
      });
    } else {
      //place bet
      const result = placeBetLocal(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;
      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color =
        betResult == "win" ? "green" : "red";
      setResult(parseFloat(diceValue.toFixed(2)));

      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);

      return sleep(1000).then((v) => {
        return {
          currentBet: 0,
          currentProf: 0,
          totalProf: 0,
        };
      });
    }
  };
  const handlePlaceBetPoly = async (currentBet, currentProf, totalProf) => {
    if (user && currentBet > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: currentBet,
        multiplier: multiplierValue,
      };
      const response = await placeBet(user?.token, betData)
        .then((res) => {
          const betResult = res.result;
          const diceValue = res.number;
          //set dice position acc. to bet result
          document.getElementById("dice").style.left = `calc(${Math.floor(
            diceValue
          )}% - 2rem)`;
          //set dice result color acc to win/loss
          document.getElementById("diceResult").style.color =
            betResult == "win" ? "green" : "red";
          setResult(parseFloat(diceValue.toFixed(2)));
          if (betResult == "win") {
            currentProf = parseFloat(
              (
                parseFloat(multiplierValue) * parseFloat(currentBet) -
                parseFloat(currentBet)
              ).toFixed(6)
            );
            totalProf = parseFloat(
              (parseFloat(totalProf) + parseFloat(currentProf)).toFixed(6)
            );
            setPolyWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(currentProf)
            );
          } else {
            currentProf = parseFloat((-parseFloat(currentBet)).toFixed(6));
            totalProf = parseFloat(
              (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(6)
            );
            setPolyWalletBalance((prev) =>
              parseFloat(parseFloat(prev) - parseFloat(currentBet))
            );
          }
          // set bet amt incr. on win/loss
          if (betResult == "win") {
            setBetAmt((prev) => {
              const increasedBetWin = (onWin * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetWin;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onWin) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          } else {
            setBetAmt((prev) => {
              const increasedBetLoss = (onLoss * parseFloat(prev)) / 100;
              const newBet = parseFloat(prev) + increasedBetLoss;
              return parseFloat(Math.floor(newBet * 1000000) / 1000000);
            });
            currentBet = parseFloat(
              (
                parseFloat(currentBet) +
                (parseFloat(onLoss) * parseFloat(currentBet)) / 100
              ).toFixed(6)
            );
          }
          setShowDice("flex");
          setTimeout(() => {
            setShowDice("hidden");
          }, 3000);
          socket.emit("placeBet");
          return getMyBets(user?.token, {});
        })
        .then((res) => {
          setMyBets(res);
          return {
            currentBet: currentBet,
            currentProf: currentProf,
            totalProf: totalProf,
          };
        })
        .catch((err) => {
          console.log(err);
        });
      return sleep(1000).then((v) => {
        return response;
      });
    } else {
      //place bet
      const result = placeBetLocal(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;
      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color =
        betResult == "win" ? "green" : "red";
      setResult(parseFloat(diceValue.toFixed(2)));

      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);

      return sleep(1000).then((v) => {
        return {
          currentBet: 0,
          currentProf: 0,
          totalProf: 0,
        };
      });
    }
  };

  useEffect(() => {
    setWinChance(parseFloat((99.0 / multiplierValue).toFixed(2)));
  }, [multiplierValue]);
  useEffect(() => {
    if (!toggleRollOver)
      setSliderValue(parseFloat(parseFloat(winChance).toFixed(2)));
    else setSliderValue(parseFloat((100.0 - parseFloat(winChance)).toFixed(2)));
  }, [winChance]);

  return (
    <div className="flex flex-col items-center">
      <form>
        <div
          className={`w-64 sm:w-96 md:w-152 flex flex-wrap items-center justify-between`}>
          <div className={` ${disableClick && "opacity-70"}`}>
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <BetValueField
                betAmt={betAmt}
                setBetAmt={setBetAmt}
                multiplierValue={multiplierValue}
                walletBalance={walletBalance}
                disableClick={disableClick}
                bnbWalletBalance={bnbWalletBalance}
                polyWalletBalance={polyWalletBalance}
                chain={chain}
              />
              <div className="w-full md:w-1/2 h-16">
                <label
                  htmlFor="bets"
                  className="text-xs text-formtext font-medium">
                  Number of bets
                </label>
                <div className="h-10 w-full shadow-inner flex items-center bg-inputbg rounded-md justify-center">
                  <input
                    className="px-8 py-2 rounded-l-md bg-inputbg font-medium text-sm w-full"
                    type="number"
                    name="bets"
                    min={"1"}
                    value={noOfBets}
                    onChange={(e) => setNoOfBets(e.target.value)}
                    disabled={disableClick}
                  />
                  <button
                    disabled
                    className="text-xs text-btntext bg-inputbg font-medium p-2 flex items-center justify-center rounded-r-md h-full">
                    <VariableIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <ChancesFields
              sliderValue={sliderValue}
              toggleRollOver={toggleRollOver}
              setSliderValue={setSliderValue}
              setToggleRollOverOver={setToggleRollOverOver}
              winChance={winChance}
              setWinChance={setWinChance}
              multiplierValue={multiplierValue}
              setMultiplierValue={setMultiplierValue}
              disableClick={disableClick}
            />
            <div className="mt-7 flex flex-col md:flex-row items-center justify-between w-full">
              <div className="md:w-1/2 w-full h-16 md:mr-2">
                <label
                  htmlFor="onWin"
                  className="text-xs text-formtext font-medium">
                  On Win
                </label>
                <div className="p-1 h-10 w-full flex items-center shadow-inner bg-inputbg rounded-md justify-center">
                  <Tab.Group>
                    <Tab.List className="flex items-center justify-between w-1/2">
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded-lg bg-secondary text-xs text-btntext px-1 py-2.5 font-medium w-2/5"
                            : "rounded-lg text-xs text-btntext px-1 py-2.5 font-medium w-2/5"
                        }>
                        <span
                          onClick={() => {
                            console.log("resetted bet!");
                            setOnWin(0);
                          }}>
                          Reset
                        </span>
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded-lg bg-secondary text-xs text-btntext px-1 py-2.5 font-medium w-full"
                            : "rounded-lg text-xs text-btntext px-1 py-2.5 font-medium w-full"
                        }>
                        Increase By:
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="w-1/2 ml-1">
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            disabled
                            className="px-4 py-2 rounded-l-md bg-secondary opacity-50 font-medium text-sm w-full"
                            type="number"
                            name="reset"
                          />
                          <button
                            disabled
                            className="text-md text-btntext bg-secondary font-bold opacity-50 px-2 flex items-center justify-center rounded-r-md h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            className="px-4 py-2 rounded-l-md font-medium text-sm w-full"
                            type="number"
                            name="increaseBy"
                            value={onWin}
                            onChange={(e) => setOnWin(e.target.value)}
                            disabled={disableClick}
                          />
                          <button
                            disabled
                            className="text-md text-btntext bg-secondary font-bold px-2 flex items-center justify-center rounded-r-md h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
              <div className="md:w-1/2 w-full h-16">
                <label
                  htmlFor="onLoss"
                  className="text-xs text-formtext font-medium">
                  On Loss
                </label>
                <div className="p-1 h-10 w-full flex items-center shadow-inner bg-inputbg rounded-md justify-center">
                  <Tab.Group>
                    <Tab.List className="flex items-center justify-between w-1/2">
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded-lg bg-secondary text-xs text-btntext px-1 py-2.5 font-medium w-2/5"
                            : "rounded-lg text-xs text-btntext px-1 py-2.5 font-medium w-2/5"
                        }>
                        <span
                          onClick={() => {
                            console.log("resetted bet!");
                            setOnLoss(0);
                          }}>
                          Reset
                        </span>
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded-lg bg-secondary text-xs text-btntext px-1 py-2.5 font-medium w-full"
                            : "rounded-lg text-xs text-btntext px-1 py-2.5 font-medium w-full"
                        }>
                        Increase By:
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="w-1/2 ml-1">
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            disabled
                            className="px-4 py-2 rounded-l-md bg-secondary opacity-50 font-medium text-sm w-full"
                            type="number"
                            name="reset"
                          />
                          <button
                            disabled
                            className="text-md text-btntext bg-secondary font-bold opacity-50 px-2 flex items-center justify-center rounded-r-md h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            className="px-4 py-2 rounded-l-md font-medium text-sm w-full"
                            type="number"
                            name="increaseBy"
                            value={onLoss}
                            onChange={(e) => setOnLoss(e.target.value)}
                            disabled={disableClick}
                          />
                          <button
                            disabled
                            className="text-md text-btntext bg-secondary font-bold px-2 flex items-center justify-center rounded-r-md h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
            <div className="mt-7 flex flex-col md:flex-row items-center justify-between w-full">
              <div className="w-full md:w-1/2 h-16 md:mr-2">
                <label
                  htmlFor="stopProfit"
                  className="text-xs text-formtext font-medium">
                  Stop on profit
                </label>
                <div className="h-10 w-full flex items-center bg-inputbg shadow-inner rounded-md justify-center">
                  <input
                    className="px-8 py-2 rounded-l-md bg-inputbg font-medium text-sm w-full"
                    type="number"
                    name="stopProfit"
                    min="0.0"
                    onBlur={(e) => {
                      if (e.target.value <= 0) {
                        setStopProfit(-1);
                      }
                    }}
                    value={stopProfit}
                    onChange={(e) => setStopProfit(e.target.value)}
                    disabled={disableClick}
                  />
                  <button
                    type="button"
                    className="text-xs text-btntext bg-inputbg font-medium px-2 flex items-center justify-center rounded-r-md h-full">
                    <TrendingUpIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-16">
                <label
                  htmlFor="stopLoss"
                  className="text-xs text-formtext font-medium">
                  Stop on loss
                </label>
                <div className="h-10 w-full flex items-center bg-inputbg shadow-inner rounded-md justify-center">
                  <input
                    className="px-8 py-2 rounded-l-md bg-inputbg font-medium text-sm w-full"
                    type="number"
                    name="stopLoss"
                    min="0.0"
                    onBlur={(e) => {
                      if (e.target.value <= 0) {
                        setStopLoss(-1);
                      }
                    }}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    disabled={disableClick}
                  />
                  <button
                    type="button"
                    className="text-xs text-btntext bg-inputbg font-medium px-2 flex items-center justify-center rounded-r-md h-full">
                    <TrendingDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 w-full h-20 flex items-center justify-center p-2">
            <button
              type="button"
              className={`text-md font-medium bg-primary-100 text-secondary px-28 py-3 rounded-md ${
                disableClick && "hidden"
              }`}
              id="rollBtn"
              onClick={() => {
                setDisableClick(true);
                const runBetsBnb = async () => {
                  const currentProf = 0.0;
                  const totalProf = 0.0;
                  const currentBet = betAmt;

                  for (let i = 0; i < noOfBets; i++) {
                    if (btnRef.current) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      btnRef.current = false;
                      break;
                    }
                    if (parseFloat(bnbWalletBalance) < currentBet) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      break;
                    }
                    currentProf = 0.0;
                    //break loop if stop profit achieved
                    if (stopProfit != -1) {
                      if (parseFloat(totalProf) >= parseFloat(stopProfit)) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        break;
                      }
                    }
                    //break loop if stop Loss achieved
                    if (stopLoss != -1) {
                      if (
                        parseFloat(totalProf) < 0 &&
                        Math.abs(parseFloat(totalProf)) >= stopLoss
                      ) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        break;
                      }
                    }
                    const handleBetRes = await handlePlaceBetBnb(
                      currentBet,
                      currentProf,
                      totalProf
                    );
                    if (handleBetRes) {
                      currentBet = handleBetRes.currentBet;
                      currentProf = handleBetRes.currentProf;
                      totalProf = handleBetRes.totalProf;
                    }
                    if (i == noOfBets - 1) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                    }
                  }
                };
                const runBetsPoly = async () => {
                  const currentProf = 0.0;
                  const totalProf = 0.0;
                  const currentBet = betAmt;

                  for (let i = 0; i < noOfBets; i++) {
                    if (btnRef.current) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      btnRef.current = false;
                      break;
                    }
                    if (parseFloat(polyWalletBalance) < currentBet) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      break;
                    }

                    currentProf = 0.0;
                    //break loop if stop profit achieved
                    if (stopProfit != -1) {
                      if (parseFloat(totalProf) >= parseFloat(stopProfit)) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        break;
                      }
                    }
                    //break loop if stop Loss achieved
                    if (stopLoss != -1) {
                      if (
                        parseFloat(totalProf) < 0 &&
                        Math.abs(parseFloat(totalProf)) >= stopLoss
                      ) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        break;
                      }
                    }
                    const handleBetRes = await handlePlaceBetPoly(
                      currentBet,
                      currentProf,
                      totalProf
                    );
                    if (handleBetRes) {
                      currentBet = handleBetRes.currentBet;
                      currentProf = handleBetRes.currentProf;
                      totalProf = handleBetRes.totalProf;
                    }
                    if (i == noOfBets - 1) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                    }
                  }
                };
                const runBets = async () => {
                  const currentProf = 0.0;
                  const totalProf = 0.0;
                  const currentBet = betAmt;

                  for (let i = 0; i < noOfBets; i++) {
                    if (btnRef.current) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      btnRef.current = false;

                      break;
                    }
                    if (parseFloat(walletBalance) < currentBet) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      break;
                    }

                    currentProf = 0.0;
                    //break loop if stop profit achieved
                    if (stopProfit != -1) {
                      if (parseFloat(totalProf) >= parseFloat(stopProfit)) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);

                        break;
                      }
                    }
                    //break loop if stop Loss achieved
                    if (stopLoss != -1) {
                      if (
                        parseFloat(totalProf) < 0 &&
                        Math.abs(parseFloat(totalProf)) >= stopLoss
                      ) {
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);

                        break;
                      }
                    }
                    const handleBetRes = await handlePlaceBet(
                      currentBet,
                      currentProf,
                      totalProf
                    );
                    if (handleBetRes) {
                      currentBet = handleBetRes.currentBet;
                      currentProf = handleBetRes.currentProf;
                      totalProf = handleBetRes.totalProf;
                    }
                    if (i == noOfBets - 1) {
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                    }
                  }
                };
                // To prevent spamming of bets
                setDisableClick(true);
                document
                  .getElementById("rollBtn")
                  .setAttribute("disabled", "true");
                if (chain == "eth") runBets();
                else if (chain == "bsc") runBetsBnb();
                else runBetsPoly();
              }}>
              Roll Dice
            </button>
            <button
              type="button"
              className={`text-md font-medium bg-primary-100 text-secondary px-28 py-3 rounded-md ${
                !disableClick && "hidden"
              }`}
              id="rollBtn"
              onClick={() => {
                btnRef.current = true;
              }}>
              Stop Bet
            </button>
          </div>
        </div>
      </form>
      <div className="p-2 mt-8 w-full flex items-center justify-center">
        <div className="w-full md:w-144 text-secondary bg-secondary rounded-full p-1 md:p-4 flex items-center justify-between gap-2 md:gap-4">
          <span className="font-medium text-sm text-btntext">0</span>
          <div className="w-full relative">
            <span
              className={`absolute w-16 h-16 -top-16 z-10 flex-col items-center justify-center ${showDice}`}
              id="dice">
              <span className={`text-md font-bold`} id="diceResult">
                {result}
              </span>
              <img src="/icons/dice.png" alt="dice" className="w-full" />
            </span>
            <Slider
              axis="x"
              xmin={1.99}
              xmax={97.99}
              xstep={0.01}
              x={sliderValue}
              onChange={({ x }) => {
                setSliderValue(x);
                if (toggleRollOver) {
                  setMultiplierValue(
                    parseFloat((99.0 / parseFloat(100.0 - x)).toFixed(4))
                  );
                } else {
                  setMultiplierValue(
                    parseFloat((99.0 / parseFloat(x)).toFixed(4))
                  );
                }

                if (!toggleRollOver) setWinChance(parseFloat(x.toFixed(2)));
                else
                  setWinChance(parseFloat((100.0 - parseFloat(x)).toFixed(2)));
              }}
              styles={{
                track: {
                  backgroundColor: `${toggleRollOver ? "#24AE8F" : "#FF7878"}`,
                  width: "100%",
                },
                active: {
                  backgroundColor: `${toggleRollOver ? "#FF7878" : "#24AE8F"}`,
                },
                thumb: {
                  width: 28,
                  height: 28,
                  borderRadius: "16px",
                  opacity: 0.8,
                  backgroundColor: "#24AE8F",
                },
              }}
            />
          </div>
          <span className="font-medium text-sm text-btntext">100</span>
        </div>
      </div>
    </div>
  );
};

export default AutoFormComponent;
