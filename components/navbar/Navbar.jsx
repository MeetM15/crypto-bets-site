import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import {
  RiWallet3Fill,
  RiVipCrown2Fill,
  RiMoneyDollarCircleLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { GiDiamondTrophy } from "react-icons/gi";
import { IoMdWallet } from "react-icons/io";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
const Navbar = ({
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
  bnbWalletBalance,
  polyWalletBalance,
  chain,
  setChain,
  setLoginTab,
  setShowReferralModal,
  setShowLogoutModal,
  lvl,
  totalBetAmt,
}) => {
  const router = useRouter();
  const [currency, setCurrency] = useState(["ETH", "/icons/eth.svg"]);

  return (
    <nav className="bg-secondary fixed w-full shadow px-2 sm:px-6 lg:px-8 flex items-center justify-between h-14 text-secondary z-10">
      <div className="flex-shrink-0 flex items-center">
        <Link href="/">
          <img
            className="block sm:hidden h-8 w-auto p-1 cursor-pointer"
            src="/icons/green_crown.svg"
            alt="logo"
          />
        </Link>
        <Link href="/">
          <img
            className="hidden sm:block h-8 w-auto p-1 cursor-pointer"
            src="/icons/logo1.svg"
            alt="logo"
          />
        </Link>
      </div>
      {user && (
        <div className="bg-inputbg shadow-inner flex items-center justify-between rounded">
          <Menu as="div" className="relative px-2 py-1 w-full">
            <div>
              <Menu.Button className="flex items-center justify-between text-black font-medium text-xs">
                {currency[0] && currency[1] ? (
                  <>
                    <img
                      src={currency[1]}
                      alt="logo"
                      className="sm:p-1 p-0.5 w-3 sm:w-5"
                    />
                    <ChevronDownIcon className="ml-1 mr-2 sm:ml-2 h-7 w-7 opacity-60 text-btntext border-r-2 border-btnText" />
                    {chain == "eth"
                      ? parseFloat(walletBalance).toFixed(8)
                      : chain == "bsc"
                      ? parseFloat(bnbWalletBalance).toFixed(8)
                      : parseFloat(polyWalletBalance).toFixed(8)}
                  </>
                ) : (
                  ""
                )}
              </Menu.Button>
            </div>
            <Transition
              enter="transition-opacity ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-out duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Menu.Items className="origin-top-right absolute right-0 mt-3 w-full w-38 rounded-md shadow-lg p-1 bg-secondary ring-1 ring-black ring-opacity-5 z-10">
                <Menu.Item>
                  <span
                    className={
                      "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
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
                      "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
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
                <Menu.Item>
                  <span
                    className={
                      "px-2 py-0.5 sm:py-1 text-xs sm:text-sm text-gray-700 flex cursor-pointer items-center justify-between font-medium"
                    }
                    onClick={() => {
                      setChain("poly");
                      setCurrency(["MATIC", "/icons/matic.svg"]);
                    }}>
                    {parseFloat(polyWalletBalance).toFixed(8)}
                    <img
                      src="/icons/matic.svg"
                      alt="ethereum"
                      className="md:p-1 p-0.5 w-3 sm:w-5"
                    />
                    MATIC
                  </span>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <button
            type="button"
            className="text-xs h-full w-full flex items-center justify-center py-2 px-1 m-1 font-medium rounded-md bg-primary-100"
            onClick={() => {
              setShowWalletModal(true);
            }}>
            <span className="hidden sm:flex mr-1">Wallet</span>
            <RiWallet3Fill className="text-secondary" size={"16px"} />
          </button>
        </div>
      )}
      {user ? (
        <>
          <div className="hidden sm:flex items-center pr-2">
            <Menu as="div" className="mr-3 relative">
              <Menu.Button className="flex items-center justify-between text-sm bg-inputbg px-6 py-1 shadow-inner rounded-lg text-primary-100">
                <UserCircleIcon className="w-10 h-10 text-primary-100" />
                <span className="ml-2 text-md font-medium flex flex-col">
                  {user.username}
                  <span className="text-xxs font-bold">
                    {Math.floor(parseFloat(totalBetAmt) * 100)} Points
                  </span>
                  <span className="text-xxxs text-black font-bold absolute h-4 flex left-[1.35rem] bottom-0.5 px-2 bg-secondary opacity-95 rounded flex items-center justify-center">
                    <RiVipCrown2Fill className="h-full mr-0.5 text-viplogo" />
                    LvL {lvl}
                  </span>
                </span>
                <ChevronDownIcon className="ml-2 h-6 w-6 opacity-60 text-primary-60" />
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full w-36 rounded-md shadow-lg py-2 bg-secondary ring-1 ring-black ring-opacity-5 flex flex-col">
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowWalletModal(true);
                      }}>
                      <IoMdWallet className="w-5 h-5 mr-1 text-primary-100" />
                      Wallet
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowReferralModal(true);
                      }}>
                      <RiMoneyDollarCircleLine className="w-5 h-5 mr-1 text-earnlogo" />
                      Refer & Earn
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href="/vip-club">
                      <div
                        className={
                          "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                        }>
                        <RiVipCrown2Fill className="w-5 h-5 mr-1 text-viplogo" />
                        VIP
                      </div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowLogoutModal(true);
                      }}>
                      <RiLogoutBoxRLine className="w-5 h-5 mr-1 text-logoutlogo" />
                      Logout
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="flex sm:hidden items-center">
            <Menu as="div" className="mr-3 relative">
              <Menu.Button className="flex items-center justify-between text-sm text-secondary">
                <UserCircleIcon className="w-8 h-8 text-primary-100" />
                <span className="text-xxxs font-bold absolute h-4 flex items-center justify-center w-12 text-black text-center -left-2 px-2 -bottom-1 bg-secondary opacity-95 rounded w-full">
                  <RiVipCrown2Fill className="h-full mr-1 text-viplogo" />
                  LvL {lvl}
                </span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="origin-top-right absolute right-0 mt-2 min-w-full w-36 rounded-md shadow-lg py-2 bg-secondary ring-1 ring-black ring-opacity-5 flex flex-col">
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowWalletModal(true);
                      }}>
                      <IoMdWallet className="w-5 h-5 mr-1 text-primary-100" />
                      Wallet
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowReferralModal(true);
                      }}>
                      <RiMoneyDollarCircleLine className="w-5 h-5 mr-1 text-earnlogo" />
                      Refer & Earn
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <Link href="/vip-club">
                      <div
                        className={
                          "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                        }>
                        <RiVipCrown2Fill className="w-5 h-5 mr-1 text-viplogo" />
                        VIP
                      </div>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        console.log(user);
                      }}>
                      <GiDiamondTrophy className="w-5 h-5 mr-1 text-lvllogo" />
                      {Math.floor(parseFloat(totalBetAmt) * 100)} Points
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      className={
                        "px-4 py-2 text-sm text-btntext font-medium flex items-center justify-start cursor-pointer"
                      }
                      onClick={() => {
                        setShowLogoutModal(true);
                      }}>
                      <RiLogoutBoxRLine className="w-5 h-5 mr-1 text-logoutlogo" />
                      Logout
                    </div>
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
            className="group relative w-full flex justify-center items-center h-9 px-6 border-border border-2 text-sm font-medium rounded-md text-primary-100 mr-2"
            onClick={(e) => {
              setLoginTab("login");
              setToggleLoginModalOpen(true);
            }}>
            Login
          </button>
          <button
            type="button"
            className="group relative w-full flex justify-center items-center h-9 px-6 border-1 text-sm font-medium rounded-md text-secondary bg-primary-100 focus:outline-none"
            onClick={() => {
              setLoginTab("signup");
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
