import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

import { useState } from "react";
import WithdrawForm from "../withdrawForm/WithdrawForm";
const WithdrawTab = ({
  user,
  walletBalance,
  bnbWalletBalance,
  polyWalletBalance,
  chain,
  setPoints,
  setWalletBalance,
  setBnbWalletBalance,
  setPolyWalletBalance,
}) => {
  const [withdrawChain, setWithdrawChain] = useState(chain);
  const [amount, setAmount] = useState(0.0);
  const [currency, setCurrency] = useState(["ETH", "/icons/eth.svg"]);
  return (
    <div className="flex flex-col justify-evenly items-center p-2 sm:p-8 gap-2">
      <span className="flex justify-center items-center bg-inputbg py-8 px-7 rounded-lg">
        <Menu
          as="div"
          className="relative px-2 py-1 w-full bg-secondary rounded-md">
          <div>
            <Menu.Button className="flex items-center justify-between text-xs text-black font-medium">
              {currency[0] && currency[1] ? (
                <>
                  {chain == "eth"
                    ? parseFloat(walletBalance).toFixed(8)
                    : chain == "bsc"
                    ? parseFloat(bnbWalletBalance).toFixed(8)
                    : parseFloat(polyWalletBalance).toFixed(8)}
                  <img
                    src={currency[1]}
                    alt="logo"
                    className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-1"
                  />
                </>
              ) : (
                ""
              )}
              <ChevronDownIcon className="p-1 m-1 ml-2 h-6 w-6 opacity-60 bg-inputbg rounded-lg" />
            </Menu.Button>
          </div>
          <Transition
            enter="transition-opacity ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full rounded-md shadow-lg py-1 bg-secondary ring-1 ring-black ring-opacity-5 z-10">
              <Menu.Item>
                <span
                  className={
                    "px-2 py-0.5 sm:py-1 text-xs text-black flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() => {
                    if (amount > parseFloat(walletBalance))
                      setAmount(
                        parseFloat(
                          Math.floor(walletBalance * 1000000) / 1000000
                        )
                      );
                    setWithdrawChain("eth");
                    setCurrency(["ETH", "/icons/eth.svg"]);
                  }}>
                  {parseFloat(walletBalance).toFixed(8)}
                  <img
                    src="/icons/eth.svg"
                    alt="logo"
                    className="md:p-1 p-0.5 w-3 sm:w-5"
                  />
                  ETH
                </span>
              </Menu.Item>
              <Menu.Item>
                <span
                  className={
                    "px-2 py-0.5 sm:py-1 text-xs text-black flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() => {
                    if (amount > parseFloat(bnbWalletBalance))
                      setAmount(
                        parseFloat(
                          Math.floor(bnbWalletBalance * 1000000) / 1000000
                        )
                      );
                    setWithdrawChain("bsc");
                    setCurrency(["BNB", "/icons/bnb.svg"]);
                  }}>
                  {parseFloat(bnbWalletBalance).toFixed(8)}
                  <img
                    src="/icons/bnb.svg"
                    alt="ethereum"
                    className="md:p-1 p-0.5 w-3 sm:w-5"
                  />
                  BNB
                </span>
              </Menu.Item>
              <Menu.Item>
                <span
                  className={
                    "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() => {
                    if (amount > parseFloat(polyWalletBalance))
                      setAmount(
                        parseFloat(
                          Math.floor(polyWalletBalance * 1000000) / 1000000
                        )
                      );
                    setWithdrawChain("poly");
                    setCurrency(["MATIC", "/icons/matic.svg"]);
                  }}>
                  {parseFloat(polyWalletBalance).toFixed(8)}
                  <img
                    src="/icons/matic.svg"
                    alt="ethereum"
                    className="md:p-1 p-0.5 w-3 sm:w-5"
                  />
                  MATIC
                </span>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </span>
      <span>
        <WithdrawForm
          walletBalance={walletBalance}
          bnbWalletBalance={bnbWalletBalance}
          polyWalletBalance={polyWalletBalance}
          user={user}
          withdrawChain={withdrawChain}
          amount={amount}
          setAmount={setAmount}
          setPoints={setPoints}
          setWalletBalance={setWalletBalance}
          setBnbWalletBalance={setBnbWalletBalance}
          setPolyWalletBalance={setPolyWalletBalance}
        />
      </span>
      <div className="font-medium text-xs px-4 text-btntext text-center">
        It can take upto 24 Hours for withdrawal.
      </div>
      <div className="font-medium text-xs px-4 text-btntext text-center">
        Your withdrawal will have 0.00020000 subtracted from your remaining
        balance to cover the fee required to process the transaction.
      </div>
    </div>
  );
};

export default WithdrawTab;
