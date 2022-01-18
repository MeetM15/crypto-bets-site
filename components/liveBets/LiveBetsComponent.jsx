import { Tab } from "@headlessui/react";
import AllBets from "./AllBets";
import MyBets from "./MyBets";
const LiveBetsComponent = ({ currLiveBets, myBets }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <Tab.Group defaultIndex={1}>
        <Tab.List className="w-full flex items-center border-b-2 border-gray-300">
          <Tab
            className={({ selected }) =>
              selected
                ? "w-auto text-sm font-medium mr-2 p-2 md:px-12 md:py-2 text-gray-800 border-b-2 border-gray-800 -mb-px"
                : "w-auto text-sm font-medium mr-2 p-2 md:px-12 md:py-2 text-gray-600 -mb-px"
            }>
            My Bets
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "w-auto text-sm font-medium mr-2 p-2 md:px-12 md:py-2 text-gray-800 border-b-2 border-gray-800 -mb-px"
                : "w-auto text-sm font-medium mr-2 p-2 md:px-12 md:py-2 text-gray-600 -mb-px"
            }>
            All Bets
          </Tab>
        </Tab.List>
        <div className="flex justify-evenly items-center font-medium text-xs sm:text-sm text-gray-700">
          <span className="w-32 p-2">Bet Id</span>
          <span className="w-38 text-center p-2 hidden xsm:block">User</span>
          <span className="w-24 text-center p-2 hidden lg:block">Time</span>
          <span className="w-38 text-center p-2 hidden lg:block">Bet</span>
          <span className="w-24 text-center p-2 hidden xsm:block">
            Multiplier
          </span>
          <span className="w-24 text-center p-2">Result</span>
          <span className="w-38 text-center p-2">Payout</span>
        </div>
        <Tab.Panels className="bg-white rounded">
          <Tab.Panel>
            <MyBets myBets={myBets} />
          </Tab.Panel>
          <Tab.Panel>
            <AllBets currLiveBets={currLiveBets} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LiveBetsComponent;
