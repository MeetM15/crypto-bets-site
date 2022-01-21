import { Tab, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import DepositTab from "../wallet/DepositTab";
import WithdrawTab from "../wallet/WithdrawTab";
import { XIcon } from "@heroicons/react/solid";

const Wallet = ({
  showWalletModal,
  setShowWalletModal,
  user,
  walletBalance,
  bnbWalletBalance,
  chain,
  web3,
  web3_bsc,
  setWalletBalance,
  setBnbWalletBalance,
}) => {
  return (
    <Transition.Root show={showWalletModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={setShowWalletModal}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block align-bottom text-left overflow-hidden transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="w-full flex justify-end py-2 bg-transparent">
                <button
                  type="button"
                  onClick={() => setShowWalletModal(false)}
                  className="text-xs bg-inputbg font-medium px-2 py-1.5 flex items-center justify-center rounded-lg h-full">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-md bg-secondary p-4">
                <Tab.Group>
                  <Tab.List className="w-full flex items-center bg-secondary rounded-lg p-2">
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                          : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
                      }>
                      Deposit
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                          : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
                      }>
                      Withdraw
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="p-2 mt-2 bg-secondary rounded-md">
                    <Tab.Panel>
                      <DepositTab user={user} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <WithdrawTab
                        user={user}
                        walletBalance={walletBalance}
                        bnbWalletBalance={bnbWalletBalance}
                        chain={chain}
                        web3={web3}
                        web3_bsc={web3_bsc}
                        setWalletBalance={setWalletBalance}
                        setBnbWalletBalance={setBnbWalletBalance}
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Wallet;
