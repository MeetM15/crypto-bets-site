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
    if (chain == "eth") {
      if (
        parseFloat(betAmt) >
        parseFloat(Math.floor(parseFloat(walletBalance) * 10000) / 10000)
      ) {
        setBetAmt(
          parseFloat(Math.floor(parseFloat(walletBalance) * 10000) / 10000)
        );
      }
    } else {
      if (
        parseFloat(betAmt) >
        parseFloat(Math.floor(parseFloat(bnbWalletBalance) * 10000) / 10000)
      ) {
        setBetAmt(
          parseFloat(Math.floor(parseFloat(bnbWalletBalance) * 10000) / 10000)
        );
      }
    }
  }, [chain]);
  useEffect(() => {
    if (setProfitAmt != undefined)
      setProfitAmt(
        parseFloat(
          Math.floor(
            (parseFloat(multiplierValue) * parseFloat(betAmt) -
              parseFloat(betAmt)) *
              1000000
          ) / 1000000
        )
      );
  }, [betAmt]);
  return (
    <div className="w-full md:w-1/2 md:mr-2 h-16">
      <label htmlFor="bettingAmt" className="text-xs text-formtext font-medium">
        Bet Amount
      </label>
      <div className="p-1 rounded-md shadow-inner w-full h-10 flex items-center justify-start  bg-inputbg">
        <input
          className=" px-7 py-2 bg-inputbg rounded font-medium text-sm w-full"
          disabled={disableClick != undefined ? disableClick : false}
          type="number"
          name="bettingAmt"
          step="0.0001"
          min="0.0"
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
              return parseFloat(Math.floor(e.target.value * 10000) / 10000);
            });
          }}
          value={betAmt}
          onChange={(e) => {
            setBetAmt(parseFloat(Math.floor(e.target.value * 10000) / 10000));
          }}
          id="betValue"
        />
        <button
          className="text-xs text-btntext font-medium p-2.5 border-r-2 flex items-center justify-center rounded-md bg-secondary h-full"
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
              return parseFloat(Math.floor(newValue * 10000) / 10000);
            });
          }}
          type="button">
          1/2
        </button>
        <button
          disabled={disableClick != undefined ? disableClick : false}
          className="text-xs text-btntext font-medium p-2.5 flex items-center justify-center rounded-md ml-1 bg-secondary h-full"
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
              return parseFloat(Math.floor(newValue * 10000) / 10000);
            });
          }}
          type="button">
          2 <XIcon className="h-2 w-2" />
        </button>
        <button
          disabled={disableClick != undefined ? disableClick : false}
          className="text-xs text-btntext font-medium p-2.5 flex items-center justify-center rounded-md ml-1 bg-secondary h-full"
          onClick={() => {
            setBetAmt((prev) => {
              var newValue;
              if (chain == "eth") {
                newValue = walletBalance;
              } else {
                newValue = bnbWalletBalance;
              }
              return parseFloat(Math.floor(newValue * 10000) / 10000);
            });
          }}
          type="button">
          max
        </button>
      </div>
    </div>
  );
};

export default BetValueField;
