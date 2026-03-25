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
];

export const fieldKeyMap = {
  login: "checkLogin",
  email: "checkEmail",
  phone: "checkPhone",
} as const;

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
    transformValues: ({ confirm_password, ...rest }) => rest,
    checkEmailVerified: true,
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
            watchValue={field.name === "password" ? watch("password") : undefined}
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
