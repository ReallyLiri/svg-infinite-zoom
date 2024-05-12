import styled from "@emotion/styled";
import Svg from "./assets/lim.svg";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const SCALE_FACTOR = 100;
const MIN_SCALE = 1 / SCALE_FACTOR;
const WHEEL_DELTA_FACTOR = 0.05;
const PINCH_DELTA_FACTOR = 0.001;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledSvg = styled(Svg)`
  position: absolute;
`;

function pinchDistance(touches: TouchList) {
  const [a, b] = touches;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export const App = () => {
  const { height, width } = useWindowSize();
  const size = height && width ? Math.min(height, width) : null;
  const [scale, setScale] = useState(1);

  const setScaleFromDelta = (delta: number, isZommIn: boolean) => {
    setScale((s) => Math.max(MIN_SCALE, isZommIn ? s * delta : s / delta));
  };

  useEffect(() => {
    const onScroll = (event: WheelEvent) => {
      event.stopPropagation();
      const delta = 1 + Math.abs(event.deltaY * WHEEL_DELTA_FACTOR);
      setScaleFromDelta(delta, event.deltaY < 0);
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, []);

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
      setScaleFromDelta(delta, pinchDelta > 0);
    };
    window.addEventListener("touchmove", onPinchMove);
    window.addEventListener("touchstart", onPinchStart);
    return () => {
      window.removeEventListener("touchmove", onPinchMove);
      window.removeEventListener("touchstart", onPinchStart);
    };
  }, []);

  useEffect(() => {
    if (scale >= SCALE_FACTOR) {
      setScale(scale / SCALE_FACTOR);
    }
  }, [scale]);

  if (!size) {
    return;
  }

  return (
    <Container>
      <StyledSvg height={size} width={size} transform={`scale(${scale})`} />
      <StyledSvg
        height={size}
        width={size}
        transform={`scale(${scale / SCALE_FACTOR})`}
      />
    </Container>
  );
};
