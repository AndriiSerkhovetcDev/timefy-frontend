const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.05;

type Point = { x: number; y: number };
type Size = { width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const avatarCropConfig = {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  zoomStep: ZOOM_STEP,
  outputSize: 512,
} as const;

export const clampCropOffset = (
  offset: Point,
  imageSize: Size,
  viewportSize: number,
  zoom: number,
): Point => {
  if (!imageSize.width || !imageSize.height || !viewportSize) return { x: 0, y: 0 };

  const scale = Math.max(viewportSize / imageSize.width, viewportSize / imageSize.height) * zoom;
  const maxX = Math.max(0, (imageSize.width * scale - viewportSize) / 2);
  const maxY = Math.max(0, (imageSize.height * scale - viewportSize) / 2);

  return {
    x: clamp(offset.x, -maxX, maxX),
    y: clamp(offset.y, -maxY, maxY),
  };
};
