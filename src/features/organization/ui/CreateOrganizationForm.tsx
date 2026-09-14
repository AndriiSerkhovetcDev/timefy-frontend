import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ApiError } from "@/shared/api/httpClient";
import { notify } from "@/shared/lib/notify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Check, CircleHelp, ImageUp, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  checkOrganizationSlug,
  createOrganization,
  getMyOrganizations,
} from "../api/organizationApi";
import {
  MAX_ORGANIZATION_LOGO_SIZE_BYTES,
  ORGANIZATION_LOGO_TYPES,
  organizationSchema,
  type OrganizationFormInput,
  type OrganizationFormValues,
} from "../model/organizationSchema";
import { useOrganizationStore } from "../model/organizationStore";
import { ORGANIZATION_TYPE_OPTIONS } from "../model/types";

export const CreateOrganizationForm = () => {
  const navigate = useNavigate();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [slugState, setSlugState] = useState<{
    checking: boolean;
    available?: boolean;
    suggestions: string[];
  }>({ checking: false, suggestions: [] });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormInput, unknown, OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      logo: null,
      displayName: "",
      slug: "",
      organisationType: undefined,
      legalName: "",
      taxId: "",
    },
  });
  const logo = watch("logo");
  const displayName = watch("displayName");
  const slug = watch("slug");
  const organisationType = watch("organisationType");

  useEffect(() => {
    if (!logo) {
      setLogoPreviewUrl(null);
      return;
    }
    const previewUrl = URL.createObjectURL(logo);
    setLogoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logo]);

  useEffect(() => {
    if (slug.length < 3 || !/^[a-z0-9-]+$/.test(slug)) {
      setSlugState({ checking: false, suggestions: [] });
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      setSlugState((state) => ({ ...state, checking: true }));
      try {
        const result = await checkOrganizationSlug({ slug });
        if (!active) return;
        setSlugState({
          checking: false,
          available: result.available,
          suggestions: result.suggestions,
        });
        if (!result.available)
          setError("slug", {
            message:
              result.reason === "SLUG_RESERVED"
                ? "Цю адресу зарезервовано"
                : "Ця адреса вже зайнята",
          });
        else clearErrors("slug");
      } catch {
        if (active) setSlugState({ checking: false, suggestions: [] });
      }
    }, 400);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [clearErrors, setError, slug]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (
      file &&
      (!ORGANIZATION_LOGO_TYPES.includes(file.type) || file.size > MAX_ORGANIZATION_LOGO_SIZE_BYTES)
    ) {
      notify.warning("Оберіть PNG, JPG або WebP розміром до 5 МБ");
      event.target.value = "";
      return;
    }
    setValue("logo", file, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: OrganizationFormValues) => {
    if (slugState.available === false) return;
    try {
      const organization = await createOrganization({ ...values, file: values.logo });
      useOrganizationStore.getState().addCreated(organization);
      notify.success("Компанію створено");
      navigate(`/organizations/${organization.id}`);
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "ORGANISATION_SLUG_CONFLICT") {
        setError("slug", { message: "Цю адресу щойно зайняли. Оберіть інший варіант" });
        const result = await checkOrganizationSlug({ slug: values.slug }).catch(() => null);
        setSlugState({ checking: false, available: false, suggestions: result?.suggestions ?? [] });
        return;
      }
      if (
        values.logo &&
        (error instanceof TypeError || (error instanceof ApiError && error.status >= 500))
      ) {
        const existing = (await getMyOrganizations().catch(() => [])).find(
          (item) => item.slug === values.slug,
        );
        if (existing) {
          useOrganizationStore.getState().select(existing.id);
          notify.warning(
            existing.logoUrl
              ? "Компанію створено"
              : "Компанію створено без логотипа. Завантажте його ще раз у налаштуваннях.",
          );
          navigate(`/organizations/${existing.id}`);
          return;
        }
      }
      notify.error(error instanceof Error ? error.message : "Не вдалося створити компанію");
    }
  };

  const generateAddress = async () => {
    if (!displayName.trim()) {
      setError("displayName", { message: "Спочатку введіть назву компанії" });
      return;
    }
    setSlugState((state) => ({ ...state, checking: true }));
    try {
      const result = await checkOrganizationSlug({ displayName: displayName.trim() });
      setValue("slug", result.slug, { shouldDirty: true, shouldValidate: true });
      setSlugState({
        checking: false,
        available: result.available,
        suggestions: result.suggestions,
      });
    } catch (error) {
      setSlugState({ checking: false, suggestions: [] });
      notify.error(error instanceof Error ? error.message : "Не вдалося сформувати адресу");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className="space-y-3" aria-labelledby="organization-logo-label">
        <div>
          <Label id="organization-logo-label">Логотип компанії</Label>
          <p className="mt-1 text-sm text-muted-foreground">PNG, JPG або WebP, максимум 5 МБ.</p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                alt="Попередній перегляд логотипа"
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-10 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <input
              ref={logoInputRef}
              type="file"
              accept={ORGANIZATION_LOGO_TYPES.join(",")}
              className="sr-only"
              onChange={handleLogoChange}
            />
            <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()}>
              <ImageUp aria-hidden="true" />
              {logo ? "Змінити" : "Додати логотип"}
            </Button>
            {logo && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setValue("logo", null);
                  if (logoInputRef.current) logoInputRef.current.value = "";
                }}
              >
                <Trash2 aria-hidden="true" />
                Прибрати
              </Button>
            )}
          </div>
        </div>
        {errors.logo && <p className="text-xs text-destructive">{errors.logo.message}</p>}
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Назва компанії"
          id="organization-display-name"
          error={errors.displayName?.message}
        >
          <Input
            id="organization-display-name"
            autoComplete="organization"
            {...register("displayName")}
          />
        </Field>
        <Field
          label={
            <span className="inline-flex items-center gap-1.5">
              Коротка адреса компанії
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Навіщо потрібна коротка адреса компанії"
                    >
                      <CircleHelp className="size-4" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" sideOffset={6}>
                    Це унікальна частина посилання на вашу компанію. Вона пишеться малими
                    латинськими літерами, цифрами та дефісами й після створення не змінюється.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          }
          id="organization-slug"
          error={errors.slug?.message}
        >
          <div className="relative">
            <Input
              id="organization-slug"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="napryklad-moya-organizatsiya"
              {...register("slug")}
            />
            {slugState.checking ? (
              <LoaderCircle className="absolute right-3 top-2.5 size-4 animate-spin" />
            ) : slugState.available ? (
              <Check className="absolute right-3 top-2.5 size-4 text-emerald-600" />
            ) : null}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-2 w-fit"
            disabled={slugState.checking}
            onClick={() => void generateAddress()}
          >
            Сформувати з назви
          </Button>
          {slugState.suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {slugState.suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setValue("slug", suggestion, { shouldDirty: true, shouldValidate: true })
                  }
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </Field>
        <div className="space-y-2 sm:col-span-2">
          <Label>Тип компанії</Label>
          <Controller
            control={control}
            name="organisationType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Оберіть тип компанії" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.organisationType && (
            <p className="text-xs text-destructive">{errors.organisationType.message}</p>
          )}
        </div>
        {organisationType && (
          <>
            <Field
              label="Юридична назва"
              id="organization-legal-name"
              error={errors.legalName?.message}
            >
              <Input id="organization-legal-name" {...register("legalName")} />
            </Field>
            <Field label="Податковий номер" id="organization-tax-id" error={errors.taxId?.message}>
              <Input id="organization-tax-id" {...register("taxId")} />
            </Field>
          </>
        )}
      </div>
      <div className="flex justify-end border-t pt-6">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting || slugState.checking || slugState.available === false}
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}Створити компанію
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  id,
  error,
  children,
}: {
  label: ReactNode;
  id: string;
  error?: string;
  children: ReactNode;
}) => (
  <div className="min-w-0 space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);
