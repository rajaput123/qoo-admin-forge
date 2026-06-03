import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { LotusSVG } from "../components/LotusSVG";

const LOTUSES = [
  { x: 50, y: 40, size: 320, delay: 0 },
  { x: 25, y: 55, size: 200, delay: 15 },
  { x: 75, y: 55, size: 220, delay: 10 },
  { x: 15, y: 35, size: 160, delay: 25 },
  { x: 85, y: 38, size: 150, delay: 30 },
  { x: 40, y: 70, size: 180, delay: 20 },
  { x: 65, y: 68, size: 170, delay: 22 },
];

export const LotusGarden = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 25, 150, 180], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Water surface shimmer
  const shimmerPhase = frame * 0.03;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Water surface */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: `linear-gradient(180deg, 
            hsla(200, 40%, 15%, 0) 0%, 
            hsla(200, 35%, 12%, 0.4) 30%, 
            hsla(200, 30%, 10%, 0.6) 100%)`,
        }}
      />

      {/* Shimmer lines on water */}
      {Array.from({ length: 5 }).map((_, i) => {
        const lineY = 60 + i * 8;
        const lineOpacity = interpolate(
          Math.sin(shimmerPhase + i * 1.5),
          [-1, 1],
          [0.02, 0.1]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${lineY}%`,
              left: "10%",
              width: "80%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, hsla(45, 60%, 60%, ${lineOpacity}) 50%, transparent 100%)`,
            }}
          />
        );
      })}

      {/* Lotuses blooming at different times */}
      {LOTUSES.map((lotus, i) => {
        const lFrame = frame - lotus.delay;
        const bloom = interpolate(lFrame, [0, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const appear = spring({ frame: lFrame, fps, config: { damping: 20, stiffness: 100 } });
        const floatY = Math.sin(frame * 0.03 + i * 2) * 5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${lotus.x}%`,
              top: `${lotus.y}%`,
              transform: `translate(-50%, -50%) scale(${appear}) translateY(${floatY}px)`,
            }}
          >
            <LotusSVG
              frame={frame}
              bloomProgress={bloom}
              size={lotus.size}
              glowIntensity={0.6}
            />
          </div>
        );
      })}

      {/* Ambient light from above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse at center, hsla(45, 70%, 60%, 0.08) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};
