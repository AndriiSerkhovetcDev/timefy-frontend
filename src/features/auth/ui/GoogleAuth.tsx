import { GoogleIcon } from "@/shared/ui";
import { startExternalAuthorization } from "../model/externalAuth";

type GoogleAuthProps = {
  label?: string;
};

export const GoogleAuth = ({ label = "Увійти через Google" }: GoogleAuthProps) => {
  const handleGoogleAuth = () => {
    startExternalAuthorization("GOOGLE");
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-lg text-text-main font-medium text-sm transition hover:bg-bg-main cursor-pointer active:scale-95"
    >
      <GoogleIcon />
      {label}
    </button>
  );
};
