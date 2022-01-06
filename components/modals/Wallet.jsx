import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";

const Wallet = ({
  showWalletModal,
  setShowWalletModal,
  user,
  walletBalance,
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="w-64 md:w-128 h-96 bg-primary">
                <span className="w-full flex items-center justify-center p-4 font-medium text-lg border-b-4 border-secondary">
                  Your Wallet
                </span>
                {user[0] ? (
                  <div className="flex flex-col items-center mt-16 h-full w-full px-4 pb-4">
                    <span className="flex flex-col items-center justify-center font-medium text-md mb-4 bg-secondary w-full rounded">
                      Wallet address :
                      <span className="text-center font-medium text-md p-2 bg-secondary w-full rounded break-all md:break-none flex items-center justify-center">
                        {user[0].address}
                        <DocumentDuplicateIcon
                          className="w-8 h-8 text-white ml-2 cursor-pointer hover:bg-primary rounded"
                          onClick={() => {
                            navigator.clipboard.writeText(user[0].address);
                          }}
                        />
                      </span>
                    </span>
                    <span className="flex flex-col items-center justify-center font-medium text-md mb-4 bg-secondary w-full rounded">
                      Your Balance :
                      <span className="text-center font-medium text-md p-2 bg-secondary w-full rounded break-all md:break-none flex items-center justify-center">
                        {`${walletBalance} ETH`}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="text-sm w-full mt-2 bg-white flex items-center justify-center p-2 font-medium rounded "
                      onClick={() => setShowWalletModal(false)}>
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full px-4 pb-4">
                    Login First!
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Wallet;
