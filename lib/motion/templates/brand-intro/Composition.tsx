import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type { BrandIntroProps } from "../../types";

export const BrandIntroComposition: React.FC<BrandIntroProps> = ({
  companyName,
  tagline,
  logoUrl,
  primaryColor,
  secondaryColor,
  textColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Color sweep: slides in from left over 0-25 frames
  const sweepProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo / initials: spring scale 20-60
  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 80, stiffness: 200, mass: 0.8 },
  });
  const logoOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Company name: slide up + fade 55-90
  const nameY = interpolate(frame, [55, 85], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameOpacity = interpolate(frame, [55, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline: fade in 95-120
  const taglineOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line: scale from 0 → 1 on 85-100
  const lineScale = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const initials = companyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <AbsoluteFill style={{ backgroundColor: secondaryColor, fontFamily }}>
      {/* Color sweep layer */}
      <AbsoluteFill
        style={{
          backgroundColor: primaryColor,
          transform: `scaleX(${sweepProgress})`,
          transformOrigin: "left center",
        }}
      />

      {/* Content center */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "0 80px",
        }}
      >
        {/* Logo or initials */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                borderRadius: 16,
              }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 20,
                backgroundColor: `${textColor}18`,
                border: `2px solid ${textColor}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 700,
                color: textColor,
                letterSpacing: -1,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Company name */}
        <div
          style={{
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: textColor,
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            {companyName}
          </div>
        </div>

        {/* Accent divider line */}
        <div
          style={{
            width: 60,
            height: 3,
            backgroundColor: primaryColor,
            borderRadius: 2,
            transform: `scaleX(${lineScale})`,
            transformOrigin: "center",
          }}
        />

        {/* Tagline */}
        {tagline && (
          <div
            style={{
              opacity: taglineOpacity,
              fontSize: 22,
              fontWeight: 400,
              color: `${textColor}cc`,
              textAlign: "center",
              maxWidth: 480,
              lineHeight: 1.4,
              letterSpacing: 0.2,
            }}
          >
            {tagline}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
