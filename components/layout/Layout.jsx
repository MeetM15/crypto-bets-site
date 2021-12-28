import Navbar from "../navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
