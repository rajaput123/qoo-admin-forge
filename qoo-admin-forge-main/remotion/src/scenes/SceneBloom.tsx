import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const SceneBloom = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns: slow zoom out from close-up
  const scale = interpolate(frame, [0, 180], [1.3, 1.0], { extrapolateRight: "clamp" });

  // Subtle rotation
  const rotation = interpolate(frame, [0, 180], [-1, 1], { extrapolateRight: "clamp" });

  // Reveal
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Pulsing golden glow
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.05, 0.2]);

  // Text
  const textOpacity = interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = spring({ frame: frame - 70, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0510" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile("images/lotus-tanjore-1.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Golden radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, hsla(45, 85%, 60%, ${glowPulse}) 0%, transparent 55%)`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(15,3,8,0.75) 100%)",
        }}
      />

      {/* Text */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${(1 - textY) * 35}px)`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 44,
            fontWeight: 700,
            color: "hsl(45, 80%, 78%)",
            letterSpacing: 5,
            textShadow: "0 3px 25px hsla(45, 85%, 55%, 0.5)",
          }}
        >
          कमल पुष्प
        </p>
        <p
          style={{
            fontFamily,
            fontSize: 22,
            color: "hsl(340, 40%, 80%)",
            letterSpacing: 4,
            marginTop: 16,
            opacity: 0.8,
          }}
        >
          Blooms in Purity
        </p>
      </div>
    </AbsoluteFill>
  );
};
