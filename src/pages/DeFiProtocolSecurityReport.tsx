import React, { useState } from "react";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  Clock,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import SecondaryButton from "../components/ui/SecondaryButton";
import PrimaryButton from "../components/ui/PrimaryButton";
import SubtlePill from "../components/ui/SubtlePill";
import Overview from "../components/tabs-content/Defi-Protocol-tabs-content/Overview";
import Issues from "../components/tabs-content/Defi-Protocol-tabs-content/Issues";
import Categories from "../components/tabs-content/Defi-Protocol-tabs-content/Categories";
import Timeline from "../components/tabs-content/Defi-Protocol-tabs-content/Timeline";

const DeFiProtocolSecurityReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Issues", "Categories", "Timeline"];

  const shareReport = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "NXELLENT Security Report", url }).catch(() => { });
      return;
    }
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => { });
  };

  const exportPdf = () => window.print();
  const openPublicPage = () => window.open(window.location.href, "_blank", "noopener");

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <Overview />
        );
      case "Issues":
        return (
          <Issues />
        );
      case "Categories":
        return (
          <Categories />
        );
      case "Timeline":
        return (
          <Timeline />
        );
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
      className="min-h-screen pb-20 text-white"
    >
      {/* Top bar */}
      <nav className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32 h-16 flex items-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </nav>

      {/* Header */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32">
        <header className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="anybody text-3xl font-bold">
              DeFi Protocol — Security Report
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/70">
              <span className="urbanist flex justify-center items-center gap-2 text-xs text-[#FD7EFF] font-semibold px-5 py-1 inter rounded-full border border-[#FD7EFF]">
                <Clock size={14} /> 2h ago
              </span>
              <SubtlePill>Solana Program</SubtlePill>
              <SubtlePill>Anchor Framework</SubtlePill>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton icon={<Share2 size={16} />} onClick={shareReport}>
              Share
            </SecondaryButton>
            <SecondaryButton icon={<Download size={16} />} onClick={exportPdf}>
              Export PDF
            </SecondaryButton>
            <PrimaryButton icon={<ExternalLink size={16} />} onClick={openPublicPage}>
              Public Page
            </PrimaryButton>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className={"my-14 flex justify-start"}>
          <div
            className={"flex gap-2 p-1 rounded-full"}
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
                  className={`px-12 py-3.5 cursor-pointer rounded-full inter text-sm font-semibold transition-all duration-200 ${isActive
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
        {/* Tab Content */}
        {renderContent()}

      </section>
    </main>
  );
};

export default DeFiProtocolSecurityReport;
