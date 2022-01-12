import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

import { useState } from "react";
import WithdrawForm from "../withdrawForm/WithdrawForm";
const WithdrawTab = ({
  user,
  walletBalance,
  bnbWalletBalance,
  chain,
  web3,
  web3_bsc,
  setWalletBalance,
  setBnbWalletBalance,
}) => {
  const [withdrawChain, setWithdrawChain] = useState(chain);
  const [amount, setAmount] = useState(0.0);
  const [currency, setCurrency] = useState(["ETH", "/icons/eth.svg"]);
  return (
    <div className="flex flex-col justify-evenly items-center p-2 sm:p-8 gap-2">
      <span className="flex justify-center items-center">
        <Menu
          as="div"
          className="relative px-2 py-1 w-full bg-secondary rounded-md">
          <div>
            <Menu.Button className="flex items-center justify-between text-xs text-white font-medium">
              {currency[0] && currency[1] ? (
                <>
                  {withdrawChain == "eth"
                    ? parseFloat(walletBalance).toFixed(8)
                    : parseFloat(bnbWalletBalance).toFixed(8)}
                  <img
                    src={currency[1]}
                    alt="logo"
                    className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-1"
                  />
                </>
              ) : (
                ""
              )}
              <ChevronDownIcon className="ml-1 sm:ml-2 h-6 w-6 opacity-60" />
            </Menu.Button>
          </div>
          <Transition
            enter="transition-opacity ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
              <Menu.Item>
                <span
                  className={
                    "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-start font-medium"
                  }
                  onClick={() => {
                    if (amount > parseFloat(walletBalance))
                      setAmount(walletBalance);
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
                    "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-start font-medium"
                  }
                  onClick={() => {
                    if (amount > parseFloat(bnbWalletBalance))
                      setAmount(bnbWalletBalance);
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
            </Menu.Items>
          </Transition>
        </Menu>
      </span>
      <span>
        <WithdrawForm
          walletBalance={walletBalance}
          bnbWalletBalance={bnbWalletBalance}
          user={user}
          withdrawChain={withdrawChain}
          amount={amount}
          setAmount={setAmount}
          web3={web3}
          web3_bsc={web3_bsc}
          setWalletBalance={setWalletBalance}
          setBnbWalletBalance={setBnbWalletBalance}
        />
      </span>
      <div className="font-medium text-xs px-4 text-gray-600">
        Your withdrawal will have 0.00020000 subtracted from your remaining
        balance to cover the fee required to process the transaction.
      </div>
    </div>
  );
};

export default WithdrawTab;
