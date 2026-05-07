import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type { PromoVideoProps } from "../../types";

export const PromoVideoComposition: React.FC<PromoVideoProps> = ({
  headline,
  subheadline,
  bodyText,
  cta,
  primaryColor,
  secondaryColor,
  textColor,
  logoUrl,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation
  const gradientPos = interpolate(frame, [0, 180], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Headline spring
  const headlineSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100, stiffness: 150, mass: 1 },
  });
  const headlineOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subheadline
  const subOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [40, 65], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Body text
  const bodyOpacity = interpolate(frame, [65, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA
  const ctaOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = spring({
    frame: frame - 120,
    fps,
    config: { damping: 80, stiffness: 300, mass: 0.6 },
  });

  // Logo fade in
  const logoOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: `linear-gradient(${135 + gradientPos}deg, ${secondaryColor} 0%, ${primaryColor}33 100%)`,
      }}
    >
      {/* Dark overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Logo top-left */}
      {logoUrl && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 56,
            opacity: logoOpacity,
          }}
        >
          <img
            src={logoUrl}
            alt="logo"
            style={{ height: 48, objectFit: "contain" }}
          />
        </div>
      )}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 96px",
          gap: 24,
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: textColor,
            letterSpacing: -3,
            lineHeight: 1.05,
            opacity: headlineOpacity,
            transform: `translateY(${interpolate(headlineSpring, [0, 1], [40, 0])}px)`,
            maxWidth: 900,
          }}
        >
          {headline}
        </div>

        {/* Subheadline */}
        {subheadline && (
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: `${textColor}cc`,
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subheadline}
          </div>
        )}

        {/* Body text */}
        {bodyText && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: `${textColor}99`,
              opacity: bodyOpacity,
              lineHeight: 1.5,
              maxWidth: 780,
            }}
          >
            {bodyText}
          </div>
        )}

        {/* Accent line */}
        <div
          style={{
            width: interpolate(frame, [80, 105], [0, 72], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 4,
            backgroundColor: primaryColor,
            borderRadius: 2,
          }}
        />

        {/* CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            transformOrigin: "left center",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              backgroundColor: primaryColor,
              color: secondaryColor,
              fontSize: 22,
              fontWeight: 700,
              padding: "16px 40px",
              borderRadius: 8,
              letterSpacing: 0.5,
            }}
          >
            {cta}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
