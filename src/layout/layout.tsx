import { ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-white dark:bg-[#202124] text-gray-900 dark:text-[#E8EAED] min-h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
