import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import {
  changeOrganizationLogo,
  deactivateOrganization,
  deleteOrganizationLogo,
  getOrganizationHistory,
  updateOrganization,
  uploadOrganizationLogo,
} from "@/features/organization/api/organizationApi";
import {
  MAX_ORGANIZATION_LOGO_SIZE_BYTES,
  ORGANIZATION_LOGO_TYPES,
} from "@/features/organization/model/organizationSchema";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { OrganizationLogo } from "@/features/organization/ui/OrganizationLogo";
import type {
  CreatedOrganization,
  OrganizationHistory,
  OrganizationPreview,
} from "@/features/organization/model/types";
import { ApiError } from "@/shared/api/httpClient";
import { notify } from "@/shared/lib/notify";
import { History, ImageUp, Loader2, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export const OrganizationSettingsPage = () => {
  const { organizationId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(selectUser);
  const { items, details, load, select, addCreated, updateDetails } = useOrganizationStore();
  const stateOrganization = (
    location.state as {
      organization?: OrganizationPreview & Partial<CreatedOrganization>;
    } | null
  )?.organization;
  const organization =
    details[organizationId] ??
    stateOrganization ??
    items.find((item) => item.id === organizationId);
  const [history, setHistory] = useState<OrganizationHistory | null>(null);
  const [busy, setBusy] = useState(false);
  const [isLogoBusy, setIsLogoBusy] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.email && !organization) void load(user.email).catch(() => undefined);
  }, [load, organization, user?.email]);
  if (!organization)
    return (
      <div className="mx-auto w-full max-w-4xl p-8">
        <p>Компанію не знайдено або вона недоступна.</p>
        <Button asChild variant="link">
          <Link to="/account/organizations">До списку компаній</Link>
        </Button>
      </div>
    );
  const preview = items.find((item) => item.id === organizationId);
  if (preview && !preview.isOwner)
    return (
      <div className="mx-auto w-full max-w-4xl p-8">
        <p>Налаштування доступні лише власнику компанії.</p>
        <Button asChild variant="link">
          <Link to="/account/organizations">До списку компаній</Link>
        </Button>
      </div>
    );

  const refresh = async () => {
    if (user?.email) await load(user.email);
  };
  const onUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const displayName = String(form.get("displayName") ?? "").trim();
      const legalName = String(form.get("legalName") ?? "").trim();
      const taxId = String(form.get("taxId") ?? "").trim();
      const changes = {
        organisationId: organization.id,
        ...(displayName !== organization.displayName && { displayName }),
        ...(legalName && { legalName }),
        ...(taxId && { taxId }),
      };
      if (Object.keys(changes).length === 1) {
        notify.info("Немає змін для збереження");
        return;
      }
      const updated = await updateOrganization(changes);
      addCreated({ ...updated, logoUrl: organization.logoUrl });
      await refresh();
      notify.success("Дані компанії оновлено");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося оновити компанію");
    } finally {
      setBusy(false);
    }
  };
  const onLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      file.size === 0 ||
      file.size > MAX_ORGANIZATION_LOGO_SIZE_BYTES ||
      !ORGANIZATION_LOGO_TYPES.includes(file.type)
    ) {
      notify.warning("Оберіть PNG, JPG або WebP розміром до 5 МБ");
      event.target.value = "";
      return;
    }
    setIsLogoBusy(true);
    try {
      const updatedLogo = organization.logoUrl
        ? await changeOrganizationLogo(organization.id, file)
        : await uploadOrganizationLogo(organization.id, file);
      updateDetails(organization.id, { logoUrl: updatedLogo.logoUrl });
      await refresh();
      notify.success("Логотип оновлено");
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "ORGANISATION_LOGO_ALREADY_EXISTS")
        await refresh();
      notify.error(error instanceof Error ? error.message : "Не вдалося оновити логотип");
    } finally {
      setIsLogoBusy(false);
      event.target.value = "";
    }
  };
  const deactivate = async () => {
    setBusy(true);
    try {
      await deactivateOrganization(organization.id);
      select(null);
      await refresh();
      notify.success("Компанію деактивовано");
      navigate("/account/organizations");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося деактивувати компанію");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Налаштування компанії</h1>
        <p className="mt-1 text-muted-foreground">
          Коротка адреса /{organization.slug} створює унікальне посилання на компанію і не може бути
          змінена.
        </p>
      </div>
      <Tabs defaultValue="general" className="gap-5">
        <div className="overflow-x-auto pb-1">
          <TabsList variant="line">
            <TabsTrigger value="general">Основні дані</TabsTrigger>
            <TabsTrigger value="history">Історія</TabsTrigger>
            <TabsTrigger value="status">Статус компанії</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="general">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Логотип</CardTitle>
                <CardDescription>
                  Зображення, яке представляє компанію в робочому просторі.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <div className="flex size-20 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                    <OrganizationLogo
                      logoUrl={organization.logoUrl}
                      name={organization.displayName}
                      iconClassName="size-8 text-muted-foreground"
                    />
                  </div>
                  {isLogoBusy && (
                    <div
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60"
                      role="status"
                      aria-label="Оновлення логотипа"
                    >
                      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    className="sr-only"
                    accept={ORGANIZATION_LOGO_TYPES.join(",")}
                    aria-label="Оберіть новий логотип"
                    onChange={onLogo}
                    disabled={isLogoBusy}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLogoBusy}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {isLogoBusy ? <Loader2 className="animate-spin" /> : <ImageUp />}
                      {isLogoBusy ? "Завантаження…" : "Змінити логотип"}
                    </Button>
                    {organization.logoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLogoBusy}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setIsLogoBusy(true);
                          void deleteOrganizationLogo(organization.id)
                            .then((result) =>
                              updateDetails(organization.id, { logoUrl: result.logoUrl }),
                            )
                            .then(refresh)
                            .then(() => notify.success("Логотип видалено"))
                            .catch((error: unknown) =>
                              notify.error(
                                error instanceof Error
                                  ? error.message
                                  : "Не вдалося видалити логотип",
                              ),
                            )
                            .finally(() => setIsLogoBusy(false));
                        }}
                      >
                        <Trash2 />
                        Видалити
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Оберіть PNG, JPG або WebP. Максимальний розмір — 5 МБ.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Основні дані</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={onUpdate}>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Назва</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      defaultValue={organization.displayName}
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Юридична назва</Label>
                    <Input
                      id="legalName"
                      name="legalName"
                      defaultValue={
                        "legalName" in organization ? (organization.legalName ?? "") : ""
                      }
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Податковий номер</Label>
                    <Input
                      id="taxId"
                      name="taxId"
                      defaultValue={"taxId" in organization ? (organization.taxId ?? "") : ""}
                      maxLength={100}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button disabled={busy}>
                      {busy && <LoaderCircle className="animate-spin" />}Зберегти
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Історія змін</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() =>
                  void getOrganizationHistory(organization.id)
                    .then(setHistory)
                    .catch((error: unknown) =>
                      notify.error(
                        error instanceof Error ? error.message : "Не вдалося завантажити історію",
                      ),
                    )
                }
              >
                <History />
                {history ? "Оновити" : "Завантажити історію"}
              </Button>
              {history && (
                <div className="mt-4 space-y-3">
                  {history.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Історія порожня.</p>
                  ) : (
                    history.items.map((entry) => (
                      <div key={entry.id} className="rounded-lg border p-3 text-sm">
                        <strong>{entry.action}</strong>
                        <span className="ml-2 text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString("uk-UA")}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status">
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle>Статус компанії</CardTitle>
              <CardDescription>
                Деактивація приховає компанію з активного списку та зупинить доступ до її робочого
                простору.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Деактивувати компанію</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Деактивувати «{organization.displayName}»?</DialogTitle>
                    <DialogDescription>
                      Компанія зникне з активного списку. Відновлення через користувацький API поки
                      недоступне.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" disabled={busy} onClick={() => void deactivate()}>
                      Так, деактивувати
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default OrganizationSettingsPage;
