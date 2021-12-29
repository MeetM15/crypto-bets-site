import { useEffect, useState } from "react";
import Slider from "react-input-slider";
import BetValueField from "./fields/BetValueField";
import ChancesFields from "./fields/ChancesFields";

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};
const placeBet = (sliderValue, rollType) => {
  const result = getRandomArbitrary(0.0, 100.0);
  if (rollType) {
    if (result >= sliderValue) {
      console.log("You win ! Result: ", result);
    } else {
      console.log("You Lose ! Result: ", result);
    }
  } else {
    if (result <= sliderValue) {
      console.log("You win ! Result: ", result);
    } else {
      console.log("You Lose ! Result: ", result);
    }
  }
};

const ManualFormComponent = ({ betTurnout, setBetTurnout }) => {
  const [betAmt, setBetAmt] = useState(0.0);
  const [profitAmt, setProfitAmt] = useState(0.0);
  const [toggleRollOver, setToggleRollOverOver] = useState(true); //true - roll over , false - roll under
  const [sliderValue, setSliderValue] = useState(1.99);
  const [multiplierValue, setMultiplierValue] = useState(1.01);
  const [winChance, setWinChance] = useState(
    parseFloat((100 - 1.99).toFixed(2))
  );

  useEffect(() => {
    setProfitAmt(
      parseFloat(
        (Number(multiplierValue).toFixed(6) * betAmt - betAmt).toFixed(6)
      )
    );
  }, []);
  useEffect(() => {
    setProfitAmt(
      parseFloat(
        (Number(multiplierValue).toFixed(6) * betAmt - betAmt).toFixed(6)
      )
    );
  }, [multiplierValue]);
  useEffect(() => {
    if (!toggleRollOver) setSliderValue(winChance.toFixed(4));
    else setSliderValue((100.0 - winChance).toFixed(4));
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
              onClick={() => {
                placeBet(sliderValue, toggleRollOver);
              }}
            >
              Roll dice
            </button>
          </div>
        </div>
      </form>
      <div className="p-2 flex items-center justify-center">
        <div className="w-64 md:w-144 bg-secondary text-white rounded-full p-4 flex items-center justify-between gap-4">
          <span className="font-medium text-sm">0</span>
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
              },
            }}
          />
          <span className="font-medium text-sm">100</span>
        </div>
      </div>
    </div>
  );
};

export default ManualFormComponent;