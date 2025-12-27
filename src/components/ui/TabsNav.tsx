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
                  ? "bg-[#FFC2C8] text-[#090123]"
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
