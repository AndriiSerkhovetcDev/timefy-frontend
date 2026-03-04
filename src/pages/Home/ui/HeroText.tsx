import { HERO_DESCRIPTION, HERO_HEADING_ACCENT, HERO_HEADING_STATIC } from "../model/constans";
import { HeroCTA } from "./HeroCTA";

export const HeroText = () => {
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-6">
        {HERO_HEADING_STATIC} <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
          {HERO_HEADING_ACCENT}
        </span>
      </h1>

      <p className="text-lg text-text-light mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
        {HERO_DESCRIPTION}
      </p>

      <HeroCTA />
    </div>
  );
};
