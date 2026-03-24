import React from "react";

type TabsNavProps = {
  /** List of tab names to display */
  tabs: string[];
  /** Currently active tab */
  activeTab: string;
  /** Function to set active tab */
  setActiveTab: (tab: string) => void;
  /** Optional extra styling */
  classNameOuter?: string;
  classNameInner?: string;
};

const TabsNav: React.FC<TabsNavProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  classNameOuter = "",
  classNameInner = "",
}) => {
  return (
    <div className={`my-14 flex justify-start ${classNameOuter}`}>
      <div
        className={`flex ${classNameInner} gap-2 p-1 rounded-full`}
        style={{
          border: "1px solid #FD7EFF",
          backgroundColor: "rgb(0 0 0 / 10%)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-3.5 cursor-pointer rounded-full inter text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] shadow-[0_0_10px_rgba(255,0,64,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabsNav;
