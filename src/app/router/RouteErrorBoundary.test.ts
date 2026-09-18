import { beforeEach, describe, expect, it } from "vitest";
import { isChunkLoadError, reserveChunkReload } from "./RouteErrorBoundary";

describe("RouteErrorBoundary", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("recognizes stale dynamic import failures", () => {
    expect(
      isChunkLoadError(
        new TypeError("Failed to fetch dynamically imported module: /assets/OldPage.js"),
      ),
    ).toBe(true);
    expect(
      isChunkLoadError(
        new Error(
          'Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html".',
        ),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new Error("Regular render failure"))).toBe(false);
  });

  it("allows only one automatic reload for each deployed version", () => {
    const error = new TypeError("Failed to fetch dynamically imported module");

    expect(reserveChunkReload(error, sessionStorage, "release-a")).toBe(true);
    expect(reserveChunkReload(error, sessionStorage, "release-a")).toBe(false);
    expect(reserveChunkReload(error, sessionStorage, "release-b")).toBe(true);
  });
});
