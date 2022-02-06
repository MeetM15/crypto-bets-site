import React from "react";

const MyBets = ({ myBets }) => {
  return myBets.map((currBet, index) => {
    return (
      <div
        key={index}
        className="flex justify-start items-center font-medium text-xs sm:text-sm text-black">
        <span className="w-42 h-12 bg-primary-5 px-8 p-2">{currBet.betId}</span>
        <span className="w-42 h-12 items-center justify-center bg-primary-10 p-2 hidden xsm:flex">
          {currBet.username}
        </span>
        <span className="w-32 h-12 items-center justify-center bg-primary-5 p-2 hidden lg:flex">
          {currBet.time}
        </span>
        <span className="w-42 h-12 bg-primary-10 p-2 flex items-center justify-center hidden lg:flex">
          {currBet.betAmt}
          {currBet.chain == "eth" ? (
            <img
              src="/icons/eth.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          ) : currBet.chain == "bsc" ? (
            <img
              src="/icons/bnb.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          ) : (
            <img
              src="/icons/matic.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          )}
        </span>
        <span className="w-32 h-12 items-center justify-center bg-primary-5 p-2 hidden xsm:flex">{`${currBet.multiplier}x`}</span>
        <span className="w-32 h-12 flex items-center justify-center bg-primary-10 p-2">
          {currBet.result}
        </span>
        <span className="w-42 h-12 bg-primary-5 justify-center p-2 flex items-center justify-center">
          {currBet.payout}
          {currBet.chain == "eth" ? (
            <img
              src="/icons/eth.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          ) : currBet.chain == "bsc" ? (
            <img
              src="/icons/bnb.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          ) : (
            <img
              src="/icons/matic.svg"
              alt="logo"
              className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-0.5"
            />
          )}
        </span>
      </div>
    );
  });
};

export default MyBets;
