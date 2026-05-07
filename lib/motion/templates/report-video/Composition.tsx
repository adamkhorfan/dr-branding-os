import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type { ReportVideoProps } from "../../types";

function AnimatedCounter({
  value,
  startFrame,
  fps,
  color,
  fontSize = 64,
}: {
  value: number | string;
  startFrame: number;
  fps: number;
  color: string;
  fontSize?: number;
}) {
  const frame = useCurrentFrame();
  const isNumeric = typeof value === "number";

  if (!isNumeric) {
    const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <span style={{ color, fontSize, fontWeight: 800, opacity }}>
        {value}
      </span>
    );
  }

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 60, stiffness: 80, mass: 1.2 },
  });
  const displayed = Math.round(progress * (value as number));

  return (
    <span style={{ color, fontSize, fontWeight: 800 }}>
      {displayed}
    </span>
  );
}

export const ReportVideoComposition: React.FC<ReportVideoProps> = ({
  clientName,
  month,
  kpis,
  highlights,
  primaryColor,
  accentColor,
  textColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dividerScale = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        fontFamily,
        padding: "72px 80px",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: primaryColor,
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: accentColor,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Monthly Report
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: textColor,
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          {clientName}
        </div>
        <div
          style={{
            fontSize: 24,
            color: `${textColor}80`,
            marginTop: 8,
          }}
        >
          {month}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: `${dividerScale * 100}%`,
          height: 2,
          backgroundColor: `${textColor}20`,
          marginBottom: 48,
        }}
      />

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 32,
          marginBottom: 56,
        }}
      >
        {kpis.slice(0, 3).map((kpi, idx) => {
          const kpiOpacity = interpolate(
            frame,
            [40 + idx * 12, 60 + idx * 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={kpi.label}
              style={{
                opacity: kpiOpacity,
                backgroundColor: `${textColor}08`,
                borderRadius: 16,
                padding: "28px 32px",
                border: `1px solid ${textColor}12`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: `${textColor}60`,
                  fontWeight: 500,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {kpi.label}
              </div>
              <AnimatedCounter
                value={typeof kpi.value === "number" ? kpi.value : kpi.value}
                startFrame={40 + idx * 12}
                fps={fps}
                color={accentColor}
                fontSize={52}
              />
              {kpi.unit && (
                <span
                  style={{
                    fontSize: 24,
                    color: `${accentColor}80`,
                    fontWeight: 400,
                    marginLeft: 4,
                  }}
                >
                  {kpi.unit}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Highlights */}
      <div>
        <div
          style={{
            fontSize: 14,
            color: `${textColor}60`,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 20,
            opacity: interpolate(frame, [110, 130], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Key Highlights
        </div>
        {highlights.slice(0, 3).map((h, idx) => {
          const hOpacity = interpolate(
            frame,
            [120 + idx * 15, 140 + idx * 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const hX = interpolate(
            frame,
            [120 + idx * 15, 140 + idx * 15],
            [-20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                opacity: hOpacity,
                transform: `translateX(${hX}px)`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  marginTop: 9,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  color: `${textColor}cc`,
                  lineHeight: 1.4,
                }}
              >
                {h}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
