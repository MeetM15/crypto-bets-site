import Head from "next/head";
import BettingForm from "../components/bettingForm/BettingForm";
import Layout from "../components/layout/Layout";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Login from "../components/modals/Login";

export default function Home() {
  const [toggleLoginModalOpen, setToggleLoginModalOpen] = useState(true);
  return (
    <Layout>
      <div className="p-8 flex items-center justify-center">
        <BettingForm />
      </div>
      <Login
        toggleLoginModalOpen={toggleLoginModalOpen}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
      />
    </Layout>
  );
}
