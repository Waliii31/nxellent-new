import SegmentedToggle from "../ui/SegmentedToggle";
import Navbar from "./Navbar";


const LeaderHero = () => {
  return (
    <section className="relative w-full">
      <div className="relative z-30">
        <Navbar isFixed={true} />
      </div>

      {/* Background Image */}
      <img
        src="/all-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 md:px-8 lg:px-10 min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="anybody text-white font-semibold text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-tight tracking-[-0.01em]">
          Leaderboard
        </h1>

        <p className="alexandria text-white/90 font-light mt-3 sm:mt-4 md:mt-5 text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed tracking-[-0.02em] max-w-2xl">
          See how the top projects stack up. Get inspired. Get competitive.
        </p>
        <div className="mt-5">
          <SegmentedToggle />
        </div>
      </div>
    </section>
  );
};

export default LeaderHero;
