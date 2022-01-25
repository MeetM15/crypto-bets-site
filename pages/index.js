import Head from "next/head";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Login from "../components/modals/Login";
import axios from "axios";
import Wallet from "../components/modals/Wallet";
import { MoonLoader } from "react-spinners";
import { io } from "socket.io-client";
import Web3 from "web3";
import LiveBetsComponent from "../components/liveBets/LiveBetsComponent";
import Referral from "../components/modals/Referral";
import Logout from "../components/modals/Logout";
import { useRouter } from "next/router";
const web3 = new Web3(
  "https://eth-rinkeby.alchemyapi.io/v2/sk88g0PfYAHxltvWlVpWWbvrXMnv22TN"
);
const web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/487960593a8857bde8a74862/bsc/testnet"
);
const socket = io("https://cryptodice1.herokuapp.com/");

const coingeckoUrl = () => {
  return `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin&vs_currencies=usd`;
};

const l1 = 1000;
const l2 = 5000;
const l3 = 10000;
const l4 = 20000;
const l5 = 30000;
const l6 = 40000;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [loginTab, setLoginTab] = useState("login");
  const [chain, setChain] = useState("eth");
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [bnbWalletBalance, setBnbWalletBalance] = useState(0.0);
  const [currLiveBets, setCurrLiveBets] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [etherPrice, setEtherPrice] = useState(0.0);
  const [binancePrice, setBinancePrice] = useState(0.0);
  const [totalBetAmt, setTotalBetAmt] = useState(0.0);
  const [isRewarded, setIsRewarded] = useState(1);
  const [lvl, setLvl] = useState(1);
  //total bet amt
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
    if (totalBetAmt >= 0 && totalBetAmt < l1) setLvl(1);
    else if (totalBetAmt >= l1 && totalBetAmt < l2) setLvl(2);
    else if (totalBetAmt >= l2 && totalBetAmt < l3) setLvl(3);
    else if (totalBetAmt >= l3 && totalBetAmt < l4) setLvl(4);
    else if (totalBetAmt >= l4 && totalBetAmt < l5) setLvl(5);
    else if (totalBetAmt >= l5 && totalBetAmt < l6) setLvl(6);
    else if (totalBetAmt >= l6) setLvl(7);
  }, [totalBetAmt, user]);

  //fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      fetch(coingeckoUrl()).then((response) =>
        response.json().then((jsonData) => {
          console.log(jsonData);
          setEtherPrice(jsonData.ethereum.usd);
          setBinancePrice(jsonData.binancecoin.usd);
        })
      );
    };
    fetchPrices();
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
      axios
        .get("liveBets")
        .then((res) => {
          setCurrLiveBets(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [socket]);
  useEffect(() => {
    axios
      .get("liveBets")
      .then((res) => {
        setCurrLiveBets(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //My bets
  useEffect(() => {
    if (user && user[0] != undefined) {
      //get live data
      axios
        .post("myBets", { email: user[0].email })
        .then((res) => {
          setMyBets(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  //set totalBet and isRewarded
  useEffect(() => {
    if (user && user[0] != undefined) {
      axios
        .post("/getTotalBet", {
          email: user[0].email,
        })
        .then((res) => {
          setTotalBetAmt(parseFloat(res.data[0].totalBetAmt));
          setIsRewarded(parseFloat(res.data[0].usedReferralBonus));
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  //get user details
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUser([res.data.authorizedData]);
        })
        .catch((error) => {
          setUser([]);
          console.log(error);
        });
    } else {
      setUser([]);
    }
  }, []);

  //get balance
  useEffect(() => {
    if (user && user[0] != undefined) {
      web3.eth
        .getBalance(user[0].address)
        .then((res) => {
          return web3.utils.fromWei(res);
        })
        .then((res) => {
          setWalletBalance(
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
          );
        });
      web3_bsc.eth
        .getBalance(user[0].bscAddress)
        .then((res) => {
          return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          setBnbWalletBalance(
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
          );
        });
    }
  }, []);
  useEffect(() => {
    console.log(user);
    if (user && user[0] != undefined) {
      web3.eth
        .getBalance(user[0].address)
        .then((res) => {
          return web3.utils.fromWei(res);
        })
        .then((res) => {
          setWalletBalance(
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
          );
        });
      web3_bsc.eth
        .getBalance(user[0].bscAddress)
        .then((res) => {
          return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          setBnbWalletBalance(
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
          );
        });
    }
  }, [user]);
  useEffect(() => {
    if (user && user[0] != undefined) {
      web3.eth
        .getBalance(user[0].address)
        .then((res) => {
          return web3.utils.fromWei(res);
        })
        .then((res) => {
          console.log(res);
          setWalletBalance(
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
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
            parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
          );
        });
    }
  }, [showWalletModal]);

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
      {user ? (
        <Layout
          user={user}
          lvl={lvl}
          totalBetAmt={totalBetAmt}
          setToggleLoginModalOpen={setToggleLoginModalOpen}
          setShowWalletModal={setShowWalletModal}
          walletBalance={walletBalance}
          chain={chain}
          setChain={setChain}
          loginTab={loginTab}
          setLoginTab={setLoginTab}
          bnbWalletBalance={bnbWalletBalance}
          web3={web3}
          web3_bsc={web3_bsc}
          setWalletBalance={setWalletBalance}
          setBnbWalletBalance={setBnbWalletBalance}
          setShowReferralModal={setShowReferralModal}
          showLogoutModal={showLogoutModal}
          setShowLogoutModal={setShowLogoutModal}>
          <div className="p-2 md:p-7 flex items-center justify-center mb-4 mt-8">
            <BettingForm
              user={user}
              walletBalance={walletBalance}
              bnbWalletBalance={bnbWalletBalance}
              web3={web3}
              web3_bsc={web3_bsc}
              setWalletBalance={setWalletBalance}
              setBnbWalletBalance={setBnbWalletBalance}
              setToggleLoginModalOpen={setToggleLoginModalOpen}
              chain={chain}
              socket={socket}
              etherPrice={etherPrice}
              setEtherPrice={setEtherPrice}
              binancePrice={binancePrice}
              setBinancePrice={setBinancePrice}
              setUser={setUser}
              totalBetAmt={totalBetAmt}
              setTotalBetAmt={setTotalBetAmt}
              setMyBets={setMyBets}
              myBets={myBets}
            />
          </div>
          <div className="p-2 md:p-7 w-11/12 max-w-5xl bg-secondary flex rounded-2xl mb-24">
            <LiveBetsComponent currLiveBets={currLiveBets} myBets={myBets} />
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
}
