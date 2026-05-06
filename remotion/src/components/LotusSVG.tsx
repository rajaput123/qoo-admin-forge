import { interpolate, spring, useVideoConfig } from "remotion";

interface LotusSVGProps {
  frame: number;
  bloomProgress: number; // 0 to 1
  size?: number;
  glowIntensity?: number;
}

const OUTER_PETALS = 10;
const MID_PETALS = 8;
const INNER_PETALS = 6;

// Realistic lotus petal paths
const outerPetal = "M0,-40 C7,-35 14,-22 12,-8 C10,2 6,8 0,14 C-6,8 -10,2 -12,-8 C-14,-22 -7,-35 0,-40Z";
const midPetal = "M0,-30 C5,-25 10,-16 8,-5 C7,2 4,6 0,10 C-4,6 -7,2 -8,-5 C-10,-16 -5,-25 0,-30Z";
const innerPetal = "M0,-20 C4,-16 7,-10 6,-3 C5,2 3,5 0,7 C-3,5 -5,2 -6,-3 C-7,-10 -4,-16 0,-20Z";

export const LotusSVG = ({ frame, bloomProgress, size = 300, glowIntensity = 1 }: LotusSVGProps) => {
  const { fps } = useVideoConfig();

  // Petal opening angle based on bloom progress
  const outerAngle = interpolate(bloomProgress, [0, 0.3, 1], [0, 5, 50], { extrapolateRight: "clamp" });
  const midAngle = interpolate(bloomProgress, [0.1, 0.5, 1], [0, 5, 38], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const innerAngle = interpolate(bloomProgress, [0.2, 0.6, 1], [0, 3, 25], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Scale petals as they bloom
  const outerScale = interpolate(bloomProgress, [0, 0.4, 1], [0.3, 0.7, 1], { extrapolateRight: "clamp" });
  const midScale = interpolate(bloomProgress, [0.1, 0.5, 1], [0.2, 0.6, 0.85], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const innerScale = interpolate(bloomProgress, [0.2, 0.6, 1], [0.1, 0.5, 0.7], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Center visibility
  const centerOpacity = interpolate(bloomProgress, [0.3, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gentle breathing motion on fully bloomed petals
  const breathe = Math.sin(frame * 0.04) * 1.5 * bloomProgress;

  // Baby pink gradient colors
  const outerColor1 = "hsl(340, 60%, 75%)";
  const outerColor2 = "hsl(340, 55%, 65%)";
  const midColor = "hsl(340, 65%, 80%)";
  const innerColor = "hsl(340, 70%, 85%)";
  const centerGold = "hsl(45, 85%, 65%)";

  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      <defs>
        {/* Petal gradients */}
        <radialGradient id="outer-petal-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor={outerColor1} />
          <stop offset="70%" stopColor={outerColor2} />
          <stop offset="100%" stopColor="hsl(340, 50%, 55%)" />
        </radialGradient>
        <radialGradient id="mid-petal-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="100%" stopColor="hsl(340, 55%, 70%)" />
        </radialGradient>
        <radialGradient id="inner-petal-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor={innerColor} />
          <stop offset="100%" stopColor="hsl(340, 60%, 75%)" />
        </radialGradient>
        <radialGradient id="center-grad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="hsl(45, 90%, 75%)" />
          <stop offset="50%" stopColor={centerGold} />
          <stop offset="100%" stopColor="hsl(38, 80%, 50%)" />
        </radialGradient>
        {/* Glow filter */}
        <filter id="petal-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={2 * glowIntensity} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="golden-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={4 * glowIntensity} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer petals */}
      {Array.from({ length: OUTER_PETALS }).map((_, i) => {
        const angle = (360 / OUTER_PETALS) * i;
        const petalDelay = i * 0.02;
        const rot = (outerAngle + breathe) * (1 - petalDelay);
        const opacity = interpolate(bloomProgress, [0 + petalDelay, 0.15 + petalDelay], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <g key={`o-${i}`} transform={`rotate(${angle})`} opacity={opacity}>
            <g transform={`scale(${outerScale})`}>
              <path
                d={outerPetal}
                transform={`rotate(${-rot})`}
                fill="url(#outer-petal-grad)"
                stroke="hsl(340, 45%, 60%)"
                strokeWidth={0.3}
                filter="url(#petal-glow)"
              />
            </g>
          </g>
        );
      })}

      {/* Mid petals */}
      {Array.from({ length: MID_PETALS }).map((_, i) => {
        const angle = (360 / MID_PETALS) * i + 22.5;
        const rot = (midAngle + breathe * 0.7);
        const opacity = interpolate(bloomProgress, [0.1 + i * 0.02, 0.25 + i * 0.02], [0, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <g key={`m-${i}`} transform={`rotate(${angle})`} opacity={opacity}>
            <g transform={`scale(${midScale})`}>
              <path
                d={midPetal}
                transform={`rotate(${-rot * 0.7})`}
                fill="url(#mid-petal-grad)"
                stroke="hsl(340, 50%, 72%)"
                strokeWidth={0.2}
              />
            </g>
          </g>
        );
      })}

      {/* Inner petals */}
      {Array.from({ length: INNER_PETALS }).map((_, i) => {
        const angle = (360 / INNER_PETALS) * i + 15;
        const rot = (innerAngle + breathe * 0.4);
        const opacity = interpolate(bloomProgress, [0.25 + i * 0.03, 0.4 + i * 0.03], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <g key={`i-${i}`} transform={`rotate(${angle})`} opacity={opacity}>
            <g transform={`scale(${innerScale})`}>
              <path
                d={innerPetal}
                transform={`rotate(${-rot * 0.5})`}
                fill="url(#inner-petal-grad)"
                stroke="hsl(340, 55%, 80%)"
                strokeWidth={0.15}
              />
            </g>
          </g>
        );
      })}

      {/* Center — golden pistils */}
      <g opacity={centerOpacity}>
        <circle cx="0" cy="0" r="7" fill="url(#center-grad)" filter="url(#golden-glow)" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (360 / 8) * i;
          const rad = (a * Math.PI) / 180;
          const r = 3.5;
          return (
            <circle
              key={`dot-${i}`}
              cx={Math.cos(rad) * r}
              cy={Math.sin(rad) * r}
              r="1"
              fill="hsl(45, 90%, 60%)"
              opacity={0.8}
            />
          );
        })}
      </g>
    </svg>
  );
};
