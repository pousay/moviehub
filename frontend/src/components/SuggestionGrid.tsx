import type { Media } from "../types/media";
import MovieCard from "./MovieCard";

export default function SuggestionsGrid({ media }: { media: Media[] }) {
  return (
    <div className="mt-6 w-full h-full">
      <div className="flex align-middle items-center justify-between mb-4">
        <h2 className="text-white font-bold text-[18px]">You might like</h2>
        <button className="hover:text-white px-3 py-2 rounded-tl-2xl rounded-br-2xl hover:font-bold hover:bg-red-500 text-[14px] transition-colors duration-150 text-white/50 bg-transparent border-0 cursor-pointer transit">
          See all
        </button>
      </div>
      <div className="cards-grid grid grid-cols-2 gap-3">
        {media && media.map((m) => <MovieCard key={m.id} media={m} />)}
      </div>
    </div>
  );
}
