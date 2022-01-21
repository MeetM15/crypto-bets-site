import { XIcon } from "@heroicons/react/solid";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { FiRepeat } from "react-icons/fi";
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
    <div className="flex flex-col md:flex-row items-center justify-between w-full mt-7 gap-4">
      <div className="rounded-md w-full md:w-48 p-3 flex flex-col justify-center gap-2 bg-inputbg h-28">
        <label htmlFor="roll" className="text-xs text-formtext font-medium">
          {toggleRollOver ? "Roll Over" : "Roll Under"}
        </label>
        <div className="p-0.5 h-12 flex items-center justify-start">
          <button
            className="text-xs bg-secondary rounded-md font-medium px-2 w-full flex items-center justify-center h-full"
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
            <FiRepeat
              className="text-btntext bg-inputbg p-2.5 rounded-md"
              size={"40px"}
            />
          </button>
        </div>
      </div>
      <div className="rounded-md w-full md:w-48 p-3 flex flex-col justify-center gap-2 bg-inputbg h-28">
        <label
          htmlFor="multiplier"
          className="text-xs text-formtext font-medium">
          Multiplier (x)
        </label>
        <div className="p-1 h-12 flex items-center justify-start">
          <input
            className="px-7 py-2 h-full font-medium rounded-l-md text-sm w-full bg-secondary"
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
            className="text-xs bg-secondary rounded-r-md font-medium px-2 flex items-center justify-center h-full">
            <XIcon className="w-4 h-4 text-btntext" />
          </button>
        </div>
      </div>
      <div className="rounded-md w-full md:w-48 p-3 flex flex-col justify-center gap-2 bg-inputbg h-28">
        <label
          htmlFor="winChance"
          className="text-xs text-formtext font-medium">
          Win Chance (%)
        </label>
        <div className="p-1 h-12 flex items-center justify-start">
          <input
            className="px-7 py-2 h-full rounded-l-md font-medium text-sm w-full bg-secondary"
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
            className="text-md text-btntext bg-secondary font-bold px-2 flex items-center justify-center rounded-r-md h-full">
            %
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChancesFields;
