import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { LotusSVG } from "../components/LotusSVG";
import { loadFont } from "@remotion/google-fonts/Cinzel";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const BlessingScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 25, 100, 120], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Large lotus in the center, fully bloomed and breathing
  const bloomProgress = interpolate(frame, [0, 50], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Text reveal
  const textSpring = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 120 } });
  const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle rotation
  const rotation = interpolate(frame, [0, 120], [0, 8]);

  // Golden mandala ring behind
  const ringScale = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 60 } });
  const ringRotation = interpolate(frame, [0, 120], [0, -15]);

  // Pulsing glow
  const pulseGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.2, 0.5]);

  return (
    <AbsoluteFill style={{ opacity, justifyContent: "center", alignItems: "center" }}>
      {/* Large radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, hsla(45, 85%, 65%, ${pulseGlow}) 0%, hsla(340, 50%, 60%, 0.1) 40%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Mandala-like ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${ringScale}) rotate(${ringRotation}deg)`,
        }}
      >
        <svg width="600" height="600" viewBox="-100 -100 200 200">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (360 / 24) * i;
            return (
              <g key={i} transform={`rotate(${angle})`}>
                <ellipse cx="0" cy="-80" rx="4" ry="12" fill="hsla(45, 70%, 60%, 0.2)" />
                <circle cx="0" cy="-65" r="2" fill="hsla(45, 80%, 65%, 0.3)" />
              </g>
            );
          })}
          <circle cx="0" cy="0" r="55" fill="none" stroke="hsla(45, 60%, 60%, 0.15)" strokeWidth="1" />
          <circle cx="0" cy="0" r="75" fill="none" stroke="hsla(340, 40%, 70%, 0.1)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Central lotus */}
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <LotusSVG frame={frame} bloomProgress={bloomProgress} size={450} glowIntensity={1.5} />
      </div>

      {/* Blessing text */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - textSpring) * 30}px)`,
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily,
            fontSize: 42,
            fontWeight: 700,
            color: "hsl(45, 80%, 75%)",
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: "0 0 30px hsla(45, 80%, 60%, 0.4)",
          }}
        >
          Divine Bloom
        </p>
        <p
          style={{
            fontFamily,
            fontSize: 20,
            color: "hsl(340, 40%, 80%)",
            letterSpacing: 3,
            marginTop: 12,
            opacity: 0.8,
          }}
        >
          🙏 श्री लक्ष्मी 🙏
        </p>
      </div>
    </AbsoluteFill>
  );
};
