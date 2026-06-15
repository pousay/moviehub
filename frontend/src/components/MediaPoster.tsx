import { useState } from "react";
import type { Media } from "../types/media";

interface MediaPosterProps {
  media: Media;
  onToast: (msg: string) => void;
}

export default function MediaPoster({ media, onToast }: MediaPosterProps) {
  const [isFav, setIsFav] = useState(false);

  const toggleFav = () => {
    setIsFav((prev) => {
      const next = !prev;
      onToast(next ? "Added to favourites" : "Removed from favourites");
      return next;
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    onToast("Page link copied!");
  };

  return (
    <div className="mx-auto shrink-0 lg:mx-0">
      {/* Poster image */}
      <div className="poster-glow relative w-[290px] overflow-hidden rounded-2xl sm:w-[400px] lg:w-[250px]">
        <img
          src={media.poster}
          alt={media.title}
          className="block aspect-[2/3] w-full object-cover"
        />
        {/* Rank badge — only show if rank data exists */}
        <div className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e84040] text-xs font-black text-white">
          #5
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-3 flex w-[160px] gap-2 sm:w-[200px]">
        <button
          onClick={toggleFav}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.07] text-xs font-medium transition-colors hover:bg-white/10"
        >
          <svg
            width="14"
            height="14"
            fill={isFav ? "#e84040" : "none"}
            stroke={isFav ? "#e84040" : "currentColor"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          Save
        </button>

        <button
          onClick={handleShare}
          className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.07] text-xs font-medium transition-colors hover:bg-white/10"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
