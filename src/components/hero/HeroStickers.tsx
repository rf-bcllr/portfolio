import { useEffect, useRef, useState } from "react";
import stickerBrazil from "@/assets/stickers/sticker-brazil-flag.png";
import stickerAmaya from "@/assets/stickers/sticker-amaya.png";
import stickerRamen from "@/assets/stickers/sticker-ramen.png";
import stickerGithub from "@/assets/stickers/sticker-github.png";
import { FigmaComment } from "./FigmaComment";

type StickerConfig = {
  src: string;
  alt: string;
  message: string;
  /** Position relative to the profile card */
  position: string;
  /** Where the comment pin sits on the sticker */
  pin: string;
  side: "left" | "right";
  rotate: number;
  delay: number;
};

const STICKERS: StickerConfig[] = [
  {
    src: stickerBrazil,
    alt: "Brazil flag sticker",
    message: "I'm Brazilian, but open to remote or on-site opportunities anywhere!",
    position: "-left-[300px] top-[24px]",
    pin: "-right-3 top-1",
    side: "right",
    rotate: -8,
    delay: -0.8,
  },
  {
    src: stickerAmaya,
    alt: "Sticker of Amaya, a black dog with a pink collar",
    message: "Amaya is my main design companion ❤️",
    position: "-left-[250px] top-[330px]",
    pin: "-right-2 top-3",
    side: "right",
    rotate: 6,
    delay: -3.1,
  },
  {
    src: stickerGithub,
    alt: "GitHub Octocat sticker",
    message: "I'm a designer that builds stuff.",
    position: "-right-[300px] top-[8px]",
    pin: "-left-3 top-2",
    side: "left",
    rotate: 7,
    delay: -1.9,
  },
  {
    src: stickerRamen,
    alt: "Ramen bowl sticker",
    message: "Like Naruto, I don't give up easily (and ramen is my favorite food).",
    position: "-right-[270px] top-[300px]",
    pin: "-left-2 top-4",
    side: "left",
    rotate: -6,
    delay: -4.4,
  },
];

function Sticker({ config, avatarSrc }: { config: StickerConfig; avatarSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false); // clicked open: stays open until clicked again, outside, or Esc
  const open = hovered || pinned;
  const toggle = () => setPinned((p) => !p);

  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setPinned(false);
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setPinned(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pinned]);

  return (
    <div
      ref={ref}
      className={`pointer-events-auto absolute ${config.position} ${open ? "z-10" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Floating pauses while the comment is open, so the pin and text hold still */}
      <div
        className="hero-float"
        style={{ animationDelay: `${config.delay}s`, animationPlayState: open ? "paused" : "running" }}
      >
        <img
          src={config.src}
          alt={config.alt}
          draggable={false}
          onClick={toggle}
          className="w-[150px] cursor-pointer drop-shadow-[0_14px_18px_hsl(222_18%_12%/0.16)] transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105"
          style={{ rotate: `${config.rotate}deg` }}
        />
        <FigmaComment
          avatarSrc={avatarSrc}
          authorName="Rafael Bacellar"
          message={config.message}
          open={open}
          onToggle={toggle}
          side={config.side}
          className={config.pin}
        />
      </div>
    </div>
  );
}

/** Desktop-only stickers floating around the profile card, each with a Figma-style comment. */
export function HeroStickers({ avatarSrc }: { avatarSrc: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
      {STICKERS.map((config) => (
        <Sticker key={config.alt} config={config} avatarSrc={avatarSrc} />
      ))}
    </div>
  );
}
