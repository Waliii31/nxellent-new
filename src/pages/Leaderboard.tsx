import { ArrowUpRight } from "lucide-react";
import CtaSection from "../components/sections/CtaSection";
import LeaderHero from "../components/sections/LeaderHero";
import SmartContracts from "../components/sections/SmartContracts";
import Footer from "../components/sections/Footer";

const Leaderboard = () => {
  return (
    <div className="bg-[#020C30]">
      <LeaderHero />
      <SmartContracts />
      <CtaSection
        heading={
          <>
            READY TO SEE <br /> WHERE YOU RANK?
          </>
        }
        primary={{
          label: "Submit Your Project",
          icon: <ArrowUpRight size={16} />,
          whereTo: "projects/my-projects",
        }}
      />
      <Footer />
    </div>
  );
};

export default Leaderboard;
