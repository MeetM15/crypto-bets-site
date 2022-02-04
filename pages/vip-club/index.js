/* eslint-disable react/no-unescaped-entities */
import Layout from "../../components/layout/Layout";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "axios";
import Web3 from "web3";
import Login from "../../components/modals/Login";
import Wallet from "../../components/modals/Wallet";
import Referral from "../../components/modals/Referral";
import Logout from "../../components/modals/Logout";
import { MoonLoader } from "react-spinners";

const coingeckoUrl = () => {
  return `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin&vs_currencies=usd`;
};

const l1 = 1000;
const l2 = 5000;
const l3 = 10000;
const l4 = 20000;
const l5 = 30000;
const l6 = 40000;

const web3 = new Web3(
  "https://eth-rinkeby.alchemyapi.io/v2/sk88g0PfYAHxltvWlVpWWbvrXMnv22TN"
);
const web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/487960593a8857bde8a74862/bsc/testnet"
);

const VipClub = () => {
  const myInterval = useRef(null);
  const [etherPrice, setEtherPrice] = useState(0.0);
  const [binancePrice, setBinancePrice] = useState(0.0);
  const [user, setUser] = useState();
  const [userEmail, setUserEmail] = useState();
  const [totalBetAmt, setTotalBetAmt] = useState(0.0);
  const [lvl, setLvl] = useState(0);
  const [loginTab, setLoginTab] = useState("login");
  const [chain, setChain] = useState("eth");
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [bnbWalletBalance, setBnbWalletBalance] = useState(0.0);
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
        })
      );
    };
    fetchPrices().catch((err) => console.log(err));
  }, []);
  //set totalBet and isRewarded
  useEffect(() => {
    if (user && user[0] != undefined) {
      setTotalBetAmt(parseFloat(user[0].totalBetAmt));
      setVipReward(parseFloat(user[0].usedVipBonus));
      setIsRewarded(parseFloat(user[0].usedReferralBonus));
      setWalletBalance(parseFloat(user[0].availableBalanceEth));
      setBnbWalletBalance(parseFloat(user[0].availableBalanceBsc));
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
                Primedice is where you come to get the most out of your gambling
                experience.Why would you settle for anything less? Our "players
                are treated like royalty from the minute they step onto the
                site, with loyalty programs that are the best in the world" of
                crypto gambling. "Whether you are a long-time Primedice member
                or you have just joined the site, you are important to us! We
                are focused on" enhancing your gambling experience and committed
                to offering exclusive benefits to all of our players - like no
                other website can.
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 bg-secondary p-12 rounded-2xl">
              <div className="w-full font-bold text-3xl">
                Loyalty Progression
              </div>
              <div className="w-32 h-1 bg-primary-100 rounded-2xl"></div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                "Our players also have the chance to progress their rank all the
                way to Diamond,which comes with inherent player benefits. Your
                involvement in the Primedice community and"
              </div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                "the amount you wager within all our games come with rewards and
                certainly some recognition.We value all of our players, and we'd
                love to see even our newest players progress all the way to
                Diamond!We are all about giving the absolute best to our
                players."
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
                  Receive personal VIP treatment from our "support team,with
                  one-on-one chats and personal support that is unique to you!
                  Don't be satisfied with automated messages,you are" important
                  to us.
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
                  Rakeback is also a limitless possibility to our "loyal
                  members, with no restriction on when you can claim rakeback
                  into your account. We are committed to giving back to our
                  loyal" players.
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
                  Loyal members also have access to exclusive bonuses that you
                  will not get on other websites - make the most of your
                  importance!
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
                  Take on challenges unique to you, where only you can win! more
                  could you want?
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
                  If you feel like we are missin something, let us know! We are
                  more than willing to cater to any player needs or requests.
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
                  Receive gifts and rewards that have no boundaries - the sky is
                  the limit. This doesn't just include virtual gifts, but
                  physial also. Who knows what kind of things Diceup.com will
                  have you doing!
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
            </div>
            <div className="flex flex-wrap w-3/4 justify-evenly">
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">Support</div>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Live Support
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Affiliate
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Probably Fair
                    </div>
                  </a>
                  <a href="#">
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
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">
                    Community
                  </div>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Telegram
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Twitter
                    </div>
                  </a>
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
            web3={web3}
            web3_bsc={web3_bsc}
            setWalletBalance={setWalletBalance}
            setBnbWalletBalance={setBnbWalletBalance}
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
                Primedice is where you come to get the most out of your gambling
                experience.Why would you settle for anything less? Our "players
                are treated like royalty from the minute they step onto the
                site, with loyalty programs that are the best in the world" of
                crypto gambling. "Whether you are a long-time Primedice member
                or you have just joined the site, you are important to us! We
                are focused on" enhancing your gambling experience and committed
                to offering exclusive benefits to all of our players - like no
                other website can.
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 bg-secondary p-12 rounded-2xl">
              <div className="w-full font-bold text-3xl">
                Loyalty Progression
              </div>
              <div className="w-32 h-1 bg-primary-100 rounded-2xl"></div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                "Our players also have the chance to progress their rank all the
                way to Diamond,which comes with inherent player benefits. Your
                involvement in the Primedice community and"
              </div>
              <div className="w-full flex items-center justify-center text-sm font-medium text-btntext">
                "the amount you wager within all our games come with rewards and
                certainly some recognition.We value all of our players, and we'd
                love to see even our newest players progress all the way to
                Diamond!We are all about giving the absolute best to our
                players."
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
                  Receive personal VIP treatment from our "support team,with
                  one-on-one chats and personal support that is unique to you!
                  Don't be satisfied with automated messages,you are" important
                  to us.
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
                  Rakeback is also a limitless possibility to our "loyal
                  members, with no restriction on when you can claim rakeback
                  into your account. We are committed to giving back to our
                  loyal" players.
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
                  Loyal members also have access to exclusive bonuses that you
                  will not get on other websites - make the most of your
                  importance!
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
                  Take on challenges unique to you, where only you can win! more
                  could you want?
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
                  If you feel like we are missin something, let us know! We are
                  more than willing to cater to any player needs or requests.
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
                  Receive gifts and rewards that have no boundaries - the sky is
                  the limit. This doesn't just include virtual gifts, but
                  physial also. Who knows what kind of things Diceup.com will
                  have you doing!
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
            </div>
            <div className="flex flex-wrap w-3/4 justify-evenly">
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">Support</div>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Live Support
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Affiliate
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Probably Fair
                    </div>
                  </a>
                  <a href="#">
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
              <div className="flex flex-col items-start justify-between md:w-auto p-2">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-black">
                    Community
                  </div>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Telegram
                    </div>
                  </a>
                  <a href="#">
                    <div className="font-medium text-xs text-btntext cursor-pointer">
                      Twitter
                    </div>
                  </a>
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
            web3={web3}
            web3_bsc={web3_bsc}
            setWalletBalance={setWalletBalance}
            setBnbWalletBalance={setBnbWalletBalance}
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
