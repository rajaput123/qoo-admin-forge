import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import lotusImage from "@/assets/lotus-bloom.png";

interface LotusBloomProps {
  isVisible: boolean;
  state: "blooming" | "locked" | "idle";
  targetRect?: DOMRect | null;
  onComplete?: () => void;
  onLockedComplete?: () => void;
}

const UpgradeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/temple/settings/subscription")}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:bg-primary/90 transition-colors"
    >
      <Crown className="h-4 w-4" />
      Upgrade to Unlock
    </button>
  );
};

const LotusBloom = ({ isVisible, state, targetRect, onComplete, onLockedComplete }: LotusBloomProps) => {
  const [phase, setPhase] = useState<"bud" | "opening" | "bloom" | "glow" | "exit" | "locked-stop">("bud");

  useEffect(() => {
    if (!isVisible) {
      setPhase("bud");
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Bud appears (tiny, closed)
    setPhase("bud");

    // Phase 2: Petals start opening (slow unfurl)
    timers.push(setTimeout(() => setPhase("opening"), 300));

    // Phase 3: Full bloom
    timers.push(setTimeout(() => setPhase("bloom"), 1200));

    if (state === "locked") {
      // Phase 4: Settle for locked
      timers.push(setTimeout(() => setPhase("locked-stop"), 2000));
    } else {
      // Phase 4: Golden glow pulse
      timers.push(setTimeout(() => setPhase("glow"), 2200));
      // Phase 5: Petals release & fade
      timers.push(setTimeout(() => setPhase("exit"), 3400));
      timers.push(setTimeout(() => onComplete?.(), 4200));
    }

    return () => timers.forEach(clearTimeout);
  }, [isVisible, state, onComplete, onLockedComplete]);

  if (!targetRect) return null;

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 800;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 600;
  const lotusSize = Math.min(300, viewportWidth * 0.42, viewportHeight * 0.48);
  const cx = viewportWidth / 2;
  const cy = viewportHeight / 2;

  const isLocked = state === "locked";
  const isOpening = phase === "opening";
  const isBloomed = phase === "bloom" || phase === "glow" || phase === "exit";
  const isActive = isOpening || isBloomed || phase === "locked-stop";

  // Multi-stage scale to simulate petals unfolding
  const getScale = () => {
    switch (phase) {
      case "bud": return 0.08;
      case "opening": return 0.55;
      case "bloom": return 1;
      case "glow": return 1.05;
      case "exit": return 1.18;
      case "locked-stop": return isLocked ? 0.9 : 1;
      default: return 0.08;
    }
  };

  const getRotation = () => {
    switch (phase) {
      case "bud": return -15;
      case "opening": return -5;
      case "bloom": return 0;
      case "glow": return 2;
      case "exit": return 5;
      case "locked-stop": return 0;
      default: return -15;
    }
  };

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="lotus-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          className={`fixed inset-0 z-[100] flex items-center justify-center ${isLocked && phase === "locked-stop" ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          {/* Dismiss on backdrop click */}
          {isLocked && phase === "locked-stop" && (
            <div className="absolute inset-0 cursor-pointer" onClick={() => onLockedComplete?.()} />
          )}

          {/* Dark backdrop — fades in as flower opens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "bud" ? 0.1 : isActive ? 0.85 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              background: isLocked
                ? "radial-gradient(circle at 50% 50%, hsla(340, 25%, 12%, 0.5) 0%, hsla(25, 15%, 6%, 0.75) 100%)"
                : "radial-gradient(circle at 50% 50%, hsla(340, 50%, 18%, 0.45) 0%, hsla(25, 20%, 6%, 0.7) 100%)",
            }}
          />

          {/* Inner warm glow — expands as flower opens */}
          <motion.div
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{
              scale: phase === "glow" ? 2.8 : isBloomed ? 2.2 : isOpening ? 1.2 : 0.15,
              opacity: phase === "glow" ? 0.85 : isBloomed || phase === "locked-stop" ? 0.5 : isOpening ? 0.25 : 0,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: lotusSize,
              height: lotusSize,
              left: cx - lotusSize / 2,
              top: cy - lotusSize / 2,
              background: isLocked
                ? "radial-gradient(circle, hsla(340, 50%, 75%, 0.35) 0%, hsla(30, 40%, 60%, 0.1) 45%, transparent 70%)"
                : "radial-gradient(circle, hsla(340, 90%, 85%, 0.65) 0%, hsla(45, 95%, 72%, 0.25) 35%, transparent 68%)",
            }}
          />

          {/* Lotus flower — the blooming effect */}
          <motion.div
            initial={{ scale: 0.08, opacity: 0, rotate: -15 }}
            animate={{
              scale: getScale(),
              opacity: phase === "exit" ? 0.3 : phase === "bud" ? 0.6 : isActive ? 1 : 0,
              rotate: getRotation(),
            }}
            exit={{ scale: 1.4, opacity: 0, rotate: 8 }}
            transition={{
              scale: {
                type: "spring",
                stiffness: phase === "opening" ? 40 : phase === "bloom" ? 55 : 70,
                damping: phase === "opening" ? 8 : 11,
                mass: 1.3,
              },
              rotate: { duration: 1.5, ease: "easeOut" },
              opacity: { duration: 0.5 },
            }}
            className="absolute"
            style={{
              width: lotusSize,
              height: lotusSize,
              left: cx - lotusSize / 2,
              top: cy - lotusSize / 2,
              transformOrigin: "center center",
            }}
          >
            <img
              src={lotusImage}
              alt="Lotus bloom"
              draggable={false}
              width={1024}
              height={1024}
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: isLocked
                  ? "saturate(0.85) brightness(0.95) drop-shadow(0 0 24px hsla(340, 60%, 65%, 0.55))"
                  : phase === "glow"
                    ? "saturate(1.4) brightness(1.2) drop-shadow(0 0 50px hsla(340, 85%, 72%, 0.8)) drop-shadow(0 0 100px hsla(45, 95%, 65%, 0.5))"
                    : "saturate(1.3) brightness(1.15) drop-shadow(0 0 40px hsla(340, 80%, 70%, 0.7)) drop-shadow(0 0 80px hsla(45, 90%, 65%, 0.4))",
                userSelect: "none",
              }}
            />
          </motion.div>

          {/* Petal-drift particles — float outward like petals releasing */}
          {(isBloomed || isOpening) && !isLocked && (
            <>
              {[...Array(16)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 16 + (i % 2 === 0 ? 0.15 : -0.1);
                const radius = lotusSize * (0.4 + (i % 3) * 0.15);
                const size = 6 + (i % 3) * 3;
                const delay = 0.3 + i * 0.07;
                return (
                  <motion.div
                    key={`petal-${i}`}
                    initial={{
                      scale: 0,
                      opacity: 0,
                      x: cx - size / 2,
                      y: cy - size / 2,
                      rotate: 0,
                    }}
                    animate={{
                      scale: [0, 1.2, 0.9, 0],
                      opacity: [0, 0.95, 0.6, 0],
                      x: cx + Math.cos(angle) * radius - size / 2,
                      y: cy + Math.sin(angle) * radius - size / 2,
                      rotate: [0, 45 * (i % 2 === 0 ? 1 : -1)],
                    }}
                    transition={{
                      duration: 1.8,
                      delay,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      background:
                        i % 4 === 0
                          ? "radial-gradient(circle, hsla(45, 98%, 71%, 1), hsla(45, 84%, 58%, 0.5))"
                          : i % 4 === 1
                            ? "radial-gradient(circle, hsla(340, 88%, 82%, 1), hsla(340, 60%, 68%, 0.5))"
                            : i % 4 === 2
                              ? "radial-gradient(circle, hsla(30, 95%, 75%, 1), hsla(30, 80%, 60%, 0.5))"
                              : "radial-gradient(circle, hsla(350, 80%, 88%, 1), hsla(350, 60%, 75%, 0.5))",
                      boxShadow: `0 0 ${size + 4}px hsla(45, 84%, 62%, 0.6)`,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Gentle breathing pulse on full bloom */}
          {(phase === "bloom" || phase === "glow" || phase === "locked-stop") && (
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                width: lotusSize * 1.6,
                height: lotusSize * 1.6,
                left: cx - lotusSize * 0.8,
                top: cy - lotusSize * 0.8,
                background: "radial-gradient(circle, hsla(340, 80%, 80%, 0.2) 0%, transparent 65%)",
              }}
            />
          )}

          {/* Locked — Upgrade button */}
          {isLocked && phase === "locked-stop" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto"
              style={{ top: cy + lotusSize / 2 + 20 }}
            >
              <UpgradeButton />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LotusBloom;
