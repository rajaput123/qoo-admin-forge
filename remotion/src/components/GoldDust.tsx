import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 137.5 + 20) % 100,
  y: (i * 83.7) % 100,
  size: 2 + (i % 5) * 1.2,
  speed: 0.15 + (i % 6) * 0.08,
  phase: i * 1.1,
  drift: (i % 2 === 0 ? 1 : -1) * (1 + (i % 3)),
}));

export const GoldDust = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {PARTICLES.map((p, i) => {
        const y = (p.y + 110 - frame * p.speed * 0.4) % 120 - 10;
        const x = p.x + Math.sin(frame * 0.015 + p.phase) * p.drift;
        const twinkle = interpolate(
          Math.sin(frame * 0.05 + p.phase),
          [-1, 1],
          [0.05, 0.5]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, hsla(45, 85%, 65%, ${twinkle}) 0%, hsla(38, 80%, 50%, ${twinkle * 0.3}) 60%, transparent 100%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
