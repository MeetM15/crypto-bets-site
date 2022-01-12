import { Tab } from "@headlessui/react";
import AutoFormComponent from "./AutoFormComponent";
import ManualFormComponent from "./ManualFormComponent";

import { useState } from "react";
const BettingForm = ({
  user,
  walletBalance,
  web3,
  web3_bsc,
  setWalletBalance,
  setToggleLoginModalOpen,
  bnbWalletBalance,
  setBnbWalletBalance,
  chain,
}) => {
  return (
    <div className="bg-gray-200 p-2 rounded">
      <Tab.Group>
        <Tab.List className="w-full flex items-center bg-gray-200">
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/2 font-medium mr-2 px-12 py-2 rounded bg-white"
                : "w-1/2 font-medium mr-2 px-12 py-2 rounded bg-gray-200"
            }>
            Manual
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/2 font-medium mr-2 px-12 py-2 rounded bg-white"
                : "w-1/2 font-medium mr-2 px-12 py-2 rounded bg-gray-200"
            }>
            Auto
          </Tab>
        </Tab.List>
        <Tab.Panels className="p-4 mt-2 bg-white rounded">
          <Tab.Panel>
            <ManualFormComponent
              user={user}
              walletBalance={walletBalance}
              bnbWalletBalance={bnbWalletBalance}
              web3={web3}
              web3_bsc={web3_bsc}
              setWalletBalance={setWalletBalance}
              setBnbWalletBalance={setBnbWalletBalance}
              setToggleLoginModalOpen={setToggleLoginModalOpen}
              chain={chain}
            />
          </Tab.Panel>
          <Tab.Panel>
            <AutoFormComponent
              user={user}
              walletBalance={walletBalance}
              bnbWalletBalance={bnbWalletBalance}
              web3={web3}
              web3_bsc={web3_bsc}
              setWalletBalance={setWalletBalance}
              setBnbWalletBalance={setBnbWalletBalance}
              setToggleLoginModalOpen={setToggleLoginModalOpen}
              chain={chain}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BettingForm;
