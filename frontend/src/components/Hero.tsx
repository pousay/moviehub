import { useState, useEffect, useCallback } from "react";
import { IconDownload } from "./Icons";
import type { Media } from "../types/media";
import { Link } from "react-router-dom";

export default function HeroSlider({ media }: { media: Media[] }) {
  const [idx, setIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [current, setCurrent] = useState<Media | null>(null);

  const goTo = useCallback((next: number) => {
    setOpacity(0);
    setTimeout(() => {
      setIdx(next);
      setOpacity(1);
    }, 220);
  }, []);

  const slide = useCallback(
    (dir: number) => {
      goTo((idx + dir + media.length) % media.length);
    },
    [idx, media.length, goTo],
  );

  useEffect(() => {
    setCurrent(media[idx]);
    const timer = setInterval(() => slide(1), 6000);
    return () => clearInterval(timer);
  }, [idx, media, slide]);

  if (!current) return null;

  return (
    <div className="hero-height relative h-[280px] cursor-pointer overflow-hidden rounded-2xl">
      <img
        src={current.backdrop}
        alt={current.title}
        className="hero-img block h-full w-full object-cover transition-all duration-500 ease-in-out"
        style={{ opacity }}
      />

      <div className="hero-gradient" />

      {/* Content */}
      <div className="hero-content absolute bottom-5 left-5 max-w-[420px]">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#e8404066] bg-[#e8404040] px-3 py-1 text-[11px] font-semibold tracking-[0.05em] text-[#ff6b6b]">
          🔥 Now Trending
        </div>

        {current.genres && (
          <div className="mb-3.5 flex gap-2">
            {current.genres.split(",").map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <h1 className="mb-[10px] whitespace-pre-line text-[clamp(20px,3vw,32px)] font-extrabold leading-[1.15] tracking-[-0.02em]">
          {current.title}
        </h1>

        <p className="hidden-mobile line-clamp-5 mb-5 text-sm leading-6 text-white/60">
          {current.overview.slice(0, 300)}
          {current.overview.length > 300 && "..."}
        </p>

        <div className="flex items-center gap-2.5">
          <Link
            to={`media/${current.id}`}
            className="hover:scale-105 ease-linear transition-transform duration-100 flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-150"
          >
            <IconDownload />
            Download
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <div className="hero-arrows absolute right-4 bottom-5 flex gap-2">
        {[-1, 1].map((dir) => (
          <button
            key={dir}
            onClick={(e) => {
              e.stopPropagation();
              slide(dir);
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white backdrop-blur-md transition-colors duration-150"
          >
            {dir === -1 ? "‹" : "›"}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-5 flex items-center gap-1.5">
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-1.5 rounded-full border-none p-0 transition-all duration-300"
            style={{
              width: i === idx ? 16 : 6,
              background: i === idx ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
