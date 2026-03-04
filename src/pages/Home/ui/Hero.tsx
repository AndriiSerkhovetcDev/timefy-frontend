import { HeroText } from "./HeroText";
import { HeroVisual } from "./HeroVisual";

export const Hero = () => {
  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <HeroText />
        {HeroVisual && <HeroVisual />}
      </div>
    </div>
  );
};
