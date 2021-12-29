import {
  VariableIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
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

const AutoFormComponent = () => {
  const [betAmt, setBetAmt] = useState(0.0);
  const [profitAmtAuto, setProfitAmtAuto] = useState(0.0);
  const [noOfBets, setNoOfBets] = useState(1);
  const [toggleRollOver, setToggleRollOverOver] = useState(true); //true - roll over , false - roll under
  const [sliderValue, setSliderValue] = useState(1.99);
  const [multiplierValue, setMultiplierValue] = useState(1.01);
  const [winChance, setWinChance] = useState(
    parseFloat((100 - 1.99).toFixed(2))
  );

  useEffect(() => {
    setProfitAmtAuto(
      parseFloat(
        (Number(multiplierValue).toFixed(6) * betAmt - betAmt).toFixed(6)
      )
    );
  }, []);
  useEffect(() => {
    setProfitAmtAuto(
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
            <BetValueField betAmt={betAmt} setBetAmt={setBetAmt} />
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
                      }
                    >
                      Reset
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-full"
                          : "rounded text-xs px-1 py-2.5 font-medium w-full"
                      }
                    >
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
                          className="text-md bg-white font-bold opacity-50 px-2 flex items-center justify-center rounded-r h-full"
                        >
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
                        />
                        <button
                          disabled
                          className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full"
                        >
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
                      }
                    >
                      Reset
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? "rounded bg-white text-xs px-1 py-2.5 font-medium w-full"
                          : "rounded text-xs px-1 py-2.5 font-medium w-full"
                      }
                    >
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
                          className="text-md bg-white font-bold opacity-50 px-2 flex items-center justify-center rounded-r h-full"
                        >
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
                        />
                        <button
                          disabled
                          className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full"
                        >
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
                />
                <button className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full">
                  <TrendingDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-20 flex items-center justify-center p-2">
            <button
              type="button"
              className="text-md font-bold bg-btn1 text-white px-28 py-3 rounded"
              onClick={() => {
                const timer = (ms) => new Promise((res) => setTimeout(res, ms));
                async function load() {
                  for (let i = 0; i < noOfBets; i++) {
                    placeBet(sliderValue, toggleRollOver);
                    await timer(1000); // then the created Promise can be awaited
                  }
                }
                load();
              }}
            >
              Roll dice
            </button>
          </div>
        </div>
      </form>
      <div className="p-2 w-full flex items-center justify-center">
        <div className="w-full md:w-144 text-white bg-secondary rounded-full p-4 flex items-center justify-between gap-4">
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
                opacity: 0.8,
              },
            }}
          />
          <span className="font-medium text-sm">100</span>
        </div>
      </div>
    </div>
  );
};

export default AutoFormComponent;
