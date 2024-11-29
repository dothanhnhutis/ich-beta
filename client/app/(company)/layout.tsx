import React from "react";
import Header from "./header";
import Footer from "./footer";

const CompanyLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default CompanyLayout;
