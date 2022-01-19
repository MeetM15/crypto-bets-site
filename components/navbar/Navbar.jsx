import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { RiWallet3Fill } from "react-icons/ri";
import { useRouter } from "next/router";
import { useState } from "react";
const Navbar = ({
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
  bnbWalletBalance,
  setWalletBalance,
  setBnbWalletBalance,
  chain,
  setChain,
  web3,
  web3_bsc,
}) => {
  const router = useRouter();
  const [currency, setCurrency] = useState(["ETH", "/icons/eth.svg"]);

  return (
    <nav className="bg-secondary fixed w-full shadow px-2 sm:px-6 lg:px-8 flex items-center justify-between h-12 text-white z-10">
      <div className="flex-shrink-0 flex items-center">
        <img
          className="block sm:hidden h-8 w-auto p-1.5"
          src="/icons/logo_m.svg"
          alt="logo"
        />
        <img
          className="hidden sm:block h-8 w-auto p-1.5"
          src="/icons/logo.svg"
          alt="logo"
        />
      </div>
      {user && user[0] && (
        <div className="bg-secondaryLight flex items-center justify-between rounded">
          <Menu as="div" className="relative px-2 py-1 w-full">
            <div
              onClick={() => {
                if (user && user[0] != undefined) {
                  web3.eth
                    .getBalance(user[0].address)
                    .then((res) => {
                      return web3.utils.fromWei(res);
                    })
                    .then((res) => {
                      setWalletBalance(
                        parseFloat(res) > 0.00003
                          ? parseFloat(res) - 0.00003
                          : 0.0
                      );
                    });
                  web3_bsc.eth
                    .getBalance(user[0].bscAddress)
                    .then((res) => {
                      return web3_bsc.utils.fromWei(res);
                    })
                    .then((res) => {
                      console.log(res);
                      setBnbWalletBalance(
                        parseFloat(res) > 0.00003
                          ? parseFloat(res) - 0.00003
                          : 0.0
                      );
                    });
                }
              }}>
              <Menu.Button className="flex items-center justify-between text-xs text-white font-medium">
                {currency[0] && currency[1] ? (
                  <>
                    {chain == "eth"
                      ? parseFloat(walletBalance).toFixed(8)
                      : parseFloat(bnbWalletBalance).toFixed(8)}
                    <img
                      src={currency[1]}
                      alt="logo"
                      className="sm:m-1 m-0.5 sm:p-1 p-0.5 w-3 sm:w-5 ml-1"
                    />
                  </>
                ) : (
                  ""
                )}
                <ChevronDownIcon className="ml-1 sm:ml-2 h-6 w-6 opacity-60" />
              </Menu.Button>
            </div>
            <Transition
              enter="transition-opacity ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-full w-38 rounded-md shadow-lg p-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                <Menu.Item>
                  <span
                    className={
                      "px-2  py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-evenly font-medium"
                    }
                    onClick={() => {
                      setChain("eth");
                      setCurrency(["ETH", "/icons/eth.svg"]);
                    }}>
                    {parseFloat(walletBalance).toFixed(8)}
                    <img
                      src="/icons/eth.svg"
                      alt="logo"
                      className="md:p-1 p-0.5 w-3 sm:w-5"
                    />
                    ETH
                  </span>
                </Menu.Item>
                <Menu.Item>
                  <span
                    className={
                      "px-2  py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-evenly font-medium"
                    }
                    onClick={() => {
                      setChain("bsc");
                      setCurrency(["BNB", "/icons/bnb.svg"]);
                    }}>
                    {parseFloat(bnbWalletBalance).toFixed(8)}
                    <img
                      src="/icons/bnb.svg"
                      alt="ethereum"
                      className="md:p-1 p-0.5 w-3 sm:w-5"
                    />
                    BNB
                  </span>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <button
            type="button"
            className="text-sm h-full w-full flex items-center justify-center p-3 font-medium rounded-r bg-btn1 "
            onClick={() => {
              setShowWalletModal(true);
            }}>
            <span className="hidden sm:flex mr-1">Wallet</span>
            <RiWallet3Fill size={"20px"} />
          </button>
        </div>
      )}
      {user && user[0] ? (
        <>
          <div className="hidden sm:flex items-center pr-2">
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full w-24 rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 flex flex-col">
                  <Menu.Item>
                    <a
                      href="#"
                      className={
                        "px-4 py-2 text-sm text-gray-700 font-medium flex items-center justify-center"
                      }>
                      {user[0].username}
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      href="#"
                      className={
                        "px-4 py-2 text-sm text-gray-700 font-medium flex items-center justify-center"
                      }
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.reload();
                      }}>
                      Sign-out
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="flex sm:hidden items-center">
            <Menu as="div" className="mr-3 relative">
              <Menu.Button className="flex items-center justify-between text-sm text-white">
                <UserCircleIcon className="w-8 h-8" />
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 flex flex-col w-24">
                  <Menu.Item>
                    <a
                      href="#"
                      className={
                        "px-4 py-2 text-sm text-gray-700 font-medium flex items-center justify-center"
                      }>
                      {user[0].username}
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a
                      href="#"
                      className={
                        "px-4 py-2 text-sm text-gray-700 font-medium flex items-center justify-center"
                      }
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.reload();
                      }}>
                      Sign-out
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </>
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
