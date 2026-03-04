// @flow

import { HERO_IMAGE_ALT } from "../model/constans";
import heroImage from "@/assets/hero.png";

export const HeroVisual = () => {
  return (
    <div className="relative lg:h-150 flex items-center justify-center">
      <img
        src={heroImage}
        alt={HERO_IMAGE_ALT}
        className="w-full md:w-2/3 lg:w-full h-full object-cover rounded-3xl"
      />
    </div>
  );
};
