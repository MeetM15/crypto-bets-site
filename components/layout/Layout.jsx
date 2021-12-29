import Navbar from "../navbar/Navbar";

const Layout = ({
  children,
  user,
  setToggleLoginModalOpen,
  setShowWalletModal,
}) => {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar
        user={user}
        setToggleLoginModalOpen={setToggleLoginModalOpen}
        setShowWalletModal={setShowWalletModal}
      />
      {children}
    </div>
  );
};

export default Layout;
