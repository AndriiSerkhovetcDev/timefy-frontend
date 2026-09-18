import { Button } from "@/components/ui/button";
import { Component, type ErrorInfo, type ReactNode } from "react";

const appVersion = import.meta.env.VITE_APP_VERSION?.trim() || "development";
const CHUNK_RELOAD_KEY_PREFIX = "timefy:chunk-reload";
const CHUNK_ERROR_PATTERNS = [
  /ChunkLoadError/i,
  /Loading chunk .* failed/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
  /Failed to load module script/i,
  /Expected a JavaScript-or-Wasm module script/i,
];

export const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
};

export const reserveChunkReload = (
  error: unknown,
  storage: Storage = sessionStorage,
  version = appVersion,
) => {
  if (!isChunkLoadError(error)) return false;

  const key = `${CHUNK_RELOAD_KEY_PREFIX}:${version}`;
  try {
    if (storage.getItem(key)) return false;
    storage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
};

type RouteErrorBoundaryProps = {
  children: ReactNode;
};

type RouteErrorBoundaryState = {
  error: unknown | null;
};

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error("Route rendering failed", error, errorInfo);
    if (reserveChunkReload(error)) window.location.reload();
  }

  render() {
    if (!this.state.error) return this.props.children;

    const chunkError = isChunkLoadError(this.state.error);
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-4">
        <section className="w-full max-w-lg rounded-xl border bg-card p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {chunkError ? "Не вдалося завантажити оновлення" : "Щось пішло не так"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {chunkError
              ? "Версія застосунку змінилася. Оновіть сторінку, щоб завантажити актуальні файли."
              : "Оновіть сторінку. Якщо помилка повториться, спробуйте ще раз пізніше."}
          </p>
          <Button
            type="button"
            className="mt-6 w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            Оновити сторінку
          </Button>
        </section>
      </main>
    );
  }
}
