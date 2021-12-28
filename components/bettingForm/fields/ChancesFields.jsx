import { XIcon } from "@heroicons/react/solid";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";

const ChancesFields = ({
  toggleRollOver,
  sliderValue,
  setSliderValue,
  setToggleRollOverOver,
  winChance,
  setWinChance,
  multiplierValue,
  setMultiplierValue,
}) => {
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
            onClick={() => {
              setSliderValue((prevState) => {
                const newState = 100.0 - prevState - 0.02;
                return parseFloat(newState.toFixed(2));
              });
              setToggleRollOverOver(!toggleRollOver);
            }}
          >
            <span className="w-full h-full text-sm font-medium mr-2 flex items-center justify-center">
              {sliderValue}
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
            className="px-2 py-2 rounded-l font-medium text-sm w-full"
            type="number"
            name="multiplier"
            value={multiplierValue}
            min="1.01"
            onChange={(e) => {
              if (e.target.value >= 1.01) {
                setMultiplierValue(e.target.value);
                setWinChance((100.0 / e.target.value).toFixed(6));
              }
            }}
          />
          <button
            disabled
            className="text-xs bg-white font-medium px-2 flex items-center justify-center rounded-r h-full"
          >
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
            className="px-2 py-2 rounded-l font-medium text-sm w-full"
            type="number"
            name="winChance"
            min="0.01"
            max="97.99"
            onBlur={(e) => {
              if (e.target.value < 98.0) {
                e.target.value = Number(e.target.value).toFixed(4);
                if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
                setWinChance(e.target.value);
              }
            }}
            value={winChance}
            onChange={(e) => {
              if (e.target.value < 98.0) {
                setWinChance(e.target.value);
              }
            }}
          />
          <button
            disabled
            className="text-md bg-white font-bold px-2 flex items-center justify-center rounded-r h-full"
          >
            %
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChancesFields;
