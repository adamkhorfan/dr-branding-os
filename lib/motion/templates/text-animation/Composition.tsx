import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TextAnimationProps } from "../../types";

export const TextAnimationComposition: React.FC<TextAnimationProps> = ({
  text,
  subtext,
  animationStyle,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split text into words for stagger
  const words = text.split(" ");

  // Base animations
  const fadeOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideY = interpolate(frame, [0, 25], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const maskClip = interpolate(frame, [5, 35], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtext fade
  const subtextOpacity = interpolate(
    frame,
    [Math.floor(duration * 0.55), Math.floor(duration * 0.75)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Accent line scale
  const lineScale = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  function getTextStyle() {
    switch (animationStyle) {
      case "fade":
        return { opacity: fadeOpacity };
      case "slide-up":
        return { opacity: fadeOpacity, transform: `translateY(${slideY}px)` };
      case "mask":
        return { clipPath: `inset(0 ${100 - maskClip}% 0 0)` };
      default:
        return { opacity: fadeOpacity };
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 64px",
      }}
    >
      {/* Decorative top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: accentColor,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "left",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: "100%",
          maxWidth: 960,
        }}
      >
        {/* Main text */}
        {animationStyle === "stagger" ? (
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: textColor,
              letterSpacing: -3,
              lineHeight: 1.1,
              textAlign: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: "0 16px",
              justifyContent: "center",
            }}
          >
            {words.map((word, i) => {
              const wordOpacity = interpolate(
                frame,
                [i * 5, i * 5 + 20],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              const wordY = interpolate(
                frame,
                [i * 5, i * 5 + 20],
                [30, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return (
                <span
                  key={i}
                  style={{
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    display: "inline-block",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ) : animationStyle === "kinetic" ? (
          <div style={{ textAlign: "center" }}>
            {words.map((word, i) => {
              const scale = spring({
                frame: frame - i * 6,
                fps,
                config: { damping: 60, stiffness: 300, mass: 0.5 },
              });
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontSize: 72,
                    fontWeight: 800,
                    color: i % 2 === 0 ? textColor : accentColor,
                    letterSpacing: -2,
                    lineHeight: 1.1,
                    transform: `scale(${scale})`,
                    marginRight: 12,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: textColor,
              letterSpacing: -3,
              lineHeight: 1.1,
              textAlign: "center",
              ...getTextStyle(),
            }}
          >
            {text}
          </div>
        )}

        {/* Subtext */}
        {subtext && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: `${textColor}99`,
              opacity: subtextOpacity,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {subtext}
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: accentColor,
          opacity: 0.4,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "right",
        }}
      />
    </AbsoluteFill>
  );
};
