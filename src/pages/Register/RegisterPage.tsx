import { GoogleAuth } from "@/features/auth/ui/GoogleAuth";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <h1 className="mb-1 text-2xl text-center font-bold text-primary">Реєстрація</h1>
        <RegisterForm />

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">або</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <GoogleAuth label="Зареєструватись через Google" />

        <p className="mt-6 text-sm text-center text-gray-500">
          Є акаунт?{" "}
          <Link to="/login" className="font-medium text-secondary hover:underline">
            Вхід
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
