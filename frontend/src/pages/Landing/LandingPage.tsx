import HeroSection from "../../widgets/HeroSection/HeroSection";
import LandingFooter from "../../widgets/LandingFooter/LandingFooter";
import LandingHeader from "../../widgets/LandingHeader/LandingHeader";
import PosibilitiesSection from "../../widgets/PosibilitiesSection/PosibilitiesSection";
import SubscribeSection from "../../widgets/SubscribeSection/SubscribeSection";
import PosibilitiesAdditionSection from "../../widgets/PosibilitiesAdditionSection/PosibilitiesAdditionSection";

export const Landing = () => {
  return (
    <div className="bg-landing-primary-bg w-full h-full px-4 sm:px-6 md:px-10 lg:px-14 relative overflow-hidden">
      <div className="w-150 sm:w-170 h-150 sm:h-170 bg-glare absolute rounded-full -left-140 top-18 blur-[100px] duration-200"></div>
      <div className="w-150 sm:w-170 h-150 sm:h-170 bg-glare absolute rounded-full -right-140 top-18 blur-[100px] duration-200"></div>
      <LandingHeader />
      <main className="flex flex-col items-center z-999">
        <HeroSection />
        <PosibilitiesSection />
        <PosibilitiesAdditionSection />
        <SubscribeSection />
      </main>
      <LandingFooter />
    </div>
  );
};
