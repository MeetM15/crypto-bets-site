import { Tab } from "@headlessui/react";
import AutoFormComponent from "./AutoFormComponent";
import ManualFormComponent from "./ManualFormComponent";

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
  socket,
}) => {
  return (
    <div className="bg-secondary p-2 md:p-7 rounded-2xl mt-12">
      <Tab.Group>
        <Tab.List className="w-full flex items-center bg-inputbg rounded-lg p-2.5">
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/2 font-medium mr-2 px-8 md:px-24 py-3 rounded-md bg-secondary text-primary-100"
                : "w-1/2 font-medium mr-2 px-8 md:px-24 py-3 rounded-md bg-inputbg"
            }>
            Manual
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/2 font-medium mr-2 px-8 md:px-24 py-3 rounded-md bg-secondary text-primary-100"
                : "w-1/2 font-medium mr-2 px-8 md:px-24 py-3 rounded-md bg-inputbg"
            }>
            Auto
          </Tab>
        </Tab.List>
        <Tab.Panels className="p-4 mt-2 bg-secondary rounded">
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
              socket={socket}
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
              socket={socket}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BettingForm;
