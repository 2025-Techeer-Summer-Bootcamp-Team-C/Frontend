import Header from "./Header";
import Footer from "./Footer";
import React from "react";

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
      <Header/>
      <main>
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;