import HeroSection from "../../widgets/HeroSection/HeroSection";
import LandingFooter from "../../widgets/LandingFooter/LandingFooter";
import LandingHeader from "../../widgets/LandingHeader/LandingHeader";
import PosibilitiesSection from "../../widgets/PosibilitiesSection/PosibilitiesSection";
import SubscribeSection from "../../widgets/SubscribeSection/SubscribeSection";
import PosibilitiesAdditionSection from "../../widgets/PosibilitiesAdditionSection/PosibilitiesAdditionSection";

export const Landing = () => {
  return (
    <div className="bg-landing-primary-bg w-full h-full px-4 sm:px-6 md:px-10 lg:px-14 relative">
      <div className="w-170 h-170 bg-glare absolute rounded-full -left-140 top-18 blur-[100px] z-1 duration-200"></div>
      <div className="w-170 h-170 bg-glare absolute rounded-full -right-140 top-18 blur-[100px] z-1 duration-200"></div>
      <LandingHeader />
      <main className="flex flex-col items-center">
        <HeroSection />
        <PosibilitiesSection />
        <PosibilitiesAdditionSection />
        <SubscribeSection />
      </main>
      <LandingFooter />
    </div>
  );
};
