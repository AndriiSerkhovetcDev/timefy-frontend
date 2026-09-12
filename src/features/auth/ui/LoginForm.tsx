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
    successMessage: "Успішний вхід!",
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
          inputClassName="h-12 bg-bg-surface shadow-sm"
          error={errors[field.name as keyof LoginFormValues]?.message}
          {...register(field.name as keyof LoginFormValues)}
        />
      ))}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 h-12 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Завантаження..." : "Увійти"}
      </button>
    </form>
  );
};
