import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "User roles",
  description: "This is a page for user roles",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
