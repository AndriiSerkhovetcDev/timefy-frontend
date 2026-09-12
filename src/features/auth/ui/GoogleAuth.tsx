import { GoogleIcon } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { startExternalAuthorization } from "../model/externalAuth";

type GoogleAuthProps = {
  label?: string;
  className?: string;
};

export const GoogleAuth = ({ label = "Увійти через Google", className }: GoogleAuthProps) => {
  const handleGoogleAuth = () => {
    startExternalAuthorization("GOOGLE");
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-text-main transition hover:bg-bg-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99]",
        className,
      )}
    >
      <GoogleIcon />
      {label}
    </button>
  );
};
