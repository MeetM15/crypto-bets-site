import Navbar from "../navbar/Navbar";

const Layout = ({
  children,
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
  bnbWalletBalance,
  setWalletBalance,
  setBnbWalletBalance,
  chain,
  setChain,
  loginTab,
  setLoginTab,
  web3,
  web3_bsc,
  setShowReferralModal,
  showLogoutModal,
  setShowLogoutModal,
  lvl,
  totalBetAmt,
}) => {
  return (
    <div className="bg-primary-5 min-h-screen">
      <Navbar
        user={user}
        lvl={lvl}
        totalBetAmt={totalBetAmt}
        chain={chain}
        setChain={setChain}
        loginTab={loginTab}
        setLoginTab={setLoginTab}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
        walletBalance={walletBalance}
        bnbWalletBalance={bnbWalletBalance}
        web3={web3}
        web3_bsc={web3_bsc}
        setWalletBalance={setWalletBalance}
        setBnbWalletBalance={setBnbWalletBalance}
        setShowReferralModal={setShowReferralModal}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      />
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};

export default Layout;
