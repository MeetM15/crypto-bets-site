import React from "react";
import {
  BellIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

const Navbar = ({ user, setToggleLoginModalOpen, setShowWalletModal }) => {
  const router = useRouter();
  return (
    <nav className="bg-secondary relative w-full shadow px-2 sm:px-6 lg:px-8 flex items-center justify-between h-12 text-white">
      <div className="flex-shrink-0 flex items-center">
        <img
          className="block lg:hidden h-8 w-auto p-1.5"
          src="/icons/logo.svg"
          alt="logo"
        />
        <img
          className="hidden lg:block h-8 w-auto p-1.5"
          src="/icons/logo.svg"
          alt="logo"
        />
      </div>
      <div className="bg-secondaryLight flex items-center justify-between rounded hidden sm:flex">
        <Menu as="div" className="relative px-2 py-1">
          <div>
            <Menu.Button className="flex items-center justify-between text-sm text-white">
              <span className="text-md font-medium">Currency</span>
              <ChevronDownIcon className="ml-2 h-6 w-6 opacity-60" />
            </Menu.Button>
          </div>
          <Transition
            enter="transition-opacity ease-linear duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={
                      active
                        ? "bg-gray-100"
                        : "block px-4 py-2 text-sm text-gray-700"
                    }>
                    Your Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={
                      active
                        ? "bg-gray-100"
                        : "block px-4 py-2 text-sm text-gray-700"
                    }>
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={
                      active
                        ? "bg-gray-100"
                        : "block px-4 py-2 text-sm text-gray-700"
                    }>
                    Sign out
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          type="button"
          className="text-sm h-full w-full flex items-center justify-center p-2 font-medium rounded-r bg-btn1 "
          onClick={() => {
            setShowWalletModal(true);
          }}>
          Wallet
          <CubeTransparentIcon className="w-6 h-6 ml-2" />
        </button>
      </div>
      {user[0] ? (
        <div className="flex items-center pr-2 ">
          <Menu as="div" className="mr-3 relative">
            <Menu.Button className="flex items-center justify-between text-sm text-white">
              <span className="text-md font-medium">{user[0].username}</span>
              <ChevronDownIcon className="ml-2 h-6 w-6 opacity-60" />
            </Menu.Button>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={
                        active
                          ? "bg-gray-100"
                          : "block px-4 py-2 text-sm text-gray-700"
                      }
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.reload();
                      }}>
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <button type="button" className="p-1 rounded-full hover:text-white ">
            <BellIcon
              className="h-6 w-6 text-white opacity-60"
              aria-hidden="true"
            />
          </button>

          {/* Profile dropdown */}
        </div>
      ) : (
        <div className="flex items-center pr-2 ">
          <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 "
            onClick={(e) => setToggleLoginModalOpen(true)}>
            Login
          </button>
          <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-btn1 focus:outline-none"
            onClick={() => {
              setToggleLoginModalOpen(true);
            }}>
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
