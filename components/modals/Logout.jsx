/* eslint-disable react/no-unescaped-entities */
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const Logout = ({ showLogoutModal, setShowLogoutModal }) => {
  const router = useRouter();
  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then((res) => {
        router.push("/");
        setShowLogoutModal(false);
      });
  };
  return (
    <Transition.Root show={showLogoutModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={setShowLogoutModal}>
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
                  onClick={() => setShowLogoutModal(false)}
                  className="text-xs bg-inputbg font-medium px-2 py-1.5 flex items-center justify-center rounded-lg h-full">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-md bg-secondary p-8">
                <div className="w-full text-sm font-medium text-btntext">
                  We're sad to see you go! Rembember that just a few rolls of
                  the dice could see you take home some huge prize, including
                  our 100+ Bitcoin Jackpot!
                </div>
                <button
                  type="button"
                  className="w-full bg-logoutBtn rounded-lg text-logoutBtnText mt-4 h-10 font-medium"
                  onClick={() => {
                    logout();
                  }}>
                  Logout
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Logout;
