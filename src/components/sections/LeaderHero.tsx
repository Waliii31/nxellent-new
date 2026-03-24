import SegmentedToggle from "../ui/SegmentedToggle";
import Navbar from "./Navbar";


const LeaderHero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative z-30">
        <Navbar isFixed={true} />
      </div>

      <img
        src="/all-hero.png"
        alt="Hero Background"
        className="w-full h-[60vh] md:h-[70vh] object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-20">
        <h1 className="anybody text-white font-semibold font-[anybody ] text-[36px] sm:text-[42px] md:text-[48px] leading-[60px]">
          Leaderboard
        </h1>

        <p className="alexandria text-white/90 mt-3 sm:mt-4 font-[Alexandria] text-[16px] sm:text-[18px] md:text-[20px] leading-[100%] tracking-[-0.02em] max-w-2xl">
          See how the top projects stack up. Get inspired. Get competitive.
        </p>
        <SegmentedToggle/>
      </div>
    </section>
  );
};

export default LeaderHero;
