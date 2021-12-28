import React, { useEffect } from "react";
import { XIcon } from "@heroicons/react/solid";
const BetValueField = ({
  setBetAmt,
  betAmt,
  setProfitAmt,
  multiplierValue,
}) => {
  useEffect(() => {
    if (setProfitAmt != undefined)
      setProfitAmt((multiplierValue * betAmt).toFixed(6));
  }, [betAmt]);
  return (
    <div className="w-full md:w-1/2 md:mr-2 h-16">
      <label htmlFor="bettingAmt" className="text-xs font-medium">
        Bet Amount
      </label>
      <div className="p-0.5 bg-gray-200 rounded w-full h-10 flex items-center justify-start">
        <input
          className="px-2 py-2 rounded font-medium text-sm w-full text-center"
          type="number"
          name="bettingAmt"
          step="0.000001"
          min="0.000000"
          onBlur={(e) => {
            e.target.value = Number(e.target.value).toFixed(6);
            if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
            setBetAmt(e.target.value);
          }}
          value={betAmt}
          onChange={(e) => {
            setBetAmt(e.target.value);
          }}
        />
        <button
          className="text-xs font-medium px-2 border-r-2 border-gray-400 flex items-center justify-center rounded-l hover:bg-gray-300 h-full"
          onClick={() => {
            setBetAmt((prev) => parseFloat((0.5 * prev).toFixed(6)));
          }}
          type="button"
        >
          1/2
        </button>
        <button
          className="text-xs font-medium px-2 flex items-center justify-center rounded-r hover:bg-gray-300 h-full"
          onClick={() => {
            setBetAmt((prev) => parseFloat((2.0 * prev).toFixed(6)));
          }}
          type="button"
        >
          2 <XIcon className="h-2 w-2" />
        </button>
      </div>
    </div>
  );
};

export default BetValueField;
