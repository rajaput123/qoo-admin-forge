import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const SceneDivine = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic slow zoom into the divine lotus
  const scale = interpolate(frame, [0, 180], [1.0, 1.15], { extrapolateRight: "clamp" });

  const opacity = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: "clamp" });

  // Mandala glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.08, 0.25]);

  // Divine light rays rotation
  const rayAngle = interpolate(frame, [0, 180], [0, 20]);
  const rayOpacity = interpolate(frame, [30, 70, 140, 180], [0, 0.15, 0.15, 0], { extrapolateRight: "clamp" });

  // Text
  const textOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textSpring = spring({ frame: frame - 50, fps, config: { damping: 20 } });

  // Fade out at end
  const fadeOut = interpolate(frame, [155, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0508", opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile("images/lotus-divine-tanjore.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Divine light rays overlay */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          width: 600,
          height: 600,
          transform: `translate(-50%, -50%) rotate(${rayAngle}deg)`,
          opacity: rayOpacity,
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 2,
              height: 300,
              background: "linear-gradient(180deg, hsla(45, 85%, 65%, 0.3) 0%, transparent 100%)",
              top: "50%",
              left: "50%",
              transformOrigin: "center top",
              transform: `translate(-50%, 0) rotate(${(360 / 16) * i}deg)`,
            }}
          />
        ))}
      </div>

      {/* Golden glow pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 38%, hsla(45, 85%, 60%, ${glowPulse}) 0%, transparent 50%)`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(15,2,5,0.7) 100%)",
        }}
      />

      {/* Blessing text */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${(1 - textSpring) * 30}px)`,
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: "hsl(45, 80%, 78%)",
            letterSpacing: 4,
            textShadow: "0 3px 30px hsla(45, 85%, 55%, 0.6)",
          }}
        >
          Divine Bloom
        </p>
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: "hsl(340, 45%, 82%)",
            letterSpacing: 3,
            marginTop: 14,
          }}
        >
          🙏 श्री लक्ष्मी 🙏
        </p>
        <p
          style={{
            fontFamily,
            fontSize: 18,
            color: "hsl(45, 50%, 70%)",
            letterSpacing: 6,
            marginTop: 20,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          Tanjore Art Tradition
        </p>
      </div>
    </AbsoluteFill>
  );
};
