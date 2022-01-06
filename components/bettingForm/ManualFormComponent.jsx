import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-input-slider";
import BetValueField from "./fields/BetValueField";
import ChancesFields from "./fields/ChancesFields";

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

const ManualFormComponent = ({ user, walletBalance, web3 }) => {
  const [betAmt, setBetAmt] = useState(0.0);
  const [profitAmt, setProfitAmt] = useState(0.0);
  const [totalReturnValue, setTotalReturnValue] = useState(0.0);
  const [toggleRollOver, setToggleRollOverOver] = useState(true); //true - roll over , false - roll under
  const [sliderValue, setSliderValue] = useState(1.99);
  const [multiplierValue, setMultiplierValue] = useState(1.01);
  const [winChance, setWinChance] = useState(
    parseFloat((100 - 1.99).toFixed(2))
  );
  const [showDice, setShowDice] = useState("hidden");
  const [result, setResult] = useState();

  const handlePlaceBet = () => {
    web3.eth
      .getBalance(user[0].address)
      .then((res) => {
        return web3.utils.fromWei(res);
      })
      .then((currBal) => {
        if (betAmt < parseFloat(currBal)) {
          const result = placeBet(sliderValue, toggleRollOver);
          const betResult = result[0];
          const diceValue = result[1];
          document.getElementById("dice").style.left = `calc(${Math.floor(
            diceValue
          )}% - 2rem)`;

          //set return value
          if (betResult == "green") {
            setTotalReturnValue(
              (parseFloat(betAmt) + parseFloat(profitAmt)).toFixed(6)
            );
          } else {
            setTotalReturnValue(-parseFloat(betAmt).toFixed(6));
          }
          setResult(parseFloat(diceValue.toFixed(2)));
          document.getElementById("diceResult").style.color = betResult;
          if (user[0] != undefined) {
            const betData = {
              email: user[0].email,
              betResult: betResult == "green" ? true : false,
              betAmt: betAmt,
              profitAmt: profitAmt,
            };
            console.log("bet data : ", betData);
            axios.post("/bet", betData).then((res) => {
              console.log(res);
            });
          }
        } else {
          console.log("insufficient balance!");
        }
      });
  };

  useEffect(() => {
    console.log("Return Value : ", totalReturnValue);
  }, [totalReturnValue]);

  useEffect(() => {
    if (result != undefined) {
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 5000);
    }
  }, [result]);

  useEffect(() => {
    setProfitAmt(
      (
        parseFloat(multiplierValue) * parseFloat(betAmt) -
        parseFloat(betAmt)
      ).toFixed(6)
    );
  }, []);
  useEffect(() => {
    setProfitAmt(
      (
        parseFloat(multiplierValue) * parseFloat(betAmt) -
        parseFloat(betAmt)
      ).toFixed(6)
    );
  }, [multiplierValue]);
  useEffect(() => {
    if (!toggleRollOver) setSliderValue(parseFloat(winChance).toFixed(4));
    else setSliderValue((100.0 - parseFloat(winChance)).toFixed(4));
  }, [winChance]);

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
            />
            <div className="w-full md:w-1/2 h-16">
              <label htmlFor="profit" className="text-xs font-medium">
                Profit on win
              </label>
              <div className="h-10 rounded text-sm font-medium p-3 bg-gray-200 w-full flex items-center justify-center">
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
          <div className="w-full h-20 flex items-center justify-center p-2">
            <button
              type="button"
              className="text-md font-bold bg-btn1 text-white px-28 py-3 rounded"
              id="rollBtn"
              onClick={() => {
                console.log("disable click");
                document
                  .getElementById("rollBtn")
                  .setAttribute("disabled", "true");

                handlePlaceBet();

                setTimeout(() => {
                  console.log("enable click");
                  if (
                    document.getElementById("rollBtn").hasAttribute("disabled")
                  )
                    document
                      .getElementById("rollBtn")
                      .removeAttribute("disabled");
                }, 2000);
              }}>
              Roll dice
            </button>
          </div>
        </div>
      </form>
      <div className="p-2 mt-8 flex items-center justify-center">
        <div className="w-64 md:w-144 bg-secondary text-white rounded-full p-4 flex items-center justify-between gap-4">
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
                setSliderValue(parseFloat(x.toFixed(2)));
                if (!toggleRollOver) setWinChance(parseFloat(x.toFixed(2)));
                else setWinChance(parseFloat((100.0 - x).toFixed(2)));
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

export default ManualFormComponent;
