import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Badges",
  description: "This is a page for Badges",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
