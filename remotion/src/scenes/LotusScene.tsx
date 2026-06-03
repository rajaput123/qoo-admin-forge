import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { LotusSVG } from "../components/LotusSVG";

export const LotusScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in
  const opacity = interpolate(frame, [0, 30, 170, 200], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Lotus rises up
  const rise = interpolate(frame, [0, 60], [100, 0], { extrapolateRight: "clamp" });

  // Bloom progress: starts as bud, slowly blooms
  const bloomProgress = interpolate(frame, [30, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scale up as it blooms
  const scale = interpolate(bloomProgress, [0, 1], [0.6, 1.1]);

  // Radial glow behind lotus
  const glowSize = interpolate(bloomProgress, [0, 0.5, 1], [100, 250, 400]);
  const glowOpacity = interpolate(bloomProgress, [0, 0.3, 1], [0, 0.2, 0.5]);

  // Water ripple effect at the base
  const rippleScale = interpolate(frame, [20, 80], [0, 2.5], { extrapolateRight: "clamp" });
  const rippleOpacity = interpolate(frame, [20, 50, 80], [0, 0.3, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center", alignItems: "center" }}>
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, hsla(340, 50%, 70%, ${glowOpacity}) 0%, hsla(45, 80%, 60%, ${glowOpacity * 0.4}) 40%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Water ripple */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 60,
          borderRadius: "50%",
          border: "2px solid hsla(340, 40%, 70%, 0.3)",
          top: "62%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
          opacity: rippleOpacity,
        }}
      />

      {/* Lotus */}
      <div
        style={{
          transform: `translateY(${rise}px) scale(${scale})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LotusSVG frame={frame} bloomProgress={bloomProgress} size={400} glowIntensity={1.2} />
      </div>

      {/* Stem hint */}
      <div
        style={{
          position: "absolute",
          width: 4,
          height: interpolate(frame, [0, 40], [0, 200], { extrapolateRight: "clamp" }),
          background: "linear-gradient(180deg, hsl(120, 30%, 40%) 0%, hsl(120, 25%, 25%) 100%)",
          top: "58%",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: 2,
          opacity: interpolate(frame, [0, 20, 140, 180], [0, 0.6, 0.6, 0], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};
