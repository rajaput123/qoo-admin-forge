import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 73.7) % 100,
  size: 2 + (i % 4) * 1.5,
  speed: 0.3 + (i % 5) * 0.15,
  phase: i * 0.8,
}));

export const GoldenParticles = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity: 0.4 }}>
      {PARTICLES.map((p, i) => {
        const y = (p.y - frame * p.speed * 0.3 + p.phase * 10) % 120 - 10;
        const x = p.x + Math.sin(frame * 0.02 + p.phase) * 3;
        const opacity = interpolate(
          Math.sin(frame * 0.03 + p.phase),
          [-1, 1],
          [0.1, 0.7]
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
              background: `radial-gradient(circle, hsla(45, 90%, 70%, ${opacity}) 0%, transparent 70%)`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
