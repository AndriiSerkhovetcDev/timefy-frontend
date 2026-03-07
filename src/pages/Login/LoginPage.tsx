import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <h1 className="mb-1 text-2xl text-center font-bold text-primary">Вхід</h1>
        <LoginForm />

        <p className="mt-6 text-sm text-center text-gray-500">
          Немає акаунту?{" "}
          <Link to="/register" className="font-medium text-secondary hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
