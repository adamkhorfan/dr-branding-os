import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import type { CarouselToVideoProps } from "../../types";

function Slide({
  title,
  body,
  slideNumber,
  total,
  brandColor,
  accentColor,
  textColor,
  fontFamily,
  startFrame,
  framesPerSlide,
}: {
  title: string;
  body?: string;
  slideNumber: number;
  total: number;
  brandColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  startFrame: number;
  framesPerSlide: number;
}) {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;
  const fadeIn = Math.min(1, localFrame / 18);
  const titleY = interpolate(localFrame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyOpacity = interpolate(localFrame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (localFrame < 0 || localFrame >= framesPerSlide) return null;

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: "#111" }}>
      {/* Brand color header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: brandColor,
        }}
      />

      {/* Slide number indicator */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 48,
          fontSize: 16,
          color: `${textColor}60`,
          fontWeight: 500,
          letterSpacing: 2,
        }}
      >
        {slideNumber} / {total}
      </div>

      {/* Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 72px",
          gap: 32,
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: textColor,
            letterSpacing: -2,
            lineHeight: 1.15,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {title}
        </div>

        {/* Accent divider */}
        <div
          style={{
            width: 56,
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
          }}
        />

        {body && (
          <div
            style={{
              fontSize: 28,
              color: `${textColor}cc`,
              lineHeight: 1.5,
              opacity: bodyOpacity,
              maxWidth: 840,
            }}
          >
            {body}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const CarouselToVideoComposition: React.FC<CarouselToVideoProps> = ({
  slides,
  brandColor,
  accentColor,
  textColor,
  fontFamily,
  clientName,
  framesPerSlide,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", fontFamily }}>
      {slides.map((slide, idx) => {
        const startFrame = idx * framesPerSlide;
        return (
          <Sequence key={idx} from={startFrame} durationInFrames={framesPerSlide}>
            <Slide
              title={slide.title}
              body={slide.body}
              slideNumber={idx + 1}
              total={slides.length}
              brandColor={brandColor}
              accentColor={accentColor}
              textColor={textColor}
              fontFamily={fontFamily}
              startFrame={startFrame}
              framesPerSlide={framesPerSlide}
            />
          </Sequence>
        );
      })}

      {/* Client watermark */}
      {clientName && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 48,
            fontSize: 16,
            color: `${textColor}40`,
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          {clientName}
        </div>
      )}
    </AbsoluteFill>
  );
};
