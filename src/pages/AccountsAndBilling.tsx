// src/pages/AccountsAndBilling.tsx
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Subscription from "../components/tabs-content/Accounts-billing-tabs-content/Subscription";
import BillingHistory from "../components/tabs-content/Accounts-billing-tabs-content/BillingHistory";
import AccountSettings from "../components/tabs-content/Accounts-billing-tabs-content/AccountSettings";

type BillingType = "founder" | "investor";

const AccountsAndBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Subscription");
  const tabs = ["Subscription", "Billing History", "Account Settings"];

  const location = useLocation();
  const initialBillingType: BillingType =
    (location.state as any)?.billingType === "investor"
      ? "investor"
      : "founder";

  const [billingType] = useState<BillingType>(initialBillingType);

  const renderContent = () => {
    switch (activeTab) {
      case "Subscription":
        return <Subscription billingType={billingType} />;
      case "Billing History":
        return <BillingHistory />;
      case "Account Settings":
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <main
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen text-white"
    >
      {/* Top bar */}
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 lg:px-32 h-14 sm:h-16 flex items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} />
          <span className="truncate">Back to Home</span>
        </Link>
      </nav>

      {/* Header */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 lg:px-32">
        <header className="flex flex-col md:flex-row justify-between gap-3 sm:gap-6 md:items-center">
          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <span className="urbanist text-xl sm:text-2xl font-bold truncate">
              Account & Billing
            </span>
            <span className="urbanist font-medium text-white/70 text-sm sm:text-lg">
              Manage your subscription and account settings
            </span>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="my-8 mx-auto sm:my-12 max-w-7xl">
          <div
            className="relative w-full rounded-2xl sm:rounded-full p-2 sm:p-1"
            style={{
              border: "1px solid #FD7EFF",
              backgroundColor: "rgb(0 0 0 / 10%)",
            }}
          >
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      "rounded-full inter text-xs sm:text-sm font-semibold transition-all duration-200",
                      "py-3 sm:py-3.5 px-5 sm:px-12",
                      "w-full sm:w-auto sm:flex-1 text-center",
                      isActive
                        ? "bg-[#FFC2C8] text-[#090123]"
                        : "text-white/70 hover:text-white",
                    ].join(" ")}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </section>
    </main>
  );
};

export default AccountsAndBilling;
