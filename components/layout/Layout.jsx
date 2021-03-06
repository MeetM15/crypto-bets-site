import Navbar from "../navbar/Navbar";

const Layout = ({
  children,
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
  bnbWalletBalance,
  polyWalletBalance,
  chain,
  setChain,
  setLoginTab,
  setShowReferralModal,
  setShowLogoutModal,
  lvl,
  points,
}) => {
  return (
    <div className="bg-primary-5 min-h-screen">
      <Navbar
        user={user}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
        walletBalance={walletBalance}
        bnbWalletBalance={bnbWalletBalance}
        polyWalletBalance={polyWalletBalance}
        chain={chain}
        setChain={setChain}
        setLoginTab={setLoginTab}
        setShowReferralModal={setShowReferralModal}
        setShowLogoutModal={setShowLogoutModal}
        lvl={lvl}
        points={points}
      />
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};

export default Layout;
