import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { avatarCropConfig, clampCropOffset } from "@/features/account/model/avatarCrop";
import { notify } from "@/shared/lib/notify";
import { Loader2, RotateCcw } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type AvatarCropDialogProps = {
  file: File | null;
  isSaving: boolean;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
  onSave: (file: File) => Promise<void>;
};

const createCroppedFile = async (
  image: HTMLImageElement,
  sourceFile: File,
  viewportSize: number,
  zoom: number,
  offset: Point,
) => {
  const scale =
    Math.max(viewportSize / image.naturalWidth, viewportSize / image.naturalHeight) * zoom;
  const sourceSize = viewportSize / scale;
  const sourceX = image.naturalWidth / 2 - offset.x / scale - sourceSize / 2;
  const sourceY = image.naturalHeight / 2 - offset.y / scale - sourceSize / 2;
  const canvas = document.createElement("canvas");
  canvas.width = avatarCropConfig.outputSize;
  canvas.height = avatarCropConfig.outputSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Не вдалося підготувати зображення");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    avatarCropConfig.outputSize,
    avatarCropConfig.outputSize,
  );

  const outputType = ["image/jpeg", "image/png", "image/webp"].includes(sourceFile.type)
    ? sourceFile.type
    : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Не вдалося обрізати фото"))),
      outputType,
      0.92,
    );
  });
  const extension =
    outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";
  const baseName = sourceFile.name.replace(/\.[^.]+$/, "") || "avatar";

  return new File([blob], `${baseName}-cropped.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });
};

export const AvatarCropDialog = ({
  file,
  isSaving,
  returnFocusRef,
  onCancel,
  onSave,
}: AvatarCropDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<Size>({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState(0);
  const [zoom, setZoom] = useState<number>(avatarCropConfig.minZoom);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isImageReady, setIsImageReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ pointerId: number; start: Point; offset: Point } | null>(null);
  const isBusy = isProcessing || isSaving;

  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageSize({ width: 0, height: 0 });
    setZoom(avatarCropConfig.minZoom);
    setOffset({ x: 0, y: 0 });
    setIsImageReady(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateSize = () => setViewportSize(viewport.clientWidth);
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [file]);

  useEffect(() => {
    setOffset((current) => clampCropOffset(current, imageSize, viewportSize, zoom));
  }, [imageSize, viewportSize, zoom]);

  const resetCrop = () => {
    setZoom(avatarCropConfig.minZoom);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isImageReady || isBusy) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      offset,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset(
      clampCropOffset(
        {
          x: drag.offset.x + event.clientX - drag.start.x,
          y: drag.offset.y + event.clientY - drag.start.y,
        },
        imageSize,
        viewportSize,
        zoom,
      ),
    );
  };

  const finishDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const handleSave = async () => {
    const image = imageRef.current;
    if (!file || !image || !isImageReady || !viewportSize || isBusy) return;
    setIsProcessing(true);
    try {
      const croppedFile = await createCroppedFile(image, file, viewportSize, zoom, offset);
      await onSave(croppedFile);
    } catch {
      // The existing upload flow displays the error and keeps the crop state intact.
    } finally {
      setIsProcessing(false);
    }
  };

  const displayScale = imageSize.width
    ? Math.max(viewportSize / imageSize.width, viewportSize / imageSize.height) * zoom
    : 1;

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => !open && !isBusy && onCancel()}>
      <DialogContent
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-lg overflow-y-auto p-4 sm:p-6"
        onEscapeKeyDown={(event) => isBusy && event.preventDefault()}
        onInteractOutside={(event) => isBusy && event.preventDefault()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Обрізати фото</DialogTitle>
          <DialogDescription>
            Перетягніть фотографію та налаштуйте масштаб майбутнього аватара.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={viewportRef}
          className="relative mx-auto aspect-square w-full max-w-[360px] touch-none cursor-move overflow-hidden rounded-xl bg-muted select-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDragging}
          onPointerCancel={finishDragging}
          role="application"
          aria-label="Область обрізання фотографії"
        >
          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Попередній перегляд аватара"
              draggable={false}
              onLoad={(event) => {
                const image = event.currentTarget;
                setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
                setIsImageReady(true);
              }}
              onError={() => {
                setIsImageReady(false);
                notify.error("Не вдалося відкрити зображення. Оберіть інший файл.");
                onCancel();
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 max-w-none"
              style={{
                width: imageSize.width * displayScale,
                height: imageSize.height * displayScale,
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_49.25%,rgba(0,0,0,0.5)_50%)]" />
          <div className="pointer-events-none absolute inset-0 z-20 rounded-full border-2 border-white/90" />
          {!isImageReady && (
            <div className="absolute inset-0 z-30 flex items-center justify-center text-sm text-muted-foreground">
              Завантажуємо фото…
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="avatar-crop-zoom">Масштаб</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            id="avatar-crop-zoom"
            type="range"
            min={avatarCropConfig.minZoom}
            max={avatarCropConfig.maxZoom}
            step={avatarCropConfig.zoomStep}
            value={zoom}
            disabled={!isImageReady || isBusy}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="h-10 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Масштаб фотографії"
          />
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button type="button" variant="ghost" disabled={isBusy} onClick={resetCrop}>
            <RotateCcw aria-hidden="true" />
            Скинути
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" disabled={isBusy} onClick={onCancel}>
              Скасувати
            </Button>
            <Button type="button" disabled={!isImageReady || isBusy} onClick={handleSave}>
              {isBusy && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isBusy ? "Зберігаємо…" : "Зберегти"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
