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
}) => {
  return (
    <div className="bg-primary-5 min-h-screen">
      <Navbar
        user={user}
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
      />
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};

export default Layout;
