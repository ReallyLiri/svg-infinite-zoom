import { useEffect } from "react";

const WHEEL_DELTA_FACTOR = 0.05;
const PINCH_DELTA_FACTOR = 0.001;

type onZoom = (delta: number, isZoomIn: boolean) => void;

export const useWheelScroll = (onZoom: onZoom) => {
  useEffect(() => {
    const onScroll = (event: WheelEvent) => {
      event.stopPropagation();
      const delta = 1 + Math.abs(event.deltaY * WHEEL_DELTA_FACTOR);
      onZoom(delta, event.deltaY < 0);
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, []);
};

export const usePinchScroll = (onZoom: onZoom) => {
  useEffect(() => {
    let initialPinchDistance = 0;
    const onPinchStart = (event: TouchEvent) => {
      const { touches } = event;
      if (touches.length !== 2) {
        return;
      }
      initialPinchDistance = pinchDistance(touches);
    };
    const onPinchMove = (event: TouchEvent) => {
      const { touches } = event;
      if (touches.length !== 2) {
        return;
      }
      const distance = pinchDistance(touches);
      const pinchDelta = distance - initialPinchDistance;
      const delta = 1 + Math.abs(pinchDelta * PINCH_DELTA_FACTOR);
      onZoom(delta, pinchDelta > 0);
    };
    window.addEventListener("touchmove", onPinchMove);
    window.addEventListener("touchstart", onPinchStart);
    return () => {
      window.removeEventListener("touchmove", onPinchMove);
      window.removeEventListener("touchstart", onPinchStart);
    };
  }, []);
};

function pinchDistance(touches: TouchList) {
  const [a, b] = touches;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
