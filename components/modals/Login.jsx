import { Tab, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import LoginForm from "../loginForm/LoginForm";
import SignupForm from "../signupForm/SignupForm";
import { XIcon } from "@heroicons/react/solid";

const Login = ({ toggleLoginModalOpen, setToggleLoginModalOpen }) => {
  return (
    <Transition.Root show={toggleLoginModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setToggleLoginModalOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="w-full flex justify-end p-2 bg-primary">
                <button
                  type="button"
                  onClick={() => setToggleLoginModalOpen(false)}
                  className="text-xs font-medium px-2 flex items-center justify-center rounded-r h-full">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <Tab.Group>
                <Tab.List className="w-full h-12 px-2 pt-2 flex items-center bg-primary">
                  <Tab
                    className={({ selected }) =>
                      selected
                        ? "w-1/2 h-full flex items-center bg-white rounded-t justify-center mr-2 font-medium "
                        : "w-1/2 h-full flex items-center rounded-t justify-center mr-2 font-medium"
                    }>
                    Login
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      selected
                        ? "w-1/2 h-full flex items-center bg-white rounded-t justify-center font-medium"
                        : "w-1/2 h-full flex items-center rounded-t justify-center font-medium"
                    }>
                    Register
                  </Tab>
                </Tab.List>
                <Tab.Panels className="p-2 mt-2 bg-white rounded">
                  <Tab.Panel>
                    <LoginForm
                      setToggleLoginModalOpen={setToggleLoginModalOpen}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <SignupForm
                      setToggleLoginModalOpen={setToggleLoginModalOpen}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Login;
