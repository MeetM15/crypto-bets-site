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
const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/44bc1ff84c8edc2499fd1db9/eth/rinkeby"
);
const web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/487960593a8857bde8a74862/bsc/testnet"
);
const socket = io("https://cryptodice1.herokuapp.com/");

export default function Home() {
  const [user, setUser] = useState();
  const [chain, setChain] = useState("eth");
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [bnbWalletBalance, setBnbWalletBalance] = useState(0.0);
  const [currLiveBets, setCurrLiveBets] = useState([]);
  const [myBets, setMyBets] = useState([]);

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
    socket.on("getMyBetData", () => {
      //get live data
      axios
        .post("myBets", { email: user && user[0] ? user[0].email : "" })
        .then((res) => {
          setMyBets(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [socket, user]);
  useEffect(() => {
    if (user && user[0] != undefined) {
      //post live data
      axios
        .post("myBets", { email: user[0].email })
        .then((res) => {
          setMyBets(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  useEffect(() => {
    if (user && user[0] != undefined) {
      //post live data
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
          console.log(res);
          setWalletBalance(parseFloat(res) - 0.00003);
        });
      web3_bsc.eth
        .getBalance(user[0].bscAddress)
        .then((res) => {
          return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          console.log(res);
          setBnbWalletBalance(parseFloat(res) - 0.000001);
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
          setWalletBalance(parseFloat(res) - 0.00003);
        });
      web3_bsc.eth
        .getBalance(user[0].bscAddress)
        .then((res) => {
          return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          console.log(res);
          setBnbWalletBalance(parseFloat(res) - 0.000001);
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
          setWalletBalance(parseFloat(res) - 0.00003);
        });
      web3_bsc.eth
        .getBalance(user[0].bscAddress)
        .then((res) => {
          return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          console.log(res);
          setBnbWalletBalance(parseFloat(res) - 0.000001);
        });
    }
  }, [showWalletModal]);

  return user ? (
    <Layout
      user={user}
      setToggleLoginModalOpen={setToggleLoginModalOpen}
      setShowWalletModal={setShowWalletModal}
      walletBalance={walletBalance}
      chain={chain}
      setChain={setChain}
      bnbWalletBalance={bnbWalletBalance}
      web3={web3}
      web3_bsc={web3_bsc}
      setWalletBalance={setWalletBalance}
      setBnbWalletBalance={setBnbWalletBalance}>
      <Head>
        <title>Crypto Dice</title>
      </Head>
      <div className="p-8 flex items-center justify-center">
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
        />
      </div>
      <div className="p-8 w-full h-screen bg-white flex">
        <LiveBetsComponent currLiveBets={currLiveBets} myBets={myBets} />
      </div>
      <Login
        toggleLoginModalOpen={toggleLoginModalOpen}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
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
    </Layout>
  ) : (
    <div className="w-screen h-screen flex items-center justify-center">
      <MoonLoader color={"#6d28d9"} size={"50px"} />
    </div>
  );
}
