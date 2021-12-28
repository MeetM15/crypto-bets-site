import Navbar from "../navbar/Navbar";

const Layout = ({ children, user, setToggleLoginModalOpen }) => {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar user={user} setToggleLoginModalOpen={setToggleLoginModalOpen} />
      {children}
    </div>
  );
};

export default Layout;
