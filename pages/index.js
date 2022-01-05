import Head from "next/head";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Login from "../components/modals/Login";
import axios from "axios";
import Wallet from "../components/modals/Wallet";
import Portis from "@portis/web3";
import Web3 from "web3";

export default function Home() {
  const [user, setUser] = useState();
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [betTurnout, setBetTurnout] = useState();

  const portis = new Portis("c029b334-83fc-4385-aa3c-6deb3aed58da", "mainnet");
  const web3 = new Web3(portis.provider);

  useEffect(() => {
    web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
    });
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
        <BettingForm setBetTurnout={setBetTurnout} betTurnout={betTurnout} />
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
