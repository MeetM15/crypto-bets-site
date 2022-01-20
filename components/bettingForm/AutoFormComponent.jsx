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
import axios from "axios";

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
const placeBet = (sliderValue, rollType) => {
  const result = [];
  result[1] = getRandomArbitrary(0.0, 100.0);
  if (rollType) {
    if (result[1] >= sliderValue) {
      console.log("You win ! Result: ", result);
      result[0] = "green";
    } else {
      console.log("You Lose ! Result: ", result);
      result[0] = "red";
    }
  } else {
    if (result[1] <= sliderValue) {
      console.log("You win ! Result: ", result);
      result[0] = "green";
    } else {
      console.log("You Lose ! Result: ", result);
      result[0] = "red";
    }
  }
  return result;
};

const AutoFormComponent = ({
  user,
  walletBalance,
  bnbWalletBalance,
  web3,
  web3_bsc,
  setWalletBalance,
  setBnbWalletBalance,
  setToggleLoginModalOpen,
  chain,
  socket,
}) => {
  const btnRef = useRef(false);
  const isBetting = useRef(false);
  const currBalEth = useRef(walletBalance);
  const currBalBnb = useRef(bnbWalletBalance);
  const [disableClick, setDisableClick] = useState(false);
  const [betAmt, setBetAmt] = useState(0.0);
  const [profitAmtAuto, setProfitAmtAuto] = useState(0.0);
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

  const handlePlaceBet = (currentBet, currentProf, totalProf) => {
    if (user && user[0]) {
      //place bet
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color = betResult;
      if (user && user[0] != undefined) {
        var d = new Date(); // for curr time
        const betTime = `${
          String(d.getHours().toString()).length == 1
            ? "0" + Number(d.getHours()).toString()
            : Number(d.getHours()).toString()
        }:${
          String(d.getMinutes().toString()).length == 1
            ? "0" + Number(d.getMinutes()).toString()
            : Number(d.getMinutes()).toString()
        }`;
        const betData = {
          username: user[0].username,
          multiplier: multiplierValue,
          betTime: betTime,
          result: diceValue,
          payout:
            betResult == "green"
              ? (parseFloat(betAmt) + parseFloat(currentProf)).toFixed(8)
              : `-${betAmt}`,
          email: user[0].email,
          chain: chain,
          betResult: betResult == "green" ? true : false,
          betAmt: betAmt,
          profitAmt: parseFloat(currentProf) > 0 ? currentProf : 0.0,
        };
        console.log("bet data : ", betData);
        axios
          .post("/bet", betData)
          .then((res) => {
            console.log("bet res : ", res);
          })
          .then((res) => {
            console.log(res);
            return socket.emit("placeBet");
          })
          .then((res) => {
            return web3.eth.getBalance(user[0].address);
          })
          .then((res) => {
            return web3.utils.fromWei(res);
          })
          .then((res) => {
            setWalletBalance(
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
            );
            currBalEth.current =
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0;
          })
          .catch((err) => {
            console.log(err);
          });
        //set profitAmtAuto on win and on loss
        if (betResult == "green") {
          setWalletBalance(
            (prev) => parseFloat(prev) + parseFloat(currentProf)
          );
          currBalEth.current =
            parseFloat(currBalEth.current) + parseFloat(currentProf);
          setProfitAmtAuto((prev) =>
            (
              parseFloat(prev) +
              parseFloat(multiplierValue) * parseFloat(currentBet) -
              parseFloat(currentBet)
            ).toFixed(6)
          );
          currentProf = parseFloat(
            (
              parseFloat(multiplierValue) * parseFloat(currentBet) -
              parseFloat(currentBet)
            ).toFixed(6)
          );
          totalProf = parseFloat(
            (parseFloat(totalProf) + parseFloat(currentProf)).toFixed(6)
          );
        } else {
          setWalletBalance((prev) =>
            parseFloat(parseFloat(prev) - parseFloat(betAmt))
          );
          currBalEth.current =
            parseFloat(currBalEth.current) - parseFloat(betAmt);
          setProfitAmtAuto((prev) =>
            parseFloat((parseFloat(prev) - parseFloat(currentBet)).toFixed(6))
          );
          currentProf = parseFloat((-parseFloat(currentBet)).toFixed(6));
          totalProf = parseFloat(
            (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(6)
          );
        }

        // set bet amt incr. on win/loss
        if (betResult == "green") {
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
        setResult(parseFloat(diceValue.toFixed(2)));
        return {
          currentBet: currentBet,
          currentProf: currentProf,
          totalProf: totalProf,
        };
      } else {
        return {
          currentBet: currentBet,
          currentProf: currentProf,
          totalProf: totalProf,
        };
      }
    } else {
      //place bet
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set profitAmtAuto on win and on loss
      if (betResult == "green") {
        setWalletBalance((prev) => parseFloat(prev) + parseFloat(currentProf));
        currBalEth.current =
          parseFloat(currBalEth.current) + parseFloat(currentProf);
        setProfitAmtAuto((prev) =>
          (
            parseFloat(prev) +
            parseFloat(multiplierValue) * parseFloat(currentBet) -
            parseFloat(currentBet)
          ).toFixed(6)
        );
        currentProf = (
          parseFloat(multiplierValue) * parseFloat(currentBet) -
          parseFloat(currentBet)
        ).toFixed(6);
        totalProf = (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(
          6
        );
      } else {
        setWalletBalance((prev) =>
          parseFloat(parseFloat(prev) - parseFloat(betAmt))
        );
        currBalEth.current =
          parseFloat(currBalEth.current) - parseFloat(betAmt);
        setProfitAmtAuto((prev) =>
          (parseFloat(prev) - parseFloat(currentBet)).toFixed(6)
        );
        currentProf = (-parseFloat(currentBet)).toFixed(6);
        totalProf = (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(
          6
        );
      }

      // set bet amt incr. on win/loss
      if (betResult == "green") {
        setBetAmt((prev) => {
          const increasedBetWin = (onWin * parseFloat(prev)) / 100;
          const newBet = parseFloat(prev) + increasedBetWin;
          return parseFloat(Math.floor(newBet * 1000000) / 1000000);
        });
        currentBet = (
          parseFloat(currentBet) +
          (parseFloat(onWin) * parseFloat(currentBet)) / 100
        ).toFixed(6);
      } else {
        setBetAmt((prev) => {
          const increasedBetLoss = (onLoss * parseFloat(prev)) / 100;
          const newBet = parseFloat(prev) + increasedBetLoss;
          return parseFloat(Math.floor(newBet * 1000000) / 1000000);
        });
        currentBet = (
          parseFloat(currentBet) +
          (parseFloat(onLoss) * parseFloat(currentBet)) / 100
        ).toFixed(6);
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));

      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color = betResult;
      return {
        currentBet: currentBet,
        currentProf: currentProf,
        totalProf: totalProf,
      };
    }
  };
  const handlePlaceBetBnb = (currentBet, currentProf, totalProf) => {
    if (user && user[0]) {
      //place bet
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color = betResult;
      if (user && user[0] != undefined) {
        var d = new Date(); // for curr time
        const betTime = `${
          String(d.getHours().toString()).length == 1
            ? "0" + Number(d.getHours()).toString()
            : Number(d.getHours()).toString()
        }:${
          String(d.getMinutes().toString()).length == 1
            ? "0" + Number(d.getMinutes()).toString()
            : Number(d.getMinutes()).toString()
        }`;
        const betData = {
          username: user[0].username,
          multiplier: multiplierValue,
          betTime: betTime,
          result: diceValue,
          payout:
            betResult == "green"
              ? (parseFloat(betAmt) + parseFloat(currentProf)).toFixed(8)
              : `-${betAmt}`,
          email: user[0].email,
          chain: chain,
          betResult: betResult == "green" ? true : false,
          betAmt: betAmt,
          profitAmt: parseFloat(currentProf) > 0 ? currentProf : 0.0,
        };
        console.log("bet data : ", betData);
        axios
          .post("/bet", betData)
          .then((res) => {
            console.log("bet res : ", res);
          })
          .then((res) => {
            console.log(res);
            return socket.emit("placeBet");
          })
          .then((res) => {
            return web3_bsc.eth.getBalance(user[0].bscAddress);
          })
          .then((res) => {
            return web3_bsc.utils.fromWei(res);
          })
          .then((res) => {
            setBnbWalletBalance(
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
            );
            currBalBnb.current =
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0;
          })
          .catch((err) => {
            console.log(err);
          });
        //set profitAmtAuto on win and on loss
        if (betResult == "green") {
          setBnbWalletBalance(
            (prev) => parseFloat(prev) + parseFloat(currentProf)
          );
          currBalBnb.current =
            parseFloat(currBalBnb.current) + parseFloat(currentProf);
          setProfitAmtAuto((prev) =>
            (
              parseFloat(prev) +
              parseFloat(multiplierValue) * parseFloat(currentBet) -
              parseFloat(currentBet)
            ).toFixed(6)
          );
          currentProf = parseFloat(
            (
              parseFloat(multiplierValue) * parseFloat(currentBet) -
              parseFloat(currentBet)
            ).toFixed(6)
          );
          totalProf = parseFloat(
            (parseFloat(totalProf) + parseFloat(currentProf)).toFixed(6)
          );
        } else {
          setBnbWalletBalance((prev) =>
            parseFloat(parseFloat(prev) - parseFloat(betAmt))
          );
          currBalBnb.current =
            parseFloat(currBalBnb.current) - parseFloat(betAmt);
          setProfitAmtAuto((prev) =>
            parseFloat((parseFloat(prev) - parseFloat(currentBet)).toFixed(6))
          );
          currentProf = parseFloat((-parseFloat(currentBet)).toFixed(6));
          totalProf = parseFloat(
            (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(6)
          );
        }

        // set bet amt incr. on win/loss
        if (betResult == "green") {
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
        setResult(parseFloat(diceValue.toFixed(2)));
        return {
          currentBet: currentBet,
          currentProf: currentProf,
          totalProf: totalProf,
        };
      } else {
        return {
          currentBet: currentBet,
          currentProf: currentProf,
          totalProf: totalProf,
        };
      }
    } else {
      //place bet
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];

      //set dice position acc. to bet result
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set profitAmtAuto on win and on loss
      if (betResult == "green") {
        setBnbWalletBalance(
          (prev) => parseFloat(prev) + parseFloat(currentProf)
        );
        currBalBnb.current =
          parseFloat(currBalBnb.current) + parseFloat(currentProf);
        setProfitAmtAuto((prev) =>
          (
            parseFloat(prev) +
            parseFloat(multiplierValue) * parseFloat(currentBet) -
            parseFloat(currentBet)
          ).toFixed(6)
        );
        currentProf = (
          parseFloat(multiplierValue) * parseFloat(currentBet) -
          parseFloat(currentBet)
        ).toFixed(6);
        totalProf = (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(
          6
        );
      } else {
        setBnbWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
        currBalBnb.current =
          parseFloat(currBalBnb.current) - parseFloat(betAmt);
        setProfitAmtAuto((prev) =>
          (parseFloat(prev) - parseFloat(currentBet)).toFixed(6)
        );
        currentProf = (-parseFloat(currentBet)).toFixed(6);
        totalProf = (parseFloat(currentProf) + parseFloat(totalProf)).toFixed(
          6
        );
      }

      // set bet amt incr. on win/loss
      if (betResult == "green") {
        setBetAmt((prev) => {
          const increasedBetWin = (onWin * parseFloat(prev)) / 100;
          const newBet = parseFloat(prev) + increasedBetWin;
          return parseFloat(Math.floor(newBet * 1000000) / 1000000);
        });
        currentBet = (
          parseFloat(currentBet) +
          (parseFloat(onWin) * parseFloat(currentBet)) / 100
        ).toFixed(6);
      } else {
        setBetAmt((prev) => {
          const increasedBetLoss = (onLoss * parseFloat(prev)) / 100;
          const newBet = parseFloat(prev) + increasedBetLoss;
          return parseFloat(Math.floor(newBet * 1000000) / 1000000);
        });
        currentBet = (
          parseFloat(currentBet) +
          (parseFloat(onLoss) * parseFloat(currentBet)) / 100
        ).toFixed(6);
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));

      //set dice result color acc to win/loss
      document.getElementById("diceResult").style.color = betResult;
      return {
        currentBet: currentBet,
        currentProf: currentProf,
        totalProf: totalProf,
      };
    }
  };

  useEffect(() => {
    if (!isBetting.current) {
      if (currBalEth.current < walletBalance)
        currBalEth.current = walletBalance;
    } else {
      if (currBalEth.current >= walletBalance)
        currBalEth.current = walletBalance;
    }
  }, [walletBalance]);
  useEffect(() => {
    if (!isBetting.current) {
      if (currBalBnb.current < walletBalance)
        currBalBnb.current = walletBalance;
    } else {
      if (currBalBnb.current >= walletBalance)
        currBalBnb.current = walletBalance;
    }
  }, [bnbWalletBalance]);

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
                chain={chain}
              />
              <div className="w-full md:w-1/2 h-16">
                <label htmlFor="bets" className="text-xs font-medium">
                  No. of bets
                </label>
                <div className="p-0.5 h-10 w-full flex items-center bg-gray-200 rounded justify-center">
                  <input
                    className="px-2 py-2 rounded-l font-medium text-sm w-full text-center"
                    type="number"
                    name="bets"
                    min={"1"}
                    value={noOfBets}
                    onChange={(e) => setNoOfBets(e.target.value)}
                    disabled={disableClick}
                  />
                  <button className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full">
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
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <div className="w-full md:w-1/2 h-16 md:mr-2">
                <label htmlFor="onWin" className="text-xs font-medium">
                  On win
                </label>
                <div className="p-0.5 h-10 w-full flex items-center bg-gray-200 rounded justify-center">
                  <Tab.Group>
                    <Tab.List className="flex items-center justify-between w-1/2">
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-2/5"
                            : "rounded text-xs px-1 py-2.5 font-medium w-2/5"
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
                            ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-full"
                            : "rounded text-xs px-1 py-2.5 font-medium w-full"
                        }>
                        Increase By:
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="w-1/2 ml-1">
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            disabled
                            className="px-2 py-2 rounded-l bg-white opacity-50 font-medium text-sm w-full"
                            type="number"
                            name="reset"
                          />
                          <button
                            disabled
                            className="text-md bg-white font-bold opacity-50 px-2 flex items-center justify-center rounded-r h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            className="px-2 py-2 rounded-l font-medium text-sm w-full"
                            type="number"
                            name="increaseBy"
                            value={onWin}
                            onChange={(e) => setOnWin(e.target.value)}
                            disabled={disableClick}
                          />
                          <button
                            disabled
                            className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-16">
                <label htmlFor="onLoss" className="text-xs font-medium">
                  On Loss
                </label>
                <div className="p-0.5 h-10 w-full flex items-center bg-gray-200 rounded justify-center">
                  <Tab.Group>
                    <Tab.List className="flex items-center justify-between w-1/2">
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-2/5"
                            : "rounded text-xs px-1 py-2.5 font-medium w-2/5"
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
                            ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-full"
                            : "rounded text-xs px-1 py-2.5 font-medium w-full"
                        }>
                        Increase By:
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="w-1/2 ml-1">
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            disabled
                            className="px-2 py-2 rounded-l bg-white opacity-50 font-medium text-sm w-full"
                            type="number"
                            name="reset"
                          />
                          <button
                            disabled
                            className="text-md bg-white font-bold opacity-50 px-2 flex items-center justify-center rounded-r h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                      <Tab.Panel>
                        <div className="p-0.5 h-10 flex items-center justify-start w-full">
                          <input
                            className="px-2 py-2 rounded-l font-medium text-sm w-full"
                            type="number"
                            name="increaseBy"
                            value={onLoss}
                            onChange={(e) => setOnLoss(e.target.value)}
                            disabled={disableClick}
                          />
                          <button
                            disabled
                            className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full">
                            %
                          </button>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="w-1/2 h-16 mr-2">
                <label htmlFor="stopProfit" className="text-xs font-medium">
                  Stop on profit
                </label>
                <div className="p-0.5 h-10 w-full flex items-center bg-gray-200 rounded justify-center">
                  <input
                    className="px-2 py-2 rounded-l font-medium text-sm w-full"
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
                  <button className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full">
                    <TrendingUpIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="w-1/2 h-16">
                <label htmlFor="stopLoss" className="text-xs font-medium">
                  Stop on loss
                </label>
                <div className="p-0.5 h-10 w-full flex items-center bg-gray-200 rounded justify-center">
                  <input
                    className="px-2 py-2 rounded-l font-medium text-sm w-full"
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
                  <button className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full">
                    <TrendingDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-20 flex items-center justify-center p-2">
            <button
              type="button"
              className={`text-md font-bold bg-btn1 text-white px-28 py-3 rounded ${
                disableClick && "hidden"
              }`}
              id="rollBtn"
              onClick={() => {
                isBetting.current = true;
                setDisableClick(true);
                const timer = (ms) => new Promise((res) => setTimeout(res, ms));
                const runBetsBnb = async () => {
                  const currentProf = 0.0;
                  const totalProf = 0.0;
                  const currentBet = betAmt;

                  for (let i = 0; i < noOfBets; i++) {
                    console.log("stop", btnRef.current);
                    if (btnRef.current) {
                      console.log("enable click");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      btnRef.current = false;
                      isBetting.current = false;
                      break;
                    }
                    if (currBalBnb.current < currentBet) {
                      console.log("enable click");
                      console.log("Insufficient Balance!");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      isBetting.current = false;
                      break;
                    }
                    currentProf = 0.0;
                    //break loop if stop profit achieved
                    if (stopProfit != -1) {
                      if (parseFloat(totalProf) >= parseFloat(stopProfit)) {
                        console.log("enable click");
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        isBetting.current = false;
                        break;
                      }
                    }
                    //break loop if stop Loss achieved
                    if (stopLoss != -1) {
                      if (
                        parseFloat(totalProf) < 0 &&
                        Math.abs(parseFloat(totalProf)) >= stopLoss
                      ) {
                        console.log("enable click");
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        isBetting.current = false;
                        break;
                      }
                    }
                    const handleBetRes = handlePlaceBetBnb(
                      currentBet,
                      currentProf,
                      totalProf
                    );
                    if (handleBetRes == -1) {
                      console.log("Insufficient Balance!");
                      break;
                    }
                    if (handleBetRes) {
                      currentBet = handleBetRes.currentBet;
                      currentProf = handleBetRes.currentProf;
                      totalProf = handleBetRes.totalProf;
                    }
                    if (i == noOfBets - 1) {
                      console.log("enable click");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      isBetting.current = false;
                    }
                    console.log("Handle bet res : ", handleBetRes);

                    console.log("stopLoss " + i + " : ", stopLoss);
                    console.log("stopProfit " + i + " : ", stopProfit);
                    console.log("CBet : ", currentBet);
                    console.log("CProfit : ", currentProf);
                    console.log("TProfit : ", totalProf);
                    await timer(2000); // wait between next bet
                  }
                };
                const runBets = async () => {
                  const currentProf = 0.0;
                  const totalProf = 0.0;
                  const currentBet = betAmt;

                  for (let i = 0; i < noOfBets; i++) {
                    console.log("stop", btnRef.current);
                    if (btnRef.current) {
                      console.log("enable click");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      btnRef.current = false;
                      isBetting.current = false;
                      break;
                    }
                    if (currBalEth.current < currentBet) {
                      console.log("enable click");
                      console.log("Insufficient Balance!");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      isBetting.current = false;
                      break;
                    }

                    currentProf = 0.0;
                    //break loop if stop profit achieved
                    if (stopProfit != -1) {
                      if (parseFloat(totalProf) >= parseFloat(stopProfit)) {
                        console.log("enable click");
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        isBetting.current = false;
                        break;
                      }
                    }
                    //break loop if stop Loss achieved
                    if (stopLoss != -1) {
                      if (
                        parseFloat(totalProf) < 0 &&
                        Math.abs(parseFloat(totalProf)) >= stopLoss
                      ) {
                        console.log("enable click");
                        document
                          .getElementById("rollBtn")
                          .removeAttribute("disabled");
                        setDisableClick(false);
                        isBetting.current = false;
                        break;
                      }
                    }
                    const handleBetRes = handlePlaceBet(
                      currentBet,
                      currentProf,
                      totalProf
                    );
                    if (handleBetRes == -1) {
                      console.log("Insufficient Balance!");
                      break;
                    }
                    if (handleBetRes) {
                      currentBet = handleBetRes.currentBet;
                      currentProf = handleBetRes.currentProf;
                      totalProf = handleBetRes.totalProf;
                    }
                    if (i == noOfBets - 1) {
                      console.log("enable click");
                      document
                        .getElementById("rollBtn")
                        .removeAttribute("disabled");
                      setDisableClick(false);
                      isBetting.current = false;
                    }
                    console.log("Handle bet res : ", handleBetRes);

                    console.log("stopLoss " + i + " : ", stopLoss);
                    console.log("stopProfit " + i + " : ", stopProfit);
                    console.log("CBet : ", currentBet);
                    console.log("CProfit : ", currentProf);
                    console.log("TProfit : ", totalProf);
                    await timer(2000); // wait between next bet
                  }
                };
                // To prevent spamming of bets
                setDisableClick(true);
                console.log("disable click");
                document
                  .getElementById("rollBtn")
                  .setAttribute("disabled", "true");
                if (chain == "eth") runBets();
                else runBetsBnb();
              }}>
              Roll Dice
            </button>
            <button
              type="button"
              className={`text-md font-bold bg-btn1 text-white px-28 py-3 rounded ${
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
        <div className="w-full md:w-144 text-white bg-secondary rounded-full p-4 flex items-center justify-between gap-4">
          <span className="font-medium text-sm">0</span>
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
                  backgroundColor: `${
                    toggleRollOver ? "rgb(21, 220, 61)" : "rgb(220, 18, 60)"
                  }`,
                  width: "100%",
                },
                active: {
                  backgroundColor: `${
                    toggleRollOver ? "rgb(220, 18, 60)" : "rgb(21, 220, 61)"
                  }`,
                },
                thumb: {
                  width: 24,
                  height: 24,
                  borderRadius: "4px",
                  opacity: 0.8,
                },
              }}
            />
          </div>
          <span className="font-medium text-sm">100</span>
        </div>
      </div>
    </div>
  );
};

export default AutoFormComponent;
