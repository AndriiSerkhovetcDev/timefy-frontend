import defaultUserImg from "@/assets/default-avatar.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchApiAsset, isApiAssetUrl } from "@/shared/api/httpClient";
import { useEffect, useState, type SyntheticEvent } from "react";
import type { User } from "../model/types";
import { getUserDisplayName, getUserInitials } from "../model/user";

type UserAvatarProps = {
  user: User;
  className?: string;
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = defaultUserImg;
};

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const [src, setSrc] = useState(defaultUserImg);

  useEffect(() => {
    const avatar = user.avatar;
    if (!avatar) {
      setSrc(defaultUserImg);
      return;
    }

    if (!isApiAssetUrl(avatar)) {
      setSrc(avatar);
      return;
    }

    let isCancelled = false;
    let objectUrl: string | undefined;

    setSrc(defaultUserImg);
    fetchApiAsset(avatar)
      .then((blob) => {
        if (isCancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSrc(defaultUserImg);
      });

    return () => {
      isCancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user.avatar]);

  return (
    <Avatar className={className}>
      <AvatarImage
        src={src}
        alt={`Аватар користувача ${getUserDisplayName(user)}`}
        onError={handleImageError}
      />
      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
    </Avatar>
  );
};
