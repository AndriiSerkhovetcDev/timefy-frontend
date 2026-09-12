import { registerSchema, type RegisterFormValues } from "../model/shemas";
import { checkIsExists, registration } from "@/shared/api/authApi";
import { FormField, PhoneField } from "@/shared/ui";
import { useAuthForm } from "../model/useAuthForm";

export const registerFields = [
  {
    name: "login",
    label: "Логін",
    placeholder: "Введіть логін",
    type: "text",
    required: true,
    checkExists: true,
  },
  {
    name: "email",
    label: "Електронна адреса",
    placeholder: "Введіть електронну адресу",
    type: "email",
    required: true,
    checkExists: true,
  },
  {
    name: "phone",
    label: "Номер телефону",
    placeholder: "Введіть номер телефону",
    type: "tel",
    required: true,
    checkExists: true,
  },
  {
    name: "password",
    label: "Пароль",
    placeholder: "Введіть пароль",
    type: "password",
    required: true,
    checkExists: false,
  },
  {
    name: "confirm_password",
    label: "Повторіть пароль",
    placeholder: "Введіть пароль ще раз",
    type: "password",
    required: true,
    checkExists: false,
  },
] as const;

export const fieldKeyMap = {
  login: "checkLogin",
  email: "checkEmail",
  phone: "checkPhone",
} as const;

export const RegisterForm = () => {
  const {
    register,
    control,
    onSubmit,
    formState: { errors, isValid, isSubmitting },
    getValues,
    setError,
    watch,
  } = useAuthForm({
    schema: registerSchema,
    apiCall: ({ confirm_password, ...rest }) => registration(rest),
    redirectTo: "/",
    checkEmailVerified: true,
    successMessage: "Акаунт створено!",
  });

  const handleExistsBlur = async (field: "login" | "email" | "phone") => {
    let value = getValues(field);
    if (!value) return;

    if (field === "phone") {
      value = "+" + value.replace(/\D/g, "");
    }

    try {
      const res = await checkIsExists(field, value);
      const { data } = res;

      if (!data[fieldKeyMap[field]]) {
        setError(field, { message: `Це значення вже зайняте` });
      }
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {registerFields.map((field) => {
        const { onBlur: rhfOnBlur, ...restRegister } = register(
          field.name as keyof RegisterFormValues,
        );

        return field.type === "tel" ? (
          <PhoneField
            key={field.name}
            control={control}
            name={field.name}
            label={field.label}
            required={field.required}
            inputClassName="h-12 rounded-lg bg-bg-surface px-4 shadow-sm md:text-base"
            error={errors[field.name as keyof RegisterFormValues]?.message}
            onBlur={field.checkExists ? () => handleExistsBlur(field.name as "phone") : undefined}
          />
        ) : (
          <FormField
            key={field.name}
            {...restRegister}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
            inputClassName="h-12 bg-bg-surface shadow-sm"
            watchValue={field.name === "password" ? watch("password") : undefined}
            showPasswordFeedback={field.name === "password"}
            required={field.required}
            error={errors[field.name as keyof RegisterFormValues]?.message}
            onBlur={(e) => {
              rhfOnBlur(e);
              if (field.checkExists) {
                handleExistsBlur(field.name as "login" | "email");
              }
            }}
          />
        );
      })}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="mt-2 h-12 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Завантаження..." : "Зареєструватись"}
      </button>
    </form>
  );
};
