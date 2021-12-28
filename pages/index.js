import Head from "next/head";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Login from "../components/modals/Login";
import axios from "axios";

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

export default function Home() {
  const [user, setUser] = useState();
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(false);
  const [betTurnout, setBetTurnout] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(token);
  }, []);
  return (
    <Layout user={user} setToggleLoginModalOpen={setToggleLoginModalOpen}>
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
    </Layout>
  );
}
