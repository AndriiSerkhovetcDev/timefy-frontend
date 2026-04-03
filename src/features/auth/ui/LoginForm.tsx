import { loginSchema, type LoginFormValues } from "../model/shemas";
import { login } from "@/shared/api/authApi";
import { FormField } from "@/shared/ui";
import { useAuthForm } from "../model/useAuthForm";

export const loginFields = [
  {
    name: "login",
    label: "Логін",
    placeholder: "Введіть логін",
    type: "text",
    required: true,
  },
  {
    name: "password",
    label: "Пароль",
    placeholder: "Введіть пароль",
    type: "password",
    required: true,
  },
];

export const LoginForm = () => {
  const {
    register,
    onSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useAuthForm({
    schema: loginSchema,
    apiCall: login,
    redirectTo: "/",
    successMessage: "Знов ти сюди прийшов? Іди спати вже)",
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loginFields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          type={field.type}
          required={field.required}
          error={errors[field.name as keyof LoginFormValues]?.message}
          {...register(field.name as keyof LoginFormValues)}
        />
      ))}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Завантаження..." : "Увійти"}
      </button>
    </form>
  );
};
