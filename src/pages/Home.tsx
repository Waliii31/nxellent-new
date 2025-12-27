import { ArrowUpRight } from "lucide-react";
import CoreFeatures from "../components/sections/CoreFeatures";
import CtaSection from "../components/sections/CtaSection";
import Herosection from "../components/sections/Herosection";
import TopProjects from "../components/sections/TopProjects";
import Footer from "../components/sections/Footer";

const Home = () => {
  return (
    <>
      <Herosection />
      <CoreFeatures />
      <TopProjects />
      <CtaSection
        heading="READY TO KICKSTART?"
        primary={{
          label: "Run Full Scan",
          icon: <ArrowUpRight size={16} />,
          whereTo: "projects/my-projects",
        }}
        secondary={{ label: "View Leaderboard", whereTo: "leaderboard" }}
      />
      <Footer />
    </>
  );
};

export default Home;
