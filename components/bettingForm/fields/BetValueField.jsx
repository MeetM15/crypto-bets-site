import React, { useEffect } from "react";
import { XIcon } from "@heroicons/react/solid";
const BetValueField = ({
  setBetAmt,
  betAmt,
  setProfitAmt,
  multiplierValue,
  walletBalance,
  disableClick,
  bnbWalletBalance,
  chain,
}) => {
  useEffect(() => {
    if (setProfitAmt != undefined)
      setProfitAmt(
        (
          parseFloat(multiplierValue) * parseFloat(betAmt) -
          parseFloat(betAmt)
        ).toFixed(6)
      );
  }, [betAmt]);
  return (
    <div className="w-full md:w-1/2 md:mr-2 h-16">
      <label htmlFor="bettingAmt" className="text-xs font-medium">
        Bet Amount
      </label>
      <div className="p-0.5 bg-gray-200 rounded w-full h-10 flex items-center justify-start">
        <input
          className="px-2 py-2 rounded font-medium text-sm w-full text-center"
          disabled={disableClick != undefined ? disableClick : false}
          type="number"
          name="bettingAmt"
          step="0.0001"
          min="0.0000"
          max={chain == "eth" ? walletBalance : bnbWalletBalance}
          onBlur={(e) => {
            if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
            if (e.target.value == "") e.target.value = 0.0;
            setBetAmt(() => {
              if (chain == "eth") {
                if (parseFloat(e.target.value) > walletBalance)
                  e.target.value = walletBalance;
              } else {
                if (parseFloat(e.target.value) > bnbWalletBalance)
                  e.target.value = bnbWalletBalance;
              }
              return parseFloat(parseFloat(e.target.value).toFixed(4));
            });
          }}
          value={betAmt}
          onChange={(e) => {
            setBetAmt(parseFloat(parseFloat(e.target.value).toFixed(4)));
          }}
          id="betValue"
        />
        <button
          className="text-xs font-medium px-2 border-r-2 border-gray-400 flex items-center justify-center rounded-l hover:bg-gray-300 h-full"
          disabled={disableClick != undefined ? disableClick : false}
          onClick={() => {
            setBetAmt((prev) => {
              const newValue = 0.5 * parseFloat(prev);
              if (chain == "eth") {
                if (parseFloat(newValue) > walletBalance)
                  newValue = walletBalance;
              } else {
                if (parseFloat(newValue) > bnbWalletBalance)
                  newValue = bnbWalletBalance;
              }
              return parseFloat(parseFloat(newValue).toFixed(4));
            });
          }}
          type="button">
          1/2
        </button>
        <button
          disabled={disableClick != undefined ? disableClick : false}
          className="text-xs font-medium px-2 flex items-center justify-center rounded-r hover:bg-gray-300 h-full"
          onClick={() => {
            setBetAmt((prev) => {
              const newValue = 2.0 * parseFloat(prev);
              if (chain == "eth") {
                if (parseFloat(newValue) > walletBalance)
                  newValue = walletBalance;
              } else {
                if (parseFloat(newValue) > bnbWalletBalance)
                  newValue = bnbWalletBalance;
              }
              return parseFloat(parseFloat(newValue).toFixed(4));
            });
          }}
          type="button">
          2 <XIcon className="h-2 w-2" />
        </button>
      </div>
    </div>
  );
};

export default BetValueField;
