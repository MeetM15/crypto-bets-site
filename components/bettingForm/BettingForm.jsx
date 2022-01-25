import { Tab } from "@headlessui/react";
import AutoFormComponent from "./AutoFormComponent";
import ManualFormComponent from "./ManualFormComponent";
import StrategyComponent from "./StrategyComponent";
const BettingForm = ({
  user,
  setUser,
  walletBalance,
  web3,
  web3_bsc,
  setWalletBalance,
  setToggleLoginModalOpen,
  bnbWalletBalance,
  setBnbWalletBalance,
  chain,
  socket,
  etherPrice,
  setEtherPrice,
  binancePrice,
  setBinancePrice,
  totalBetAmt,
  setTotalBetAmt,
  setMyBets,
  myBets,
}) => {
  return (
    <div className="bg-secondary p-2 md:p-7 rounded-2xl mt-12">
      <Tab.Group>
        <Tab.List className="w-full flex items-center bg-inputbg rounded-lg p-1 md:p-2.5">
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/3 font-medium mr-2 px-4 md:px-12 py-3 text-xs md:text-sm rounded-md bg-secondary text-primary-100"
                : "w-1/3 font-medium mr-2 px-4 md:px-12 py-3 text-xs md:text-sm rounded-md bg-inputbg"
            }>
            Manual
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/3 font-medium mr-2 px-4 md:px-12 py-3 text-xs md:text-sm rounded-md bg-secondary text-primary-100"
                : "w-1/3 font-medium mr-2 px-4 md:px-12 py-3 text-xs md:text-sm rounded-md bg-inputbg"
            }>
            Auto
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "w-1/3 font-medium px-4 md:px-12 py-3 text-xs md:text-sm  py-3 rounded-md bg-secondary text-primary-100"
                : "w-1/3 font-medium px-4 md:px-12 py-3 text-xs md:text-sm  py-3 rounded-md bg-inputbg"
            }>
            Advanced
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
              etherPrice={etherPrice}
              setEtherPrice={setEtherPrice}
              binancePrice={binancePrice}
              setBinancePrice={setBinancePrice}
              setUser={setUser}
              totalBetAmt={totalBetAmt}
              setTotalBetAmt={setTotalBetAmt}
              setMyBets={setMyBets}
              myBets={myBets}
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
              etherPrice={etherPrice}
              setEtherPrice={setEtherPrice}
              binancePrice={binancePrice}
              setBinancePrice={setBinancePrice}
              setUser={setUser}
              totalBetAmt={totalBetAmt}
              setTotalBetAmt={setTotalBetAmt}
              setMyBets={setMyBets}
              myBets={myBets}
            />
          </Tab.Panel>
          <Tab.Panel>
            <StrategyComponent
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
              etherPrice={etherPrice}
              setEtherPrice={setEtherPrice}
              binancePrice={binancePrice}
              setBinancePrice={setBinancePrice}
              setUser={setUser}
              totalBetAmt={totalBetAmt}
              setTotalBetAmt={setTotalBetAmt}
              setMyBets={setMyBets}
              myBets={myBets}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BettingForm;
