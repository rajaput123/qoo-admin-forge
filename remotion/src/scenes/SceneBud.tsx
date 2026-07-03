import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

export const SceneBud = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns: slow zoom in
  const scale = interpolate(frame, [0, 180], [1.05, 1.25], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 180], [0, -30], { extrapolateRight: "clamp" });

  // Image reveal
  const imgOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

  // Golden shimmer overlay pulse
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0, 0.12]);

  // Text
  const textSpring = spring({ frame: frame - 60, fps, config: { damping: 20, stiffness: 100 } });
  const textOpacity = interpolate(frame, [60, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#2a0a15" }}>
      {/* Tanjore lotus bud */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: imgOpacity,
          transform: `scale(${scale}) translateY(${y}px)`,
        }}
      >
        <Img
          src={staticFile("images/lotus-bud-tanjore.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Gold shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, hsla(45, 80%, 55%, ${shimmer}) 0%, transparent 60%)`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(20,5,10,0.7) 100%)",
        }}
      />

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${(1 - textSpring) * 40}px)`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 36,
            color: "hsl(45, 75%, 75%)",
            letterSpacing: 8,
            textTransform: "uppercase",
            textShadow: "0 2px 20px hsla(45, 80%, 50%, 0.4)",
          }}
        >
          The Sacred Lotus
        </p>
      </div>
    </AbsoluteFill>
  );
};
