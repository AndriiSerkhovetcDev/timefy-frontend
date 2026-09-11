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
import { resendVerifyEmail } from "@/shared/api/authApi";
import { ApiError, versionApiAssetUrl } from "@/shared/api/httpClient";
import { changeAvatar, deleteAvatar, updateProfile, uploadAvatar } from "@/shared/api/userApi";
import { notify } from "@/shared/lib/notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, KeyRound, Loader2, MailCheck, MailWarning, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export const PersonalDataPage = () => {
  const user = useAuthStore(selectUser);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [emailRequiresAuthMethod, setEmailRequiresAuthMethod] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      phone: user.phone ?? "",
    });
  }, [user, reset]);

  if (!user) return <AccountPageSkeleton />;
  const isAvatarPending = isUploadingAvatar || isDeletingAvatar;

  const handleProfileSubmit = async (values: ProfileValues) => {
    try {
      const response = await updateProfile(values);
      const updatedUser = response.data.user;

      if (didEmailChange(user.email, updatedUser.email)) {
        logout();
        navigate("/login", { replace: true, state: { reason: "EMAIL_CHANGED" } });
        notify.success("Email змінено. Увійдіть повторно та підтвердьте нову адресу.");
        return;
      }

      setEmailRequiresAuthMethod(false);
      setUser(updatedUser);
      notify.success(response.message || "Дані профілю оновлено");
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "EMAIL_CHANGE_REQUIRES_AUTH_METHOD") {
        setEmailRequiresAuthMethod(true);
        notify.warning("Перед зміною email потрібно налаштувати спосіб входу");
        return;
      }
      notify.error(error instanceof Error ? error.message : "Не вдалося оновити дані профілю");
    }
  };

  const handleResend = async () => {
    if (isResending || cooldown > 0) return;
    setIsResending(true);
    try {
      await resendVerifyEmail({ login: user.login });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      notify.success("Лист для підтвердження email надіслано повторно");
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        notify.warning("Забагато запитів. Спробуйте повторити пізніше.");
      } else {
        notify.error("Не вдалося надіслати лист. Спробуйте ще раз.");
      }
    } finally {
      setIsResending(false);
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
      const avatar = response.data.avatar ?? user.avatar;
      setUser({
        ...user,
        ...response.data,
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
      setUser({ ...user, ...response.data, avatar: null });
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
            <div className="min-w-0 space-y-2">
              <div className="flex min-h-6 items-center">
                <Label htmlFor="phone">Номер телефону</Label>
              </div>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex min-h-6 items-center justify-between gap-2">
                <Label htmlFor="email">Email</Label>
                <EmailStatus verified={user.emailVerified} />
              </div>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            {!user.emailVerified && (
              <Alert className="sm:col-span-2">
                <MailWarning aria-hidden="true" />
                <AlertTitle>Підтвердіть email</AlertTitle>
                <AlertDescription className="min-w-0">
                  Ми надішлемо на вказану адресу лист із посиланням для підтвердження.
                </AlertDescription>
                <div className="col-span-full mt-3 w-full min-w-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={isResending || cooldown > 0}
                    className="h-auto w-full whitespace-normal sm:h-9 sm:whitespace-nowrap"
                  >
                    {isResending ? <Loader2 className="animate-spin" /> : <MailCheck />}
                    {cooldown > 0
                      ? `Повторити через ${cooldown} с`
                      : "Надіслати лист для підтвердження"}
                  </Button>
                </div>
              </Alert>
            )}
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
    </div>
  );
};

export default PersonalDataPage;
