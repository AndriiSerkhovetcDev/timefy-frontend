import { useRef, type TouchEventHandler } from "react";

const MIN_SWIPE_DISTANCE = 64;
const HORIZONTAL_DOMINANCE_RATIO = 1.2;

type TouchPoint = {
  x: number;
  y: number;
};

export const isLeftSwipe = (start: TouchPoint, end: TouchPoint) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  return (
    deltaX <= -MIN_SWIPE_DISTANCE &&
    Math.abs(deltaX) > Math.abs(deltaY) * HORIZONTAL_DOMINANCE_RATIO
  );
};

export const useSwipeLeft = (onSwipe: () => void) => {
  const touchStartRef = useRef<TouchPoint | null>(null);

  const onTouchStart: TouchEventHandler<HTMLElement> = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd: TouchEventHandler<HTMLElement> = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (start && touch && isLeftSwipe(start, { x: touch.clientX, y: touch.clientY })) {
      onSwipe();
    }
  };

  const onTouchCancel: TouchEventHandler<HTMLElement> = () => {
    touchStartRef.current = null;
  };

  return { onTouchStart, onTouchEnd, onTouchCancel };
};
