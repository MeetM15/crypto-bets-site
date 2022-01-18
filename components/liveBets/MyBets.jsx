import React from "react";

const MyBets = ({ myBets }) => {
  return myBets.map((currBet, index) => {
    return (
      <div
        key={index}
        className="flex justify-evenly items-center font-medium text-xs sm:text-sm text-gray-500">
        <span className="w-32 p-2">{currBet.betId}</span>
        <span className="w-38 text-center p-2 hidden xsm:block">
          {currBet.username}
        </span>
        <span className="w-24 text-center p-2 hidden lg:block">
          {currBet.time}
        </span>
        <span className="w-38 text-center p-2 flex items-center justify-center  hidden lg:flex">
          {currBet.betAmt}
          {currBet.chain == "eth" ? (
            <img
              src="/icons/eth.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          ) : (
            <img
              src="/icons/bnb.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          )}
        </span>
        <span className="w-24 text-center p-2 hidden xsm:block">{`${currBet.multiplier}x`}</span>
        <span className="w-24 text-center p-2">{currBet.result}</span>
        <span className="w-38 text-center p-2 flex items-center justify-center">
          {currBet.payout}
          {currBet.chain == "eth" ? (
            <img
              src="/icons/eth.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-1"
            />
          ) : (
            <img
              src="/icons/bnb.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-1"
            />
          )}
        </span>
      </div>
    );
  });
};

export default MyBets;
