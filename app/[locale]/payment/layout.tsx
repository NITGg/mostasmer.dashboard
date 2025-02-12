import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "payment",
  description: "This is a page for payment",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
