import { useState, useEffect, useCallback } from "react";
import { IconDownload } from "./Icons";

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const slides = [
    {
      img: "test",
      title: "test",
      tags: ["hello"],
      desc: "hello",
    },
  ];

  const current = slides[idx];

  const goTo = useCallback((next: number) => {
    setOpacity(0);

    setTimeout(() => {
      setIdx(next);
      setOpacity(1);
    }, 220);
  }, []);

  const slide = (dir: number) =>
    goTo((idx + dir + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => slide(1), 6000);
    return () => clearInterval(timer);
  }, [idx]);

  return (
    <div className="hero-height relative h-[280px] cursor-pointer overflow-hidden rounded-2xl">
      <img
        src={current.img}
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

        {current.tags && (
          <div className="mb-3.5 flex gap-2">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mb-[10px] whitespace-pre-line text-[clamp(20px,3vw,32px)] font-extrabold leading-[1.15] tracking-[-0.02em]">
          {current.title}
        </h1>

        <p className="hidden-mobile mb-5 line-clamp-3 text-sm leading-6 text-white/60">
          {current.desc}
        </p>

        <div className="flex items-center gap-2.5">
          <button className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-150">
            <IconDownload />
            Download
          </button>
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

      {/* Dots */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5">
        {slides.map((_, i) => (
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
