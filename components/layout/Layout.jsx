import Navbar from "../navbar/Navbar";

const Layout = ({
  children,
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
  bnbWalletBalance,
  chain,
  setChain,
  setLoginTab,
  setShowReferralModal,
  setShowLogoutModal,
  lvl,
  totalBetAmt,
}) => {
  return (
    <div className="bg-primary-5 min-h-screen">
      <Navbar
        user={user}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
        walletBalance={walletBalance}
        bnbWalletBalance={bnbWalletBalance}
        chain={chain}
        setChain={setChain}
        setLoginTab={setLoginTab}
        setShowReferralModal={setShowReferralModal}
        setShowLogoutModal={setShowLogoutModal}
        lvl={lvl}
        totalBetAmt={totalBetAmt}
      />
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};

export default Layout;
