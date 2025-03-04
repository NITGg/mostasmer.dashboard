import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Coupons",
  description: "This is a page for Coupons",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
