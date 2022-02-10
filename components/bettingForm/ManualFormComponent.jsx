import { useEffect, useState } from "react";
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

const ManualFormComponent = ({
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
  const [betAmt, setBetAmt] = useState(0.0);
  const [profitAmt, setProfitAmt] = useState(0.0);
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

  const handlePlaceBet = () => {
    if (user && betAmt > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: betAmt,
        multiplier: multiplierValue,
      };
      placeBet(user?.token, betData)
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
          //set return value
          if (betResult == "win") {
            setWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(profitAmt)
            );
          } else {
            setWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
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
        })
        .catch((err) => {
          console.log(err);
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
    }
  };
  const handlePlaceBetBnb = () => {
    if (user && betAmt > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: betAmt,
        multiplier: multiplierValue,
      };
      placeBet(user?.token, betData)
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
          //set return value
          if (betResult == "win") {
            setBnbWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(profitAmt)
            );
          } else {
            setBnbWalletBalance(
              (prev) => parseFloat(prev) - parseFloat(betAmt)
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
        })
        .catch((err) => {
          console.log(err);
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
    }
  };
  const handlePlaceBetPoly = () => {
    if (user && betAmt > 0.0) {
      //place bet
      const betData = {
        chain: chain,
        slider_value: sliderValue,
        roll_type: toggleRollOver,
        bet_amount: betAmt,
        multiplier: multiplierValue,
      };
      placeBet(user?.token, betData)
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
          //set return value
          //set return value
          if (betResult == "win") {
            setPolyWalletBalance(
              (prev) => parseFloat(prev) + parseFloat(profitAmt)
            );
          } else {
            setPolyWalletBalance(
              (prev) => parseFloat(prev) - parseFloat(betAmt)
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
        })
        .catch((err) => {
          console.log(err);
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
    }
  };

  useEffect(() => {
    setProfitAmt(
      parseFloat(
        (
          parseFloat(multiplierValue) * parseFloat(betAmt) -
          parseFloat(betAmt)
        ).toFixed(6)
      )
    );
  }, []);
  useEffect(() => {
    setWinChance(parseFloat((99.0 / multiplierValue).toFixed(2)));
    setProfitAmt(
      parseFloat(
        (
          parseFloat(multiplierValue) * parseFloat(betAmt) -
          parseFloat(betAmt)
        ).toFixed(6)
      )
    );
  }, [multiplierValue]);
  useEffect(() => {
    if (!toggleRollOver)
      setSliderValue(parseFloat(parseFloat(winChance).toFixed(2)));
    else setSliderValue(parseFloat((100.0 - parseFloat(winChance)).toFixed(2)));
  }, [winChance]);
  useEffect(() => {
    if (chain == "eth") {
      if (betAmt > parseFloat(walletBalance))
        setBetAmt(parseFloat(Math.floor(walletBalance * 10000) / 10000));
    } else if (chain == "bsc") {
      if (betAmt > parseFloat(bnbWalletBalance))
        setBetAmt(parseFloat(Math.floor(bnbWalletBalance * 10000) / 10000));
    } else {
      if (betAmt > parseFloat(polyWalletBalance))
        setBetAmt(parseFloat(Math.floor(polyWalletBalance * 10000) / 10000));
    }
  }, [chain]);

  return (
    <div className="flex flex-col items-center">
      <form>
        <div className="w-64 sm:w-96 md:w-152 flex flex-wrap items-center justify-between">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <BetValueField
              betAmt={betAmt}
              multiplierValue={multiplierValue}
              setBetAmt={setBetAmt}
              setProfitAmt={setProfitAmt}
              walletBalance={walletBalance}
              bnbWalletBalance={bnbWalletBalance}
              polyWalletBalance={polyWalletBalance}
              chain={chain}
            />
            <div className="w-full md:w-1/2 h-16">
              <label
                htmlFor="profit"
                className="text-xs text-formtext font-medium">
                Profit on win
              </label>
              <div className="h-10 px-8 rounded-md shadow-inner text-sm font-medium p-3 bg-inputbg w-full flex items-center">
                {profitAmt}
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
          />
          <div className="w-full mt-12 h-20 flex items-center justify-center p-2">
            <button
              type="button"
              className="text-md font-medium rounded-md bg-primary-100 text-secondary px-28 py-3 rounded"
              id="rollBtn"
              onClick={() => {
                if (chain == "eth") handlePlaceBet();
                else if (chain == "bsc") handlePlaceBetBnb();
                else handlePlaceBetPoly();
              }}>
              Roll dice
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

export default ManualFormComponent;
