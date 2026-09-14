import { fetchApiAsset, isApiAssetUrl } from "@/shared/api/httpClient";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";

type OrganizationLogoProps = {
  logoUrl: string | null;
  name: string;
  className?: string;
  iconClassName?: string;
};

export const OrganizationLogo = ({
  logoUrl,
  name,
  className = "size-full object-cover",
  iconClassName = "size-6 text-muted-foreground",
}: OrganizationLogoProps) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!logoUrl) {
      setSrc(null);
      return;
    }
    if (!isApiAssetUrl(logoUrl)) {
      setSrc(logoUrl);
      return;
    }

    let active = true;
    let objectUrl: string | undefined;
    setSrc(null);
    fetchApiAsset(logoUrl)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => active && setSrc(null));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [logoUrl]);

  return src ? (
    <img src={src} alt={`Логотип ${name}`} className={className} />
  ) : (
    <Building2 className={iconClassName} aria-hidden="true" />
  );
};
