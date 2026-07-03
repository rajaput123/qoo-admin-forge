import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

export const SceneGarden = () => {
  const frame = useCurrentFrame();

  // Slow zoom and slight pan
  const scale = interpolate(frame, [0, 150], [1.15, 1.3], { extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, 150], [10, -10], { extrapolateRight: "clamp" });

  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Water shimmer
  const waterShimmer = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.02, 0.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#051515" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale}) translateX(${x}px)`,
        }}
      >
        <Img
          src={staticFile("images/lotus-garden-pichwai.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Water light effect at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(180deg, transparent 0%, hsla(180, 30%, 40%, ${waterShimmer}) 100%)`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(3,10,10,0.65) 100%)",
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 26,
            color: "hsl(45, 60%, 78%)",
            letterSpacing: 6,
            textShadow: "0 2px 15px hsla(45, 70%, 50%, 0.4)",
          }}
        >
          Sacred Waters
        </p>
      </div>
    </AbsoluteFill>
  );
};
