import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  didEmailChange,
  profileSchema,
  type ProfileFormValues,
  type ProfileValues,
} from "@/features/account/model/profileSchema";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { AccountAvatar } from "@/features/account/ui/AccountAvatar";
import { AccountPageSkeleton } from "@/features/account/ui/AccountPageSkeleton";
import { EmailStatus } from "@/features/account/ui/EmailStatus";
import { CreatePasswordDialog } from "@/features/account/ui/CreatePasswordDialog";
import { VerifyEmailForm } from "@/features/verify-email";
import { checkIsExists } from "@/shared/api/authApi";
import { ApiError, versionApiAssetUrl } from "@/shared/api/httpClient";
import { changeAvatar, deleteAvatar, updateProfile, uploadAvatar } from "@/shared/api/userApi";
import { notify } from "@/shared/lib/notify";
import { normalizeEmail } from "@/shared/model/email";
import { normalizePhone } from "@/shared/model/phone";
import { cn } from "@/lib/utils";
import { PhoneField } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, KeyRound, Loader2, MailCheck, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const CONTACT_CHECK_DELAY_MS = 800;

type ContactAvailability = {
  value: string;
  available: boolean;
};

export const PersonalDataPage = () => {
  const user = useAuthStore(selectUser);
  const setUser = useAuthStore((state) => state.setUser);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [emailRequiresAuthMethod, setEmailRequiresAuthMethod] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const emailAvailabilityRef = useRef<ContactAvailability | null>(null);
  const phoneAvailabilityRef = useRef<ContactAvailability | null>(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      phone: user.phone ?? "",
    });
  }, [user, reset]);

  const email = watch("email");
  const phone = watch("phone");

  useEffect(() => {
    if (!user) return;
    const value = normalizeEmail(email);
    if (value === normalizeEmail(user.email)) return;

    clearErrors("email");
    const cachedAvailability = emailAvailabilityRef.current;
    if (cachedAvailability?.value === value) {
      if (!cachedAvailability.available) {
        setError("email", { type: "validate", message: "Цей email вже використовується" });
      }
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      if (!(await trigger("email")) || !active) return;
      try {
        const response = await checkIsExists("email", value);
        if (!active || normalizeEmail(getValues("email")) !== value) return;
        const available = response.data.checkEmail;
        emailAvailabilityRef.current = { value, available };
        if (!available) {
          setError("email", { type: "validate", message: "Цей email вже використовується" });
        }
      } catch (error) {
        if (active)
          notify.error(error instanceof Error ? error.message : "Не вдалося перевірити email");
      }
    }, CONTACT_CHECK_DELAY_MS);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [clearErrors, email, getValues, setError, trigger, user]);

  useEffect(() => {
    if (!user) return;
    const value = normalizePhone(phone);
    if (value === normalizePhone(user.phone ?? "")) return;

    clearErrors("phone");
    const cachedAvailability = phoneAvailabilityRef.current;
    if (cachedAvailability?.value === value) {
      if (!cachedAvailability.available) {
        setError("phone", { type: "validate", message: "Цей номер уже використовується" });
      }
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      if (!(await trigger("phone")) || !active) return;
      try {
        const response = await checkIsExists("phone", value);
        if (!active || normalizePhone(getValues("phone")) !== value) return;
        const available = response.data.checkPhone;
        phoneAvailabilityRef.current = { value, available };
        if (!available) {
          setError("phone", { type: "validate", message: "Цей номер уже використовується" });
        }
      } catch (error) {
        if (active)
          notify.error(error instanceof Error ? error.message : "Не вдалося перевірити телефон");
      }
    }, CONTACT_CHECK_DELAY_MS);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [clearErrors, getValues, phone, setError, trigger, user]);

  if (!user) return <AccountPageSkeleton />;
  const isAvatarPending = isUploadingAvatar || isDeletingAvatar;

  const handleProfileSubmit = async (values: ProfileValues) => {
    try {
      clearErrors(["email", "phone"]);
      const emailChanged = didEmailChange(user.email, values.email);
      const phoneChanged = normalizePhone(user.phone ?? "") !== values.phone;
      const normalizedEmail = normalizeEmail(values.email);
      const normalizedPhone = normalizePhone(values.phone);
      const cachedEmailAvailability = emailAvailabilityRef.current;
      const cachedPhoneAvailability = phoneAvailabilityRef.current;
      const [emailAvailable, phoneAvailable] = await Promise.all([
        emailChanged
          ? cachedEmailAvailability?.value === normalizedEmail
            ? cachedEmailAvailability.available
            : checkIsExists("email", normalizedEmail).then((response) => response.data.checkEmail)
          : true,
        phoneChanged
          ? cachedPhoneAvailability?.value === normalizedPhone
            ? cachedPhoneAvailability.available
            : checkIsExists("phone", normalizedPhone).then((response) => response.data.checkPhone)
          : true,
      ]);

      let hasConflict = false;
      if (!emailAvailable) {
        setError("email", { type: "validate", message: "Цей email вже використовується" });
        hasConflict = true;
      }
      if (!phoneAvailable) {
        setError("phone", { type: "validate", message: "Цей номер уже використовується" });
        hasConflict = true;
      }
      if (hasConflict) return;

      const response = await updateProfile(values);
      const updatedUser = response.data.user;

      setEmailRequiresAuthMethod(false);
      setIsVerificationCodeSent(false);
      setUser({
        ...updatedUser,
        emailVerified: emailChanged ? false : updatedUser.emailVerified,
      });
      notify.success(
        emailChanged
          ? "Email змінено. Підтвердьте нову адресу."
          : response.message || "Дані профілю оновлено",
      );
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "EMAIL_CHANGE_REQUIRES_AUTH_METHOD") {
        setEmailRequiresAuthMethod(true);
        notify.warning("Перед зміною email потрібно налаштувати спосіб входу");
        return;
      }
      notify.error(error instanceof Error ? error.message : "Не вдалося оновити дані профілю");
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isAvatarPending) return;

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      notify.warning("Розмір зображення не повинен перевищувати 5 МБ");
      event.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = user.avatar ? await changeAvatar(file) : await uploadAvatar(file);
      const updatedUser = response.data.user;
      const avatar = updatedUser.avatar ?? user.avatar;
      setUser({
        ...user,
        ...updatedUser,
        avatar: avatar ? versionApiAssetUrl(avatar) : null,
      });
      notify.success(response.message || "Аватар оновлено");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося оновити аватар");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    if (isAvatarPending) return;

    setIsDeletingAvatar(true);
    try {
      const response = await deleteAvatar();
      setUser({ ...user, ...response.data.user, avatar: null });
      setIsDeleteDialogOpen(false);
      notify.success(response.message || "Аватар видалено");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося видалити аватар");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Фото профілю</CardTitle>
          <CardDescription>Аватар, який відображається у вашому кабінеті.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <AccountAvatar
              user={user}
              className={isAvatarPending ? "size-20 opacity-50" : "size-20"}
            />
            {isAvatarPending && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-background/40"
                role="status"
                aria-label="Завантаження аватара"
              >
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              aria-label="Оберіть новий аватар"
              disabled={isAvatarPending}
              onChange={handleAvatarChange}
              className="sr-only"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isAvatarPending}
                onClick={() => avatarInputRef.current?.click()}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ImageUp aria-hidden="true" />
                )}
                {isUploadingAvatar ? "Завантаження…" : "Змінити аватар"}
              </Button>
              {user.avatar && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isAvatarPending}
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 aria-hidden="true" />
                  Видалити
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Оберіть зображення з вашого пристрою. Максимальний розмір — 5 МБ.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Видалити аватар?</DialogTitle>
            <DialogDescription>
              Поточне фото буде видалено, а замість нього відображатиметься стандартний аватар.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeletingAvatar}>
                Скасувати
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingAvatar}
              onClick={handleAvatarDelete}
            >
              {isDeletingAvatar ? <Loader2 className="animate-spin" /> : <Trash2 />}
              {isDeletingAvatar ? "Видалення…" : "Видалити аватар"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Контактні дані</CardTitle>
          <CardDescription>Оновіть контактну інформацію вашого облікового запису.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(handleProfileSubmit)}
          >
            <div className="min-w-0 space-y-2">
              <Label htmlFor="first-name">Ім’я</Label>
              <Input
                id="first-name"
                autoComplete="given-name"
                aria-invalid={Boolean(errors.firstName)}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="last-name">Прізвище</Label>
              <Input
                id="last-name"
                autoComplete="family-name"
                aria-invalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
            <PhoneField
              control={control}
              name="phone"
              label="Номер телефону"
              required
              error={errors.phone?.message}
            />
            <div className="min-w-0 space-y-2">
              <div className="flex min-h-6 items-center justify-between gap-2">
                <Label htmlFor="email">Email</Label>
                <EmailStatus verified={user.emailVerified} />
              </div>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                readOnly={user.authData?.isGoogle === true}
                className={user.authData?.isGoogle ? "cursor-not-allowed bg-muted/50" : undefined}
                aria-describedby={user.authData?.isGoogle ? "google-email-help" : undefined}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {user.authData?.isGoogle && (
                <p id="google-email-help" className="text-xs text-muted-foreground">
                  Щоб змінити email, спочатку від’єднайте Google у розділі{" "}
                  <Link to="/account/security" className="font-medium text-primary hover:underline">
                    «Безпека»
                  </Link>
                  .
                </p>
              )}
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            {emailRequiresAuthMethod && (
              <Alert className="sm:col-span-2">
                <KeyRound aria-hidden="true" />
                <AlertTitle>Спочатку створіть логін і пароль</AlertTitle>
                <AlertDescription className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="min-w-0">
                    Введений email збережено у формі. Після створення пароля повторно підтвердьте
                    зміну email кнопкою «Зберегти зміни».
                  </span>
                  {user.authData?.isWeb === false && (
                    <CreatePasswordDialog onCreated={() => setEmailRequiresAuthMethod(false)} />
                  )}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end sm:col-span-2">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Збереження…" : "Зберегти зміни"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!user.emailVerified && (
        <Card
          className={cn(
            "min-w-0 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5 shadow-sm",
            !isVerificationCodeSent && "sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
          )}
        >
          <CardHeader className={isVerificationCodeSent ? "gap-0 pb-4" : "gap-0 pb-3 sm:pb-0"}>
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MailCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle>Підтвердження email</CardTitle>
                <CardDescription className="leading-5">
                  Введіть код, надісланий на{" "}
                  <span className="break-all font-medium text-foreground">{user.email}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className={isVerificationCodeSent ? "min-w-0 pt-0" : "min-w-0 pt-0 sm:pl-0"}>
            <VerifyEmailForm
              compact
              redirectTo={null}
              onCodeRequested={() => setIsVerificationCodeSent(true)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalDataPage;
