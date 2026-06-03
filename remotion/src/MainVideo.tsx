import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SceneBud } from "./scenes/SceneBud";
import { SceneBloom } from "./scenes/SceneBloom";
import { ScenePair } from "./scenes/ScenePair";
import { SceneGarden } from "./scenes/SceneGarden";
import { SceneDivine } from "./scenes/SceneDivine";
import { GoldDust } from "./components/GoldDust";

export const MainVideo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0a0f" }}>
      <TransitionSeries>
        {/* Scene 1: Lotus bud with gold dust — 0-180 */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneBud />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* Scene 2: Full bloom Tanjore lotus — 150-330 */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneBloom />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* Scene 3: Pair of lotuses (Pichwai style) — 300-480 */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <ScenePair />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* Scene 4: Lotus garden pond — 450-600 */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SceneGarden />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 30 })}
        />

        {/* Scene 5: Divine lotus with mandala — 570-750 */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneDivine />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Persistent gold dust overlay */}
      <GoldDust />
    </AbsoluteFill>
  );
};
