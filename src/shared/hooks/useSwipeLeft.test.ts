import { describe, expect, it } from "vitest";
import { isLeftSwipe } from "./useSwipeLeft";

describe("isLeftSwipe", () => {
  it("accepts a deliberate horizontal swipe to the left", () => {
    expect(isLeftSwipe({ x: 240, y: 120 }, { x: 140, y: 130 })).toBe(true);
  });

  it("ignores a short left movement", () => {
    expect(isLeftSwipe({ x: 240, y: 120 }, { x: 190, y: 120 })).toBe(false);
  });

  it("ignores vertical scrolling with a small horizontal offset", () => {
    expect(isLeftSwipe({ x: 240, y: 120 }, { x: 170, y: 240 })).toBe(false);
  });

  it("ignores a swipe to the right", () => {
    expect(isLeftSwipe({ x: 140, y: 120 }, { x: 240, y: 120 })).toBe(false);
  });
});
