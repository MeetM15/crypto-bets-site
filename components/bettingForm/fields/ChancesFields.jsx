import { XIcon } from "@heroicons/react/solid";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
const ChancesFields = ({
  toggleRollOver,
  sliderValue,
  setSliderValue,
  setToggleRollOverOver,
  winChance,
  setWinChance,
  multiplierValue,
  setMultiplierValue,
  disableClick,
}) => {
  const [rollValue, setRollValue] = useState(sliderValue);
  useEffect(() => {
    setRollValue(parseFloat(sliderValue.toFixed(2)));
    if (toggleRollOver) {
      setMultiplierValue(
        parseFloat(
          (99.0 / parseFloat(100.0 - parseFloat(sliderValue))).toFixed(4)
        )
      );
    } else {
      setMultiplierValue(
        parseFloat((99.0 / parseFloat(sliderValue)).toFixed(4))
      );
    }
  }, [sliderValue]);
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full">
      <div className="rounded w-full md:w-48 pt-3 px-2 pb-2 flex flex-col mt-2 bg-gray-200 h-20">
        <label htmlFor="roll" className="text-xs font-medium">
          {toggleRollOver ? "Roll Over" : "Roll Under"}
        </label>
        <div className="p-0.5 h-10 flex items-center justify-start">
          <button
            className="text-xs bg-white font-medium px-2 w-full flex items-center justify-center rounded h-full"
            type="button"
            disabled={disableClick != undefined ? disableClick : false}
            onClick={() => {
              setSliderValue((prevState) => {
                const newState = 100.0 - prevState;
                return parseFloat(newState.toFixed(2));
              });
              setToggleRollOverOver(!toggleRollOver);
            }}>
            <span className="w-full h-full text-sm font-medium mr-2 flex items-center justify-center">
              {rollValue}
            </span>
            <SwitchHorizontalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="rounded w-full md:w-48 pt-3 px-2 pb-2 flex flex-col mt-2 bg-gray-200 h-20">
        <label htmlFor="multiplier" className="text-xs font-medium">
          Multiplier
        </label>
        <div className="p-0.5 h-10 flex items-center justify-start">
          <input
            className="px-2 py-2 rounded-l font-medium text-sm w-full text-center bg-white"
            disabled={disableClick != undefined ? disableClick : false}
            type="number"
            name="multiplier"
            min="1.0102"
            step="1.0"
            onBlur={(e) => {
              e.target.value = Number(e.target.value);
              if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
              if (e.target.value >= 0 && e.target.value < 1.0102)
                e.target.value = 1.0102;
              setMultiplierValue(
                parseFloat(parseFloat(e.target.value).toFixed(4))
              );
              setWinChance(parseFloat((99.0 / e.target.value).toFixed(2)));
            }}
            value={multiplierValue}
            onChange={(e) => {
              setMultiplierValue(
                parseFloat(parseFloat(e.target.value).toFixed(4))
              );
              if (e.target.value != undefined && e.target.value > 1.0101)
                setWinChance(parseFloat((99.0 / e.target.value).toFixed(2)));
            }}
          />
          <button
            disabled
            className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="rounded w-full md:w-48 pt-3 px-2 pb-2 flex flex-col mt-2 bg-gray-200 h-20">
        <label htmlFor="winChance" className="text-xs font-medium">
          Win Chance
        </label>
        <div className="p-0.5 h-10 flex items-center justify-start">
          <input
            className="px-2 py-2 rounded-l font-medium text-sm w-full text-center bg-white"
            disabled={disableClick != undefined ? disableClick : false}
            type="number"
            name="winChance"
            min="0.01"
            max="98.00"
            onBlur={(e) => {
              if (e.target.value <= 98.0) {
                e.target.value = parseFloat(e.target.value);
                if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
                if (e.target.value == 0.0) e.target.value = 0.01;
                setWinChance(parseFloat(parseFloat(e.target.value).toFixed(2)));
              } else {
                e.target.value = 98.0;
                setWinChance(parseFloat(parseFloat(e.target.value).toFixed(2)));
              }
            }}
            value={winChance}
            onChange={(e) => {
              if (e.target.value <= 98.0) {
                setWinChance(parseFloat(parseFloat(e.target.value).toFixed(2)));
              }
            }}
          />
          <button
            disabled
            className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full">
            %
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChancesFields;
