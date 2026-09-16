import { describe, expect, it } from "vitest";
import { clampCropOffset } from "@/features/account/model/avatarCrop";

describe("clampCropOffset", () => {
  it("keeps a landscape image covering the crop viewport", () => {
    expect(clampCropOffset({ x: 500, y: 100 }, { width: 800, height: 400 }, 300, 1)).toEqual({
      x: 150,
      y: 0,
    });
  });

  it("allows more movement after zooming", () => {
    expect(clampCropOffset({ x: -500, y: 500 }, { width: 400, height: 400 }, 300, 2)).toEqual({
      x: -150,
      y: 150,
    });
  });
});
