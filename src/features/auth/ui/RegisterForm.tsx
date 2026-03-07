import { registerSchema, type RegisterFormValues } from "../model/shemas";
import { checkLoginExists, registration } from "@/shared/api/authApi";
import { FormField, PhoneField } from "@/shared/ui";
import { useAuthForm } from "../model/useAuthForm";

export const registerFields = [
  {
    name: "login",
    label: "Логін",
    placeholder: "Введіть логін",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Електронна адреса",
    placeholder: "Введіть електронну адресу",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Номер телефону",
    placeholder: "Введіть номер телефону",
    type: "tel",
    required: true,
  },
  {
    name: "password",
    label: "Пароль",
    placeholder: "Введіть пароль",
    type: "password",
    required: true,
  },
  {
    name: "confirm_password",
    label: "Повторіть пароль",
    placeholder: "Введіть пароль ще раз",
    type: "password",
    required: true,
  },
];

export const RegisterForm = () => {
  const {
    register,
    control,
    error,
    onSubmit,
    formState: { errors, isValid, isSubmitting },
    getValues,
    setError,
    watch,
  } = useAuthForm({
    schema: registerSchema,
    apiCall: registration,
    redirectTo: "/dashboard",
  });

  const handleLoginBlur = async () => {
    const login = getValues("login");

    if (!login) return;

    try {
      const { isAvailable } = await checkLoginExists(login);

      if (!isAvailable) {
        setError("login", { message: "Цей логін вже зайнятий" });
      }
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {registerFields.map((field) =>
        field.type === "tel" ? (
          <PhoneField
            key={field.name}
            control={control}
            name={field.name}
            label={field.label}
            required={field.required}
            error={errors[field.name as keyof RegisterFormValues]?.message}
          />
        ) : (
          <FormField
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            watchValue={field.name === "password" ? watch("password") : undefined}
            required={field.required}
            error={errors[field.name as keyof RegisterFormValues]?.message}
            {...register(field.name as keyof RegisterFormValues, {
              onBlur: field.name === "login" ? handleLoginBlur : undefined,
            })}
          />
        ),
      )}
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Завантаження..." : "Зареєструватись"}
      </button>
    </form>
  );
};
