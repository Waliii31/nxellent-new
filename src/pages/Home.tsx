import CoreFeatures from "../components/sections/CoreFeatures";
import Herosection from "../components/sections/Herosection";
import TopProjects from "../components/sections/TopProjects";
import Footer from "../components/sections/Footer";
import KPIStatsBar from "../components/ui/KPIStatsBar";

const Home = () => {
  return (
    <>
      <Herosection />
      <CoreFeatures />
      <div className="max-w-7xl mx-auto px-4">
        <KPIStatsBar />
      </div>
      <TopProjects />
      {/* <CtaSection
        heading="READY TO KICKSTART?"
        primary={{
          label: "Run Full Scan",
          icon: <ArrowUpRight size={16} />,
          whereTo: "projects/my-projects",
        }}
        secondary={{ label: "View Leaderboard", whereTo: "leaderboard" }}
      /> */}
      <Footer />
    </>
  );
};

export default Home;
