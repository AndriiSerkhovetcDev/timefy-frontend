import { GoogleIcon } from "@/shared/ui";

type GoogleAuthProps = {
  label?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;

export const GoogleAuth = ({ label = "Увійти через Google" }: GoogleAuthProps) => {
  const handleGoogleAuth = () => {
    window.location.href = API_GOOGLE_AUTH_URL;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-lg text-gray-700 font-medium text-sm transition hover:bg-bg-main cursor-pointer active:scale-95"
    >
      <GoogleIcon />
      {label}
    </button>
  );
};
