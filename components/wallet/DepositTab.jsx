import { ChevronDownIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

import { useState } from "react";
const DepositTab = ({ user }) => {
  const [depositCurrency, setDepositCurrency] = useState([
    "ETH",
    "/icons/eth.svg",
  ]);
  return (
    <div className="flex flex-col justify-evenly items-center p-4 gap-4">
      <span className="flex justify-center items-center">
        <Menu as="div" className="relative px-2 py-1 bg-secondary rounded-md">
          <div>
            <Menu.Button className="flex items-center justify-between text-xs sm:text-sm text-white font-medium">
              {depositCurrency[0]}
              <img
                src={depositCurrency[1]}
                alt="logo"
                className="md:p-1 p-0.5 w-4 sm:w-5"
              />
              <ChevronDownIcon className="ml-1 sm:ml-2 h-6 w-6 opacity-60" />
            </Menu.Button>
          </div>
          <Transition
            enter="transition-opacity ease-linear duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ">
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
                  onClick={() => setDepositCurrency(["ETH", "/icons/eth.svg"])}>
                  ETH
                  <img
                    src={"/icons/eth.svg"}
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
        {user && user[0] ? (
          <span className="flex flex-col items-center justify-center font-medium text-mdbg-secondary w-full rounded py-2">
            <span className="text-left w-full">Wallet address :</span>
            <span className="text-center font-medium text-md p-2 bg-secondary w-full rounded break-all md:break-none flex items-center justify-center">
              {depositCurrency[0] == "ETH"
                ? user[0].address
                : user[0].bscAddress}
              <DocumentDuplicateIcon
                className="w-8 h-8 text-white ml-2 cursor-pointer hover:bg-primary rounded"
                onClick={() => {
                  navigator.clipboard.writeText(
                    depositCurrency[0] == "ETH"
                      ? user[0].address
                      : user[0].bscAddress
                  );
                }}
              />
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
