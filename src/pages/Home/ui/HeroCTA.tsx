import Button from "@/shared/ui/buttons/Button";
import {
  HERO_CTA_TEXT_PRIMARY,
  HERO_CTA_TEXT_PRIMARY_HREF,
  HERO_CTA_TEXT_OUTLET,
  HERO_CTA_TEXT_OUTLET_HREF,
} from "../model/constans";
import { ArrowRightIcon, PlayIcon } from "@/shared/ui";

export const HeroCTA = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <Button
        href={HERO_CTA_TEXT_PRIMARY_HREF}
        variant="primary"
        iconPosition="right"
        icon={<ArrowRightIcon />}
      >
        {HERO_CTA_TEXT_PRIMARY}
      </Button>

      <Button
        href={HERO_CTA_TEXT_OUTLET_HREF}
        variant="outlet"
        iconPosition="left"
        icon={<PlayIcon />}
      >
        {HERO_CTA_TEXT_OUTLET}
      </Button>
    </div>
  );
};
