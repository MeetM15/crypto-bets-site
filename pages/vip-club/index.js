/* eslint-disable react/no-unescaped-entities */
import Layout from "../../components/layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "axios";
import Login from "../../components/modals/Login";
import Wallet from "../../components/modals/Wallet";
import Referral from "../../components/modals/Referral";
import Logout from "../../components/modals/Logout";
import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";

const coingeckoUrl = () => {
  return `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin%2Cmatic-network&vs_currencies=usd`;
};
const l1 = 1000;
const l2 = 5000;
const l3 = 10000;
const l4 = 20000;
const l5 = 30000;
const l6 = 40000;

const VipClub = () => {
  const router = useRouter();
  const myInterval = useRef(null);
  const [user, setUser] = useState();
  const [userEmail, setUserEmail] = useState();
  const [loginTab, setLoginTab] = useState("login");
  const [chain, setChain] = useState("eth");
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [bnbWalletBalance, setBnbWalletBalance] = useState(0.0);
  const [polyWalletBalance, setPolyWalletBalance] = useState(0.0);
  const [etherPrice, setEtherPrice] = useState(0.0);
  const [binancePrice, setBinancePrice] = useState(0.0);
  const [maticPrice, setMaticPrice] = useState(0.0);
  const [totalBetAmt, setTotalBetAmt] = useState(0.0);
  const [lvl, setLvl] = useState(0);
  const [isRewarded, setIsRewarded] = useState(1);
  const [vipReward, setVipReward] = useState(0);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  //fetch user every minute
  useEffect(() => {
    myInterval.current = setInterval(() => {
      setIsFetchingUser(true);
    }, 60000);
    return () => clearInterval(myInterval.current);
  }, []);
  useEffect(() => {
    if (userEmail && isFetchingUser) {
      console.log("fetched user!");
      axios
        .post("/getUserData", {
          email: userEmail,
        })
        .then((res) => {
          setUser([res.data]);
        })
        .catch((error) => {
          setUser([]);
          console.log(error);
        });
      setIsFetchingUser(false);
    }
  }, [isFetchingUser]);

  //total bet amt
  useEffect(() => {
    if (user && user[0] && userEmail) {
      if (lvl > vipReward) {
        console.log(`vip updated from ${vipReward} to ${lvl} !`);
        axios
          .post("/vipLevelUp", {
            email: userEmail,
            amt: parseFloat(100.0 / parseFloat(etherPrice)),
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [lvl]);

  useEffect(() => {
    console.log("total bet: ", totalBetAmt * 100);
    if (!isRewarded && user && user[0] != undefined) {
      if (parseFloat(totalBetAmt) > 10.0) {
        axios
          .post("/referralBonus", {
            email: user[0].email,
            amt: parseFloat(10.0 / parseFloat(etherPrice)),
          })
          .then((res) => {
            setIsRewarded(1);
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= 0 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l1
    )
      setLvl(0);
    else if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= l1 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l2
    )
      setLvl(1);
    else if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= l2 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l3
    )
      setLvl(2);
    else if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= l3 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l4
    )
      setLvl(3);
    else if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= l4 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l5
    )
      setLvl(4);
    else if (
      Math.floor(parseFloat(totalBetAmt) * 100) >= l5 &&
      Math.floor(parseFloat(totalBetAmt) * 100) < l6
    )
      setLvl(5);
    else if (Math.floor(parseFloat(totalBetAmt) * 100) >= l6) setLvl(6);
  }, [totalBetAmt, user]);

  //fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      fetch(coingeckoUrl()).then((response) =>
        response.json().then((jsonData) => {
          setEtherPrice(jsonData.ethereum.usd);
          setBinancePrice(jsonData.binancecoin.usd);
          setMaticPrice(jsonData["matic-network"].usd);
        })
      );
    };
    fetchPrices().catch((err) => console.log(err));
  }, []);

  //referral
  useEffect(() => {
    if (!localStorage.getItem("referredById") && router.query["refer"]) {
      console.log("referred By Id : ", parseInt(router.query.refer));
      localStorage.setItem("referredById", router.query.refer);
      console.log(
        "referred By Id : ",
        parseInt(localStorage.getItem("referredById"))
      );
    }
  }, [router]);
  //set totalBet and isRewarded
  useEffect(() => {
    if (user && user[0] != undefined) {
      setTotalBetAmt(parseFloat(user[0].totalBetAmt));
      setVipReward(parseFloat(user[0].usedVipBonus));
      setIsRewarded(parseFloat(user[0].usedReferralBonus));
      setWalletBalance(parseFloat(user[0].availableBalanceEth));
      setBnbWalletBalance(parseFloat(user[0].availableBalanceBsc));
      setPolyWalletBalance(parseFloat(user[0].availableBalancePoly));
    }
  }, [user]);

  //get user email
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUserEmail(res.data.authorizedData.email);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setUserEmail("notConnected");
    }
  }, []);
  //get user details
  useEffect(() => {
    if (userEmail) {
      axios
        .post("/getUserData", {
          email: userEmail,
        })
        .then((res) => {
          setUser([res.data]);
        })
        .catch((error) => {
          setUser([]);
          console.log(error);
        });
    }
  }, [userEmail]);
  return (
    <>
      <Head>
        <title>Dice Up | VIP Club</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      {userEmail && userEmail == "notConnected" ? (
        <Layout
          user={user}
          lvl={lvl}
          totalBetAmt={totalBetAmt}
          setToggleLoginModalOpen={setToggleLoginModalOpen}
          setShowWalletModal={setShowWalletModal}
          chain={chain}
          setChain={setChain}
          setLoginTab={setLoginTab}
          walletBalance={walletBalance}
          bnbWalletBalance={bnbWalletBalance}
          polyWalletBalance={polyWalletBalance}
          setShowReferralModal={setShowReferralModal}
          setShowLogoutModal={setShowLogoutModal}>
          <div className="w-11/12 xl:w-256 flex flex-col gap-8 py-8">
            <div
              className="mt-20 w-full h-40 xl:h-76 rounded-2xl flex items-center justify-center"
              style={{ backgroundImage: "url('/vipdivbg.svg')" }}>
              <img
                className="h-16 w-auto p-1"
                src="/icons/vippagelogo.svg"
                alt="logo"
              />
            </div>
            <div className="flex flex-wrap lg:flex-nowrap w-full gap-4">
              <div className="flex items-center justify-center text-5xl leading-tight w-full lg:w-2/5 font-bold text-black">
                VIP Club - Exclusive <br /> Player Benefits
              </div>
              <div className="w-full lg:w-3/5 flex items-center justify-center text-md font-medium text-btntext">
                In order to give back to our players, we have set up a unique
                VIP club for those who play the most. As you rank higher in
                level, you gain additional benefits along with a $100 in eth.
                Dice up members old and new are both important and will be able
                to gain different rewards as they continue to wager. We will
                continue to release new rewards and benefits for our members.
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 bg-secondary p-12 rounded-2xl">
              <div className="w-full font-bold text-3xl">
                Loyalty Progression
              </div>
              <div className="w-32 h-1 bg-primary-100 rounded-2xl"></div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                You gain points as you wager, and each point allows for you to
                reach new levels that unlock additional benefits. Wager only
                $1,000 worth of ETH, BNB, or MATIC to hit the first level and
                unlock these perks below.
              </div>
            </div>
            <div className="flex items-center text-center justify-center text-5xl leading-tight w-full font-bold text-black">
              What you get as a VIP <br /> Member?
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/personal.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Personal VIP
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  As you rank up in VIP levels, you will have access to our
                  personal concierge. Here you will be able to have input on our
                  future games and communicate directly one on one with our team
                  members.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/rakeback.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">Rakeback</div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  You will have the ability to rakeback some of the house edge
                  as loyal members. Once you hit our top tier VIP level you will
                  see additional money returned to your account.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/bonus.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Exclusive Bonuses
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  From time to time, we will send out emails to our NEW and VIP
                  members with exclusive bonus offerings.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/speciality.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Speciality Challenges
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  New challenges will be released every month to certain
                  members, providing additional bonuses & $$.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/addmore.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">And More!</div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  We are constantly building more games, and will continue to
                  update our members.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/gift.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Gifts & Rewards
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  Our members will have a chance to win virtual gifts and
                  rewards, such as rare NFTs, alongside some physical gifts.
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 md:py-7 md:px-32 w-full bg-secondary flex justify-between">
            <div className="flex flex-col items-start gap-2 w-1/2 md:w-1/4 p-2">
              <Link href="/">
                <img
                  className="h-6 sm:h-8 w-auto p-1 cursor-pointer"
                  src="/icons/logo1.svg"
                  alt="logo"
                />
              </Link>
              <div className="font-medium text-xs text-btntext">
                © 2022 diceup.com
              </div>
              <div className="font-medium text-xs text-btntext">
                All Rights Reserved.
              </div>
              <div className="font-medium text-xs text-btntext">
                <Menu
                  as="div"
                  className="relative px-2 py-1 w-full flex items-start justify-start">
                  <Menu.Button className="flex items-center w-full justify-center text-btnText font-medium text-xs">
                    <img
                      src="/icons/usa.svg"
                      alt="logo"
                      className="p-0.5 w-4 sm:w-6"
                    />
                    <ChevronDownIcon className="mr-1 sm:mr-2 h-5 w-5 opacity-60 text-btntext " />
                    English
                  </Menu.Button>
                </Menu>
              </div>
              <div className="font-medium text-xs text-black">
                1 ETH = ${etherPrice}
              </div>
              <div className="font-medium text-xs text-black">
                1 BNB = ${binancePrice}
              </div>
              <div className="font-medium text-xs text-black">
                1 MATIC = ${maticPrice}
              </div>
            </div>
            <div className="flex flex-wrap w-3/4 justify-evenly">
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">Support</div>
                  <a
                    href="https://www.begambleaware.org/"
                    target="_blank"
                    rel="noreferrer">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Gamble Aware
                    </div>
                  </a>
                </div>
                <img
                  className="h-10 sm:h-16 w-auto p-1 cursor-pointer"
                  src="/icons/gambling.svg"
                  alt="logo"
                />
              </div>
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">About Us</div>
                  <Link href="/vip-club">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      VIP Club
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Login
            toggleLoginModalOpen={toggleLoginModalOpen}
            setToggleLoginModalOpen={setToggleLoginModalOpen}
            loginTab={loginTab}
          />
          <Wallet
            setShowWalletModal={setShowWalletModal}
            showWalletModal={showWalletModal}
            user={user}
            walletBalance={walletBalance}
            bnbWalletBalance={bnbWalletBalance}
            chain={chain}
            polyWalletBalance={polyWalletBalance}
          />
          <Referral
            showReferralModal={showReferralModal}
            setShowReferralModal={setShowReferralModal}
            user={user}
          />
          <Logout
            showLogoutModal={showLogoutModal}
            setShowLogoutModal={setShowLogoutModal}
          />
        </Layout>
      ) : user ? (
        <Layout
          user={user}
          lvl={lvl}
          totalBetAmt={totalBetAmt}
          setToggleLoginModalOpen={setToggleLoginModalOpen}
          setShowWalletModal={setShowWalletModal}
          chain={chain}
          setChain={setChain}
          setLoginTab={setLoginTab}
          walletBalance={walletBalance}
          bnbWalletBalance={bnbWalletBalance}
          polyWalletBalance={polyWalletBalance}
          setShowReferralModal={setShowReferralModal}
          setShowLogoutModal={setShowLogoutModal}>
          <div className="w-11/12 xl:w-256 flex flex-col gap-8 py-8">
            <div
              className="mt-20 w-full h-40 xl:h-76 rounded-2xl flex items-center justify-center"
              style={{ backgroundImage: "url('/vipdivbg.svg')" }}>
              <img
                className="h-16 w-auto p-1"
                src="/icons/vippagelogo.svg"
                alt="logo"
              />
            </div>
            <div className="flex flex-wrap lg:flex-nowrap w-full gap-4">
              <div className="flex items-center justify-center text-5xl leading-tight w-full lg:w-2/5 font-bold text-black">
                VIP Club - Exclusive <br /> Player Benefits
              </div>
              <div className="w-full lg:w-3/5 flex items-center justify-center text-md font-medium text-btntext">
                In order to give back to our players, we have set up a unique
                VIP club for those who play the most. As you rank higher in
                level, you gain additional benefits along with a $100 in eth.
                Dice up members old and new are both important and will be able
                to gain different rewards as they continue to wager. We will
                continue to release new rewards and benefits for our members.
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 bg-secondary p-12 rounded-2xl">
              <div className="w-full font-bold text-3xl">
                Loyalty Progression
              </div>
              <div className="w-32 h-1 bg-primary-100 rounded-2xl"></div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                "You gain points as you wager, and each point allows for you to
                reach new levels that unlock additional benefits. Wager only
                $1,000 worth of ETH, BNB, or MATIC to hit the first level and
                unlock these perks below."
              </div>
            </div>
            <div className="flex items-center text-center justify-center text-5xl leading-tight w-full font-bold text-black">
              What you get as a VIP <br /> Member?
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/personal.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Personal VIP
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  As you rank up in VIP levels, you will have access to our
                  personal concierge. Here you will be able to have input on our
                  future games and communicate directly one on one with our team
                  members.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/rakeback.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">Rakeback</div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  You will have the ability to rakeback some of the house edge
                  as loyal members. Once you hit our top tier VIP level you will
                  see additional money returned to your account.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/bonus.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Exclusive Bonuses
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  From time to time, we will send out emails to our NEW and VIP
                  members with exclusive bonus offerings.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/speciality.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Speciality Challenges
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  New challenges will be released every month to certain
                  members, providing additional bonuses & $$.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/addmore.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">And More!</div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  We are constantly building more games, and will continue to
                  update our members.
                </div>
              </div>
              <div className="flex flex-col items-start justify-evenly w-80 h-80 rounded-2xl bg-secondary p-5">
                <img
                  className="h-24 w-auto p-1"
                  src="/vipLvls/gift.svg"
                  alt="logo"
                />
                <div className="w-full font-bold text-xl mt-4">
                  Gifts & Rewards
                </div>
                <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                  Our members will have a chance to win virtual gifts and
                  rewards, such as rare NFTs, alongside some physical gifts.
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 md:py-7 md:px-32 w-full bg-secondary flex justify-between">
            <div className="flex flex-col items-start gap-2 w-1/2 md:w-1/4 p-2">
              <Link href="/">
                <img
                  className="h-6 sm:h-8 w-auto p-1 cursor-pointer"
                  src="/icons/logo1.svg"
                  alt="logo"
                />
              </Link>
              <div className="font-medium text-xs text-btntext">
                © 2022 diceup.com
              </div>
              <div className="font-medium text-xs text-btntext">
                All Rights Reserved.
              </div>
              <div className="font-medium text-xs text-btntext">
                <Menu
                  as="div"
                  className="relative px-2 py-1 w-full flex items-start justify-start">
                  <Menu.Button className="flex items-center w-full justify-center text-btnText font-medium text-xs">
                    <img
                      src="/icons/usa.svg"
                      alt="logo"
                      className="p-0.5 w-4 sm:w-6"
                    />
                    <ChevronDownIcon className="mr-1 sm:mr-2 h-5 w-5 opacity-60 text-btntext " />
                    English
                  </Menu.Button>
                </Menu>
              </div>
              <div className="font-medium text-xs text-black">
                1 ETH = ${etherPrice}
              </div>
              <div className="font-medium text-xs text-black">
                1 BNB = ${binancePrice}
              </div>
              <div className="font-medium text-xs text-black">
                1 MATIC = ${maticPrice}
              </div>
            </div>
            <div className="flex flex-wrap w-3/4 justify-evenly">
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">Support</div>
                  <a
                    href="https://www.begambleaware.org/"
                    target="_blank"
                    rel="noreferrer">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Gamble Aware
                    </div>
                  </a>
                </div>
                <img
                  className="h-10 sm:h-16 w-auto p-1 cursor-pointer"
                  src="/icons/gambling.svg"
                  alt="logo"
                />
              </div>
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">About Us</div>
                  <Link href="/vip-club">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      VIP Club
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Login
            toggleLoginModalOpen={toggleLoginModalOpen}
            setToggleLoginModalOpen={setToggleLoginModalOpen}
            loginTab={loginTab}
          />
          <Wallet
            setShowWalletModal={setShowWalletModal}
            showWalletModal={showWalletModal}
            user={user}
            walletBalance={walletBalance}
            bnbWalletBalance={bnbWalletBalance}
            chain={chain}
            polyWalletBalance={polyWalletBalance}
          />
          <Referral
            showReferralModal={showReferralModal}
            setShowReferralModal={setShowReferralModal}
            user={user}
          />
          <Logout
            showLogoutModal={showLogoutModal}
            setShowLogoutModal={setShowLogoutModal}
          />
        </Layout>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          <MoonLoader color={"#24AE8F"} size={"64px"} />
        </div>
      )}
    </>
  );
};

export default VipClub;
