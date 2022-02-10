import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { XIcon } from "@heroicons/react/solid";
const Referral = ({ showReferralModal, setShowReferralModal, user }) => {
  return (
    <Transition.Root show={showReferralModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={setShowReferralModal}>
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
            <div className="inline-block align-bottom text-left overflow-hidden transform transition-all w-full sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
              <div className="w-full flex justify-end py-2 bg-transparent">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="text-xs bg-inputbg font-medium px-2 py-1.5 flex items-center justify-center rounded-lg h-full">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-2xl bg-secondary p-4 w-full">
                <div className="w-full text-black font-medium p-2 text-sm">
                  Refer members to earn an extra $20 for each one who signs up
                  and deposits $100.
                </div>
                <span className="flex flex-col items-center justify-center font-medium bg-secondary w-full rounded-xl p-2">
                  <span className="text-left text-xs w-full font-medium text-formtext mb-2">
                    Referral Link
                  </span>
                  <span className="text-center font-medium text-xs sm:text-sm px-2 py-1 bg-inputbg shadow-inner w-auto rounded-lg flex items-center justify-between">
                    {user && user.refer_code
                      ? `https://crypto-dice-site.herokuapp.com/?refer=${user.refer_code}`
                      : "https://crypto-dice-site.herokuapp.com/?refer=0"}
                    <button
                      type="button"
                      className="flex items-center justify-center px-0.5 md:px-1 py-1.5 bg-secondary text-btntext font-medium text-xs rounded-lg ml-2 w-12 sm:w-16"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          user && user.refer_code
                            ? `https://crypto-dice-site.herokuapp.com?refer=${user.refer_code}`
                            : "https://crypto-dice-site.herokuapp.com?refer=0"
                        );
                      }}>
                      Copy
                    </button>
                  </span>
                </span>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Referral;
