import { GoogleIcon } from "@/shared/ui";
import { API_GOOGLE_AUTH_URL } from "@/shared/api/authApi";

type GoogleAuthProps = {
  label?: string;
};

export const GoogleAuth = ({ label = "Увійти через Google" }: GoogleAuthProps) => {
  const handleGoogleAuth = () => {
    window.location.href = API_GOOGLE_AUTH_URL;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium transition hover:bg-gray-50 cursor-pointer active:scale-95"
    >
      <GoogleIcon />
      {label}
    </button>
  );
};
