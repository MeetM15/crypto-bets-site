import Navbar from "../navbar/Navbar";

const Layout = ({
  children,
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
  walletBalance,
}) => {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar
        user={user}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
        walletBalance={walletBalance}
      />
      {children}
    </div>
  );
};

export default Layout;
