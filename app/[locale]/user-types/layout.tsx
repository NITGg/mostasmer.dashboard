import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "User types",
  description: "This is a page for user types",
};
import React from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
