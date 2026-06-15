import type { Media } from "../types/media";
import { IconPlay } from "./Icons";

export interface Movie {
  img: string;
  title: string;
  genre: string;
  desc: string;
}

export default function MovieCard({ media }: { media: Media }) {
  return (
    <div className="movie-card group relative aspect-2/3 cursor-pointer overflow-hidden rounded-[14px]">
      <img
        className="card-img block h-full w-full object-cover transition-transform duration-300"
        src={media.poster}
        alt={media.title}
        loading="lazy"
      />

      <button
        className="
          card-dots
          absolute top-2.5 right-2.5
          flex h-7 w-7 items-center justify-center
          rounded-full border-0
          bg-black/50 text-sm text-white
          opacity-0 backdrop-blur-xs
          transition-opacity duration-200
        "
      >
        ···
      </button>

      <div
        className="
          card-overlay card-gradient
          absolute inset-0
          flex flex-col justify-end
          p-[14px]
          opacity-0
          transition-opacity duration-300
        "
      >
        <div className="flex flex-wrap justify-center w-fit overflow-clip">
          {media.genres.split(",").map((genre, index) => (
            <span
              key={index}
              className="mb-1 w-fit text-nowrap inline-block rounded-full bg-white/15 px-2 py-[3px] text-[10px] font-semibold"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="mb-1 text-[13px] font-bold">{media.title}</p>

        <p
          className="mb-2.5 text-[11px] leading-[1.4] text-white/60"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {media.overview}
        </p>

        <div className="flex justify-end">
          <button
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full border-0
              bg-white/95 text-sm text-black
            "
          >
            <IconPlay />
          </button>
        </div>
      </div>
    </div>
  );
}
