import Head from "next/head";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Login from "../components/modals/Login";
import axios from "axios";
import Wallet from "../components/modals/Wallet";
import Web3 from "web3";
const web3 = new Web3(
  "wss://rinkeby.infura.io/ws/v3/f3ad0d479bf94c1791f813da1a914632"
);

export default function Home() {
  const [user, setUser] = useState();
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [betTurnout, setBetTurnout] = useState();
  const [walletBal, setWalletBal] = useState(0.0);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data.authorizedData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  useEffect(() => {
    if (user != undefined) {
      // const bal = web3.eth.getBalance(user.address);
    }
  }, [user]);

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <Layout
      user={user}
      setToggleLoginModalOpen={setToggleLoginModalOpen}
      setShowWalletModal={setShowWalletModal}>
      <Head>
        <title>Crypto Dice</title>
      </Head>
      <div className="p-8 flex items-center justify-center">
        <BettingForm
          user={user}
          setBetTurnout={setBetTurnout}
          betTurnout={betTurnout}
        />
      </div>
      <Login
        toggleLoginModalOpen={toggleLoginModalOpen}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
      />
      <Wallet
        setShowWalletModal={setShowWalletModal}
        showWalletModal={showWalletModal}
        userAcc={user}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
      />
    </Layout>
  );
}
