import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployeeInvitation, revokeEmployeeInvitation } from "../api/organizationApi";
import type { CreatedInvitation } from "../model/types";
import { notify } from "@/shared/lib/notify";
import { Check, Copy, Link2, LoaderCircle, Share2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type InvitationForm = { position: string; isBookable: boolean };

export const EmployeeInvitationCard = ({ organisationId }: { organisationId: string }) => {
  const [invitation, setInvitation] = useState<CreatedInvitation | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InvitationForm>({
    defaultValues: { position: "", isBookable: true },
  });
  const inviteUrl = invitation
    ? new URL(invitation.invitePath, window.location.origin).toString()
    : "";

  const createInvitation = async (values: InvitationForm) => {
    try {
      setInvitation(
        await createEmployeeInvitation({
          organisationId,
          position: values.position.trim() || null,
          isBookable: values.isBookable,
        }),
      );
      notify.success("Запрошення створено");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося створити запрошення");
    }
  };

  const copyInvitation = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    notify.success("Посилання скопійовано");
  };

  const shareInvitation = async () => {
    if (!navigator.share) return copyInvitation();
    await navigator.share({ title: "Запрошення до Timefy", url: inviteUrl });
  };

  const revokeInvitation = async () => {
    if (!invitation) return;
    setIsRevoking(true);
    try {
      await revokeEmployeeInvitation(organisationId, invitation.invitationId);
      setInvitation(null);
      notify.success("Запрошення відкликано");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Не вдалося відкликати запрошення");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus aria-hidden="true" />
          Запросити працівника
        </CardTitle>
        <CardDescription>Створіть одноразове посилання, дійсне протягом 7 днів.</CardDescription>
      </CardHeader>
      <CardContent>
        {invitation ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-medium text-success">
                <Check className="size-4" />
                Посилання готове
              </div>
              <p className="mt-2 break-all text-sm text-muted-foreground">{inviteUrl}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Дійсне до {new Date(invitation.expiresAt).toLocaleString("uk-UA")}. Його зможе
                використати одна людина.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" onClick={() => void copyInvitation()}>
                <Copy />
                Копіювати посилання
              </Button>
              <Button type="button" variant="outline" onClick={() => void shareInvitation()}>
                <Share2 />
                Поділитися
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isRevoking}
                onClick={() => void revokeInvitation()}
              >
                <X />
                Відкликати
              </Button>
            </div>
          </div>
        ) : (
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(createInvitation)}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employee-position">Посада</Label>
              <Input
                id="employee-position"
                maxLength={200}
                placeholder="Наприклад, адміністратор"
                {...register("position")}
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                {...register("isBookable")}
              />
              Доступний для онлайн-запису
            </label>
            <div className="flex justify-end">
              <Button disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Link2 />}Створити
                запрошення
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
