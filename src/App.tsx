import styled from "@emotion/styled";
import Svg from "./assets/lim.svg";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

const SCALE_FACTOR = 100;
const MIN_SCALE = 1 / SCALE_FACTOR;
const WHEEL_DELTA_FACTOR = 0.05;

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

  useEffect(() => {
    const onScroll = (event: WheelEvent) => {
      event.stopPropagation();
      const delta = 1 + Math.abs(event.deltaY * WHEEL_DELTA_FACTOR);
      setScale((s) =>
        Math.max(MIN_SCALE, event.deltaY < 0 ? s * delta : s / delta),
      );
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
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
