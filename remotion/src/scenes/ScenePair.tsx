import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ScenePair = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns: slight pan up
  const y = interpolate(frame, [0, 180], [40, -40], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 180], [1.1, 1.2], { extrapolateRight: "clamp" });

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Shimmer on gold elements
  const shimmerX = interpolate(frame, [0, 180], [-50, 150], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a25" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale}) translateY(${y}px)`,
        }}
      >
        <Img
          src={staticFile("images/lotus-pair-pichwai.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Moving gold light streak (simulates gold leaf shimmer) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${shimmerX}%`,
          width: "8%",
          height: "100%",
          background: "linear-gradient(90deg, transparent 0%, hsla(45, 80%, 70%, 0.08) 50%, transparent 100%)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Dark vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,20,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
