"use client";
import SearchBar from "@/components/Searchbar";
import { useState } from "react";

const TabsSection = ({ children }: { children: React.ReactNode[] }) => {
  const [activeTab, setActiveTab] = useState<"orders" | "notifications">(
    "orders"
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="bg-white text-[#59be8f] rounded-xl shadow-2xl">
          <div className="flex gap-2 py-2 px-4">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === "orders"
                  ? "bg-[#02161e] text-white"
                  : "text-[#2ab09c] hover:bg-slate-100"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#02161e] text-white"
                  : "text-[#2ab09c] hover:bg-slate-100"
              }`}
            >
              Notifications
            </button>
          </div>
        </div>
        <SearchBar />
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === "orders" ? children[0] : children[1]}
      </div>
    </div>
  );
};

export default TabsSection;
