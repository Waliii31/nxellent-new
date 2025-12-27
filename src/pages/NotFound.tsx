import { ArrowLeft, Home as HomeIcon, LifeBuoy } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

const NotFound = () => {
  return (
    <div className="min-h-svh bg-[#020C30] text-white flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(253,126,255,0.15),_transparent_45%)]" />
        <Navbar isFixed={false} />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20" aria-hidden />
        <div className="relative max-w-3xl w-full mx-auto text-center space-y-6 bg-black/40 border border-[#2A2355] rounded-2xl p-10 shadow-[0_0_40px_0_#A855F733] backdrop-blur">
          <p className="jakarta inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FD7EFF] bg-white/5 px-4 py-2 rounded-full border border-[#FD7EFF]/50">
            <ArrowLeft size={14} /> Page not found
          </p>
          <h1 className="anybody text-4xl sm:text-5xl font-semibold leading-tight">
            This route drifted into the void.
          </h1>
          <p className="alexandria text-white/70 text-lg">
            The page you’re looking for doesn’t exist, or the link is outdated. Let’s get you back to safety.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <PrimaryButton icon={<HomeIcon size={16} />} whereTo="">
              Return Home
            </PrimaryButton>
            <SecondaryButton whereTo="projects/my-projects" iconPosition="left" icon={<ArrowLeft size={15} />}>
              Go to Dashboard
            </SecondaryButton>
            <SecondaryButton
              iconPosition="left"
              icon={<LifeBuoy size={15} />}
              onClick={() => window.open("mailto:support@nxellent.com", "_blank")}
            >
              Contact Support
            </SecondaryButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
