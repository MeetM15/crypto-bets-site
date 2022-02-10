import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";

import { useState } from "react";
const DepositTab = ({ user }) => {
  const [depositCurrency, setDepositCurrency] = useState([
    "ETH",
    "/icons/eth.svg",
  ]);
  return (
    <div className="flex flex-col justify-evenly items-center p-4 gap-4">
      <span className="flex justify-center items-center bg-inputbg py-8 px-7 rounded-lg">
        <Menu as="div" className="relative px-2 py-1 bg-secondary rounded-md">
          <div>
            <Menu.Button className="flex items-center justify-between text-xs sm:text-sm text-black font-medium">
              {depositCurrency[0]}
              <img
                src={depositCurrency[1]}
                alt="logo"
                className="md:p-1 p-0.5 w-4 sm:w-5"
              />
              <ChevronDownIcon className="p-1 m-1 ml-2 h-6 w-6 opacity-60 bg-inputbg rounded-lg" />
            </Menu.Button>
          </div>
          <Transition
            enter="transition-opacity ease-linear duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg py-1 bg-secondary ring-1 ring-black ring-opacity-5 ">
              <Menu.Item as="div">
                <span
                  className={
                    "px-2  py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() => setDepositCurrency(["ETH", "/icons/eth.svg"])}>
                  ETH
                  <img
                    src={"/icons/eth.svg"}
                    alt="logo"
                    className="md:p-1 p-0.5 w-3 sm:w-5"
                  />
                </span>
              </Menu.Item>
              <Menu.Item as="div">
                <span
                  className={
                    "px-2  py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() => setDepositCurrency(["BNB", "/icons/bnb.svg"])}>
                  BNB
                  <img
                    src={"/icons/bnb.svg"}
                    alt="logo"
                    className="md:p-1 p-0.5 w-4 sm:w-5"
                  />
                </span>
              </Menu.Item>
              <Menu.Item as="div">
                <span
                  className={
                    "px-2  py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
                  }
                  onClick={() =>
                    setDepositCurrency(["MATIC", "/icons/matic.svg"])
                  }>
                  MATIC
                  <img
                    src={"/icons/matic.svg"}
                    alt="logo"
                    className="md:p-1 p-0.5 w-3 sm:w-5"
                  />
                </span>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </span>
      <span className="w-full">
        {user ? (
          <span className="flex flex-col items-center justify-center font-medium bg-secondary w-full rounded py-2">
            <span className="text-left text-xs w-full font-medium text-formtext">
              Your {depositCurrency[0]} deposit address :
            </span>
            <span className="text-center font-medium text-sm px-1.5 py-1 bg-inputbg shadow-inner w-full rounded break-all md:break-none flex items-center justify-between">
              {depositCurrency[0] == "ETH"
                ? user.ethAddress
                : depositCurrency[0] == "BNB"
                ? user.bscAddress
                : user.polyAddress}
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1.5 bg-secondary text-btntext font-medium text-xs rounded-lg ml-2 w-20 sm:w-auto"
                onClick={() => {
                  navigator.clipboard.writeText(
                    depositCurrency[0] == "ETH"
                      ? user.ethAddress
                      : depositCurrency[0] == "BNB"
                      ? user.bscAddress
                      : user.polyAddress
                  );
                }}>
                Copy
              </button>
            </span>
          </span>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full px-4 pb-4">
            Login First!
          </div>
        )}
      </span>
    </div>
  );
};

export default DepositTab;
