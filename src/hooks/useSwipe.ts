import { useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState } from "react";

export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      setSwipeDirection("right");
      if (onSwipeRight) onSwipeRight();
    } else if (info.offset.x < -threshold) {
      setSwipeDirection("left");
      if (onSwipeLeft) onSwipeLeft();
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDrag = (_event: MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > 30) {
      setSwipeDirection("right");
    } else if (info.offset.x < -30) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  return {
    x,
    y,
    rotate,
    opacity,
    swipeDirection,
    handleDrag,
    handleDragEnd
  };
}
