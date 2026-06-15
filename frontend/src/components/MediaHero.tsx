import type { Media } from "../types/media";

export default function MediaHero({ media }: { media: Media }) {
  return (
    <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px]">
      <img
        src="/chairs.jpeg"
        alt={media.title}
        className="block h-full w-full object-cover object-top"
      />

      {/* bottom-to-top fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,1) 100%)",
        }}
      />
      {/* left vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,15,0.7) 0%, transparent 60%)",
        }}
      />

      {/* Breadcrumb */}
      <div className="absolute top-5 left-5 flex items-center gap-2 text-xs text-[#f0f0f5]/50 sm:left-8">
        <span className="cursor-pointer transition-colors hover:text-[#f0f0f5]">
          Home
        </span>
        <span>/</span>
        <span className="cursor-pointer transition-colors hover:text-[#f0f0f5]">
          {media.type === "series" ? "Series" : "Movies"}
        </span>
        <span>/</span>
        <span className="text-[#f0f0f5]">{media.title}</span>
      </div>
    </div>
  );
}
