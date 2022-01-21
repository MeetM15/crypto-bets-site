import { Tab, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import LoginForm from "../loginForm/LoginForm";
import SignupForm from "../signupForm/SignupForm";
import { XIcon } from "@heroicons/react/solid";

const Login = ({ toggleLoginModalOpen, setToggleLoginModalOpen, loginTab }) => {
  return (
    <Transition.Root show={toggleLoginModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setToggleLoginModalOpen}>
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
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full h-128">
              <div className="w-full flex justify-end py-2 bg-transparent">
                <button
                  type="button"
                  onClick={() => setToggleLoginModalOpen(false)}
                  className="text-xs bg-inputbg font-medium px-2 py-1.5 flex items-center justify-center rounded-lg h-full">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full h-full flex">
                <div className="w-5/12 bg-primary-100 hidden md:flex md:flex-col justify-between h-full rounded-tl-lg">
                  <div className="w-full">
                    <div className="font-bold text-center text-4xl p-4 text-secondary mt-4">
                      Dice Up.
                    </div>
                    <div className="font-medium text-center text-xs p-4 text-secondary mt-2">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Deserunt autem ipsam fugiat magni impedit ducimus ut hic
                      ea cum veniam illo, iusto voluptate tempore cumque
                      temporibus maxime quas vero provident.
                    </div>
                  </div>
                  <img
                    className="block absolute top-64 left-16 h-32 px-1 pt-1 mb-8"
                    src="/ellipse.svg"
                    alt="logo"
                  />
                  <img
                    className="block h-64 px-1 pt-1 mb-8 z-10"
                    src="/login_dice.svg"
                    alt="logo"
                  />
                </div>
                <div className="w-full md:w-7/12 bg-secondary rounded-lg md:rounded-none md:rounded-tr-lg">
                  <Tab.Group defaultIndex={loginTab == "login" ? 0 : 1}>
                    <Tab.List className="w-full flex items-center justify-center bg-secondary mt-2 p-3 border-b border-#F3F3F3">
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                            : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
                        }>
                        Login
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          selected
                            ? "font-medium text-sm shadow-inner mr-2 px-4 py-2 rounded-md bg-inputbg text-primary-100"
                            : "font-medium text-sm mr-2 px-4 py-2 rounded-md bg-secondary border-primary-20 border"
                        }>
                        Register
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="p-2 mt-2 bg-secondary rounded">
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
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Login;
