import { googleAuth } from "@/shared/api/authApi";
import { GoogleIcon } from "@/shared/ui";
import { useAuthStore } from "../model/authStore";
import { useNavigate } from "react-router-dom";

type GoogleAuthProps = {
  label?: string;
};

export const GoogleAuth = ({ label = "Увійти через Google" }: GoogleAuthProps) => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const data = await googleAuth();
      console.log(data);

      if (data?.user && data?.token) {
        login(data.user, data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Помилка Google авторизації:", error);
    }
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
