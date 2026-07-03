import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { LotusSVG } from "../components/LotusSVG";

export const DivineLotusReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30, 190, 220], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Two lotuses — left and right, like Lakshmi's hands
  const leftX = interpolate(frame, [10, 70], [-300, -200], { extrapolateRight: "clamp" });
  const rightX = interpolate(frame, [10, 70], [300, 200], { extrapolateRight: "clamp" });
  const sideY = interpolate(frame, [10, 50], [50, 0], { extrapolateRight: "clamp" });

  const leftBloom = interpolate(frame, [20, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightBloom = interpolate(frame, [35, 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Golden light rays from center
  const rayOpacity = interpolate(frame, [60, 100, 180, 210], [0, 0.35, 0.35, 0], { extrapolateRight: "clamp" });
  const rayRotation = interpolate(frame, [0, 220], [0, 30]);

  // Center Om / divine symbol glow
  const centerGlow = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const centerScale = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 80 } });

  // Falling petals
  const petals = Array.from({ length: 12 }, (_, i) => ({
    x: ((i * 137.5 + 30) % 100),
    delay: i * 8,
    speed: 0.5 + (i % 3) * 0.3,
    sway: i * 1.2,
    size: 8 + (i % 4) * 4,
  }));

  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center", alignItems: "center" }}>
      {/* Golden light rays */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${rayRotation}deg)`,
          opacity: rayOpacity,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3,
              height: 400,
              background: "linear-gradient(180deg, hsla(45, 85%, 65%, 0.4) 0%, transparent 100%)",
              top: "50%",
              left: "50%",
              transformOrigin: "center top",
              transform: `translate(-50%, 0) rotate(${(360 / 12) * i}deg)`,
            }}
          />
        ))}
      </div>

      {/* Center divine glow */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, hsla(45, 90%, 70%, ${centerGlow * 0.5}) 0%, hsla(340, 50%, 70%, ${centerGlow * 0.2}) 50%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${centerScale})`,
        }}
      />

      {/* Left lotus — like in Lakshmi's left hand */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: `translate(${leftX}px, ${sideY}px) rotate(-15deg)`,
        }}
      >
        <LotusSVG frame={frame} bloomProgress={leftBloom} size={280} glowIntensity={0.8} />
      </div>

      {/* Right lotus — like in Lakshmi's right hand */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: `translate(${rightX}px, ${sideY}px) rotate(15deg)`,
        }}
      >
        <LotusSVG frame={frame} bloomProgress={rightBloom} size={280} glowIntensity={0.8} />
      </div>

      {/* Falling petals */}
      {petals.map((p, i) => {
        const pFrame = frame - p.delay;
        if (pFrame < 0) return null;
        const py = pFrame * p.speed * 3;
        const px = Math.sin(pFrame * 0.05 + p.sway) * 30;
        const rot = pFrame * 2;
        const pOpacity = interpolate(pFrame, [0, 10, 80, 100], [0, 0.6, 0.6, 0], { extrapolateRight: "clamp" });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${20 + py * 0.5}%`,
              transform: `translate(${px}px, 0) rotate(${rot}deg)`,
              width: p.size,
              height: p.size * 1.4,
              borderRadius: "50% 50% 50% 0",
              background: "hsla(340, 60%, 78%, 0.7)",
              opacity: pOpacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
