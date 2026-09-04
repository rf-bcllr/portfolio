import { ReactNode } from "react";

interface HeroStickerProps {
  src: string;
  alt: string;
  /** px size of the sticker image */
  size?: number;
  /** resting rotation in degrees */
  rotate?: number;
  /** comment pin rendered next to the sticker */
  children?: ReactNode;
  /** where the pin sits relative to the sticker */
  pinPosition?: "bottom-left" | "bottom-right";
  className?: string;
}

export const HeroSticker = ({
  src,
  alt,
  size = 88,
  rotate = -4,
  children,
  pinPosition = "bottom-right",
  className = "",
}: HeroStickerProps) => {
  return (
    <div className={`relative ${className}`} data-drawing-ignore="true">
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="select-none transition-transform duration-300 ease-out will-change-transform hover:scale-[1.06] hover:rotate-0 motion-reduce:transition-none motion-reduce:hover:scale-100"
        style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, objectFit: "contain" }}
      />
      {children && (
        <div
          className={`absolute ${
            pinPosition === "bottom-right" ? "-bottom-3 -right-4" : "-bottom-3 -left-4"
          } z-20`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
