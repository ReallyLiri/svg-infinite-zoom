import styled from "@emotion/styled";
import Svg from "./assets/lim.svg";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { usePinchScroll, useWheelScroll } from "./hooks.ts";

const SCALE_FACTOR = 100;
const MIN_SCALE = 1 / SCALE_FACTOR;

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

export const App = () => {
  const { height, width } = useWindowSize();
  const size = height && width ? Math.min(height, width) : null;
  const [scale, setScale] = useState(1);

  const setScaleFromDelta = (delta: number, isZoomIn: boolean) => {
    setScale((s) => Math.max(MIN_SCALE, isZoomIn ? s * delta : s / delta));
  };

  useWheelScroll(setScaleFromDelta);
  usePinchScroll(setScaleFromDelta);

  useEffect(() => {
    if (scale >= SCALE_FACTOR) {
      setScale(scale / SCALE_FACTOR);
    }
    if (scale <= 1 / SCALE_FACTOR) {
      setScale(scale * SCALE_FACTOR);
    }
  }, [scale]);

  if (!size) {
    return;
  }

  return (
    <Container>
      <StyledSvg
        height={size}
        width={size}
        transform={`scale(${scale * SCALE_FACTOR})`}
      />
      <StyledSvg height={size} width={size} transform={`scale(${scale})`} />
      <StyledSvg
        height={size}
        width={size}
        transform={`scale(${scale / SCALE_FACTOR})`}
      />
    </Container>
  );
};
