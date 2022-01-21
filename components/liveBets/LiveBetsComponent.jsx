import { Tab } from "@headlessui/react";
import AllBets from "./AllBets";
import MyBets from "./MyBets";
const LiveBetsComponent = ({ currLiveBets, myBets }) => {
  return (
    <div className="w-full flex flex-col">
      <Tab.Group defaultIndex={1}>
        <Tab.List className="w-full flex items-center bg-secondary rounded-lg p-2.5">
          <Tab
            className={({ selected }) =>
              selected
                ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
            }>
            My Bets
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
            }>
            All Bets
          </Tab>
        </Tab.List>
        <div className="flex justify-center items-center font-medium text-xs sm:text-sm text-btntext">
          <span className="bg-primary-5 w-42 h-12 flex items-center border-b border-#E8E8E8 px-8 p-2">
            Bet Id
          </span>
          <span className="bg-primary-10 w-42 h-12 items-center justify-center border-b border-#E8E8E8 p-2 hidden xsm:flex">
            User
          </span>
          <span className="bg-primary-5 w-32 h-12 items-center justify-center border-b border-#E8E8E8 p-2 hidden lg:flex">
            Time
          </span>
          <span className="bg-primary-10 w-42 h-12 items-center justify-center border-b border-#E8E8E8 p-2 hidden lg:flex">
            Bet
          </span>
          <span className="bg-primary-5 w-32 h-12 items-center justify-center border-b border-#E8E8E8 p-2 hidden xsm:flex">
            Multiplier
          </span>
          <span className="bg-primary-10 w-32 flex h-12 items-center justify-center border-b border-#E8E8E8 p-2">
            Result
          </span>
          <span className="bg-primary-5 w-42 h-12 flex items-center justify-center border-b border-#E8E8E8 p-2">
            Payout
          </span>
        </div>
        <Tab.Panels className="bg-secondary rounded">
          <Tab.Panel>
            <MyBets myBets={myBets} />
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex flex-col">
              <AllBets currLiveBets={currLiveBets} />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LiveBetsComponent;
