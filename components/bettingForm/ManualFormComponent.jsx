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

const ManualFormComponent = ({
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

  const handlePlaceBetBnb = () => {
    if (user && user[0]) {
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set return value
      if (betResult == "green") {
        setBnbWalletBalance((prev) => parseFloat(prev) + parseFloat(profitAmt));
      } else {
        setBnbWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));
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
              ? (parseFloat(betAmt) + parseFloat(profitAmt)).toFixed(8)
              : `-${betAmt}`,
          email: user[0].email,
          chain: chain,
          betResult: betResult == "green" ? true : false,
          betAmt: betAmt,
          profitAmt: profitAmt,
        };
        console.log("bet data : ", betData);
        axios
          .post("/bet", betData)
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
            setBnbWalletBalance(parseFloat(res) - 0.000001);
            console.log("enable click");
            if (document.getElementById("rollBtn").hasAttribute("disabled"))
              document.getElementById("rollBtn").removeAttribute("disabled");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;
      //set return value
      if (betResult == "green") {
        setBnbWalletBalance((prev) => parseFloat(prev) + parseFloat(profitAmt));
      } else {
        setBnbWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));
      document.getElementById("diceResult").style.color = betResult;
      console.log("enable click");
      if (document.getElementById("rollBtn").hasAttribute("disabled"))
        document.getElementById("rollBtn").removeAttribute("disabled");
    }
  };
  const handlePlaceBet = () => {
    if (user && user[0]) {
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;

      //set return value
      if (betResult == "green") {
        setWalletBalance((prev) => parseFloat(prev) + parseFloat(profitAmt));
      } else {
        setWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));
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
              ? (parseFloat(betAmt) + parseFloat(profitAmt)).toFixed(8)
              : `-${betAmt}`,
          email: user[0].email,
          chain: chain,
          betResult: betResult == "green" ? true : false,
          betAmt: betAmt,
          profitAmt: profitAmt,
        };
        console.log("bet data : ", betData);
        axios
          .post("/bet", betData)
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
            setWalletBalance(parseFloat(res) - 0.00003);
            console.log("enable click");
            if (document.getElementById("rollBtn").hasAttribute("disabled"))
              document.getElementById("rollBtn").removeAttribute("disabled");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      const result = placeBet(sliderValue, toggleRollOver);
      const betResult = result[0];
      const diceValue = result[1];
      document.getElementById("dice").style.left = `calc(${Math.floor(
        diceValue
      )}% - 2rem)`;
      //set return value
      if (betResult == "green") {
        setWalletBalance((prev) => parseFloat(prev) + parseFloat(profitAmt));
      } else {
        setWalletBalance((prev) => parseFloat(prev) - parseFloat(betAmt));
      }
      setShowDice("flex");
      setTimeout(() => {
        setShowDice("hidden");
      }, 3000);
      setResult(parseFloat(diceValue.toFixed(2)));
      document.getElementById("diceResult").style.color = betResult;
      console.log("enable click");
      if (document.getElementById("rollBtn").hasAttribute("disabled"))
        document.getElementById("rollBtn").removeAttribute("disabled");
    }
  };

  useEffect(() => {
    console.log("enable click");
    if (document.getElementById("rollBtn").hasAttribute("disabled"))
      document.getElementById("rollBtn").removeAttribute("disabled");
  }, [walletBalance]);
  useEffect(() => {
    console.log("enable click");
    if (document.getElementById("rollBtn").hasAttribute("disabled"))
      document.getElementById("rollBtn").removeAttribute("disabled");
  }, [bnbWalletBalance]);

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
              chain={chain}
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
                if (chain == "eth") handlePlaceBet();
                else handlePlaceBetBnb();
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

export default ManualFormComponent;
