import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrganizationEmployees } from "@/features/organization/api/organizationApi";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import type {
  Employee,
  EmployeeList,
  EmployeeListRequest,
} from "@/features/organization/model/types";
import { EmployeeInvitationCard } from "@/features/organization/ui/EmployeeInvitationCard";
import { ApiError } from "@/shared/api/httpClient";
import { ChevronLeft, ChevronRight, Search, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const PAGE_SIZE = 25;
type BooleanFilter = "all" | "true" | "false";
const emptyResult: EmployeeList = {
  items: [],
  pagination: { page: 1, limit: PAGE_SIZE, total: 0, pages: 0 },
};

export const OrganizationTeamPage = () => {
  const { organizationId = "" } = useParams();
  const { items: organizations, details } = useOrganizationStore();
  const preview = organizations.find((item) => item.id === organizationId);
  const isOwner = preview?.isOwner ?? Boolean(details[organizationId]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [position, setPosition] = useState("");
  const [active, setActive] = useState<BooleanFilter>("all");
  const [bookable, setBookable] = useState<BooleanFilter>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<EmployeeList>(emptyResult);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadEmployees = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      const filters: EmployeeListRequest["filters"] = {
        login: "",
        email: "",
        phone: "",
        position: position.trim(),
        ...(bookable !== "all" && { isBookable: bookable === "true" }),
        ...(active !== "all" && { memberIsActive: active === "true" }),
      };

      try {
        const data = await getOrganizationEmployees(
          {
            organisationId: organizationId,
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
            filters,
            sort: { field: "createdAt", order: sortOrder },
          },
          signal,
        );
        if (!signal.aborted) setResult(data);
      } catch (requestError) {
        if (signal.aborted) return;
        if (requestError instanceof ApiError) {
          if (requestError.status === 404 && requestError.errorCode === "ORGANISATION_NOT_FOUND") {
            setError(
              "Компанію не знайдено. Можливо, її було видалено або у вас більше немає доступу.",
            );
          } else if (
            requestError.status === 409 &&
            requestError.errorCode === "ORGANISATION_INACTIVE"
          ) {
            setError("Компанія деактивована. Список працівників зараз недоступний.");
          } else {
            setError(requestError.message);
          }
        } else {
          setError("Не вдалося завантажити працівників. Перевірте з’єднання та спробуйте ще раз.");
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    },
    [active, bookable, debouncedSearch, organizationId, page, position, sortOrder],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadEmployees(controller.signal);
    return () => controller.abort();
  }, [loadEmployees, reloadKey]);

  if (!isOwner) return <Navigate to={`/organizations/${organizationId}`} replace />;

  const hasFilters = Boolean(
    debouncedSearch || position.trim() || active !== "all" || bookable !== "all",
  );
  const pages = Math.max(1, result.pagination.pages);
  const changeFilter = (setter: (value: BooleanFilter) => void, value: BooleanFilter) => {
    setPage(1);
    setter(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Команда</h1>
          <p className="mt-2 text-muted-foreground">
            Переглядайте працівників і керуйте запрошеннями до компанії.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="min-h-10 w-full shrink-0 sm:w-auto">
              <UserPlus aria-hidden="true" />
              Додати працівника
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Додати працівника</DialogTitle>
              <DialogDescription>
                Створіть одноразове посилання-запрошення, дійсне протягом 7 днів.
              </DialogDescription>
            </DialogHeader>
            <EmployeeInvitationCard organisationId={organizationId} embedded />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="gap-4 overflow-hidden py-0">
        <CardHeader className="gap-4 border-b py-5">
          <div>
            <CardTitle>Працівники</CardTitle>
            <CardDescription className="mt-1">
              {isLoading ? "Оновлюємо список…" : `Усього: ${result.pagination.total}`}
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_minmax(10rem,0.6fr)_auto_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">Пошук працівників</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-10 pl-9"
                placeholder="Пошук за ім’ям або контактами"
              />
            </label>
            <label className="min-w-0">
              <span className="sr-only">Фільтр за посадою</span>
              <Input
                value={position}
                onChange={(event) => {
                  setPage(1);
                  setPosition(event.target.value);
                }}
                className="min-h-10"
                placeholder="Посада"
              />
            </label>
            <Select
              value={active}
              onValueChange={(value) => changeFilter(setActive, value as BooleanFilter)}
            >
              <SelectTrigger className="min-h-10 w-full" aria-label="Статус працівника">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Усі статуси</SelectItem>
                <SelectItem value="true">Активні</SelectItem>
                <SelectItem value="false">Неактивні</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={bookable}
              onValueChange={(value) => changeFilter(setBookable, value as BooleanFilter)}
            >
              <SelectTrigger className="min-h-10 w-full" aria-label="Доступність для бронювання">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Будь-яке бронювання</SelectItem>
                <SelectItem value="true">Доступні</SelectItem>
                <SelectItem value="false">Недоступні</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                setPage(1);
                setSortOrder(value as "asc" | "desc");
              }}
            >
              <SelectTrigger className="min-h-10 w-full" aria-label="Сортування за датою додавання">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Спочатку нові</SelectItem>
                <SelectItem value="asc">Спочатку старі</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {isLoading ? (
          <EmployeeListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />
        ) : result.items.length === 0 ? (
          <EmptyState filtered={hasFilters} />
        ) : (
          <>
            <EmployeeTable employees={result.items} />
            <EmployeeCards employees={result.items} />
            <Pagination
              page={result.pagination.page}
              pages={pages}
              total={result.pagination.total}
              onChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
};

const EmployeeTable = ({ employees }: { employees: Employee[] }) => (
  <div className="hidden overflow-x-auto lg:block">
    <table className="w-full table-fixed border-collapse text-left text-sm">
      <caption className="sr-only">Список працівників компанії</caption>
      <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
        <tr>
          <th scope="col" className="w-[16%] px-5 py-3 font-medium">
            Працівник
          </th>
          <th scope="col" className="w-[19%] px-5 py-3 font-medium">
            Email
          </th>
          <th scope="col" className="w-[14%] px-5 py-3 font-medium">
            Телефон
          </th>
          <th scope="col" className="w-[14%] px-5 py-3 font-medium">
            Посада
          </th>
          <th scope="col" className="w-[16%] px-5 py-3 font-medium">
            Бронювання
          </th>
          <th scope="col" className="w-[11%] px-5 py-3 font-medium">
            Статус
          </th>
          <th scope="col" className="w-[10%] px-5 py-3 font-medium">
            Додано
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {employees.map((employee) => (
          <tr key={employee.memberId} className="transition-colors hover:bg-muted/30">
            <td className="break-words px-5 py-4 font-medium">{employee.login || "Без імені"}</td>
            <td className="break-all px-5 py-4 text-muted-foreground">{employee.email || "—"}</td>
            <td className="break-words px-5 py-4 text-muted-foreground">{employee.phone || "—"}</td>
            <td className="break-words px-5 py-4">{employee.position || "Не вказано"}</td>
            <td className="px-5 py-4">
              <BookableBadge value={employee.isBookable} />
            </td>
            <td className="px-5 py-4">
              <ActiveBadge value={employee.memberIsActive} />
            </td>
            <td className="px-5 py-4 text-muted-foreground">{formatDate(employee.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EmployeeCards = ({ employees }: { employees: Employee[] }) => (
  <div className="grid gap-3 p-4 lg:hidden">
    {employees.map((employee) => (
      <article
        key={employee.memberId}
        className="min-w-0 rounded-xl border bg-background p-4 shadow-xs"
      >
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="break-words font-semibold">{employee.login || "Без імені"}</h3>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {employee.position || "Посаду не вказано"}
            </p>
          </div>
          <ActiveBadge value={employee.memberIsActive} />
        </div>
        <dl className="mt-4 grid min-w-0 gap-3 text-sm sm:grid-cols-2">
          <Contact label="Email" value={employee.email || "—"} breakAll />
          <Contact label="Телефон" value={employee.phone || "—"} />
          <div className="min-w-0 sm:col-span-2">
            <dt className="mb-1 text-xs text-muted-foreground">Онлайн-запис</dt>
            <dd>
              <BookableBadge value={employee.isBookable} />
            </dd>
          </div>
        </dl>
      </article>
    ))}
  </div>
);

const Contact = ({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) => (
  <div className="min-w-0">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className={breakAll ? "mt-1 break-all" : "mt-1 break-words"}>{value}</dd>
  </div>
);
const ActiveBadge = ({ value }: { value: boolean }) => (
  <Badge
    variant="outline"
    className={
      value
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "text-muted-foreground"
    }
  >
    {value ? "Активний" : "Неактивний"}
  </Badge>
);
const BookableBadge = ({ value }: { value: boolean }) => (
  <Badge
    variant={value ? "secondary" : "outline"}
    className="max-w-full whitespace-normal text-center"
  >
    {value ? "Доступний для бронювання" : "Недоступний"}
  </Badge>
);

const Pagination = ({
  page,
  pages,
  total,
  onChange,
}: {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
}) => (
  <nav
    className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row"
    aria-label="Пагінація працівників"
  >
    <p className="text-sm text-muted-foreground">
      Сторінка {page} з {pages} · {total} працівників
    </p>
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="min-h-10"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
        Попередня
      </Button>
      <Button
        variant="outline"
        className="min-h-10"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Наступна
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  </nav>
);

const EmployeeListSkeleton = () => (
  <div className="space-y-3 p-4" aria-label="Завантаження працівників" aria-busy="true">
    {[1, 2, 3].map((item) => (
      <Skeleton key={item} className="h-24 w-full rounded-xl lg:h-14" />
    ))}
  </div>
);
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <CardContent className="py-10 text-center" role="alert">
    <p className="text-sm text-destructive">{message}</p>
    <Button type="button" variant="outline" className="mt-4 min-h-10" onClick={onRetry}>
      Спробувати ще раз
    </Button>
  </CardContent>
);
const EmptyState = ({ filtered }: { filtered: boolean }) => (
  <CardContent className="py-12 text-center">
    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
      <Users className="size-5" aria-hidden="true" />
    </div>
    <h2 className="mt-4 font-semibold">
      {filtered ? "Нічого не знайдено" : "У компанії ще немає працівників"}
    </h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
      {filtered
        ? "Змініть пошуковий запит або фільтри й спробуйте ще раз."
        : "Додайте першого працівника за допомогою одноразового запрошення."}
    </p>
  </CardContent>
);
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("uk-UA", { dateStyle: "medium" }).format(date);
};

export default OrganizationTeamPage;
