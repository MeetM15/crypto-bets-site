import Head from "next/head";
import { useAuth } from "../lib/auth";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Login from "../components/modals/Login";
import Wallet from "../components/modals/Wallet";
import Referral from "../components/modals/Referral";
import Logout from "../components/modals/Logout";
import { MoonLoader } from "react-spinners";
import { io } from "socket.io-client";
import LiveBetsComponent from "../components/liveBets/LiveBetsComponent";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { liveBets, getMyBets } from "/services/betsService";
const socket = io("https://cryptodice1.herokuapp.com/");

const coingeckoUrl = () => {
  return `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin%2Cmatic-network&vs_currencies=usd`;
};

const l1 = 1000;
const l2 = 5000;
const l3 = 10000;
const l4 = 20000;
const l5 = 30000;
const l6 = 40000;

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [loginTab, setLoginTab] = useState("login");
  const [chain, setChain] = useState("eth");
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [bnbWalletBalance, setBnbWalletBalance] = useState(0.0);
  const [polyWalletBalance, setPolyWalletBalance] = useState(0.0);
  const [currLiveBets, setCurrLiveBets] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [etherPrice, setEtherPrice] = useState(0.0);
  const [binancePrice, setBinancePrice] = useState(0.0);
  const [maticPrice, setMaticPrice] = useState(0.0);
  const [points, setPoints] = useState(0);
  const [lvl, setLvl] = useState(0);

  useEffect(() => {
    if (points >= 0 && points < l1) setLvl(0);
    else if (points >= l1 && points < l2) setLvl(1);
    else if (points >= l2 && points < l3) setLvl(2);
    else if (points >= l3 && points < l4) setLvl(3);
    else if (points >= l4 && points < l5) setLvl(4);
    else if (points >= l5 && points < l6) setLvl(5);
    else if (points >= l6) setLvl(6);
  }, [points, user]);

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

  //Live bets
  useEffect(() => {
    socket.on("getLiveBetData", () => {
      //get live data
      liveBets()
        .then((res) => {
          setCurrLiveBets(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [socket, user]);
  useEffect(() => {
    liveBets()
      .then((res) => {
        setCurrLiveBets(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //My bets
  useEffect(() => {
    if (user && user != undefined) {
      //get live data
      getMyBets(user?.token, {})
        .then((res) => {
          setMyBets(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  //set totalBet and isRewarded
  useEffect(() => {
    console.log("user :", user);
    if (user && user != undefined) {
      setPoints(user.points);
      setWalletBalance(parseFloat(user.available_balance_eth));
      setBnbWalletBalance(parseFloat(user.available_balance_bsc));
      setPolyWalletBalance(parseFloat(user.available_balance_poly));
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Dice Up | Home</title>
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
      {!loading ? (
        <Layout
          user={user}
          lvl={lvl}
          points={points}
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
          <div className="p-2 md:p-7 flex items-center justify-center mb-4 mt-8">
            <BettingForm
              user={user}
              walletBalance={walletBalance}
              bnbWalletBalance={bnbWalletBalance}
              polyWalletBalance={polyWalletBalance}
              setWalletBalance={setWalletBalance}
              setBnbWalletBalance={setBnbWalletBalance}
              setPolyWalletBalance={setPolyWalletBalance}
              chain={chain}
              socket={socket}
              etherPrice={etherPrice}
              binancePrice={binancePrice}
              maticPrice={maticPrice}
              setMyBets={setMyBets}
            />
          </div>
          <div className="p-2 md:p-7 w-11/12 max-w-5xl bg-secondary flex rounded-2xl mb-24">
            <LiveBetsComponent currLiveBets={currLiveBets} myBets={myBets} />
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
            user={user}
          />
          <Wallet
            setShowWalletModal={setShowWalletModal}
            showWalletModal={showWalletModal}
            user={user}
            walletBalance={walletBalance}
            bnbWalletBalance={bnbWalletBalance}
            chain={chain}
            polyWalletBalance={polyWalletBalance}
            setPoints={setPoints}
            setWalletBalance={setWalletBalance}
            setBnbWalletBalance={setBnbWalletBalance}
            setPolyWalletBalance={setPolyWalletBalance}
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
}
