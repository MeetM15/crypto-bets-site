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
  web3,
  web3_bsc,
}) => {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar
        user={user}
        chain={chain}
        setChain={setChain}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
        walletBalance={walletBalance}
        bnbWalletBalance={bnbWalletBalance}
        web3={web3}
        web3_bsc={web3_bsc}
        setWalletBalance={setWalletBalance}
        setBnbWalletBalance={setBnbWalletBalance}
      />
      {children}
    </div>
  );
};

export default Layout;
