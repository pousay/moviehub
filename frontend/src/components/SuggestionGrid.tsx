import MovieCard from "./MovieCard";
import type { Movie } from "./MovieCard";

export default function SuggestionsGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="mt-6 w-full h-full">
      <div className="flex align-middle items-center justify-between mb-4">
        <h2>You might like</h2>
        <button className="text-[14px] transition-colors duration-150 text-white bg-transparent border-0 cursor-pointer transit">
          See all
        </button>
      </div>
      <div className="cards-grid grid grid-cols-2 gap-3">
        {movies.map((m) => (
          <MovieCard key={m.title} movie={m} />
        ))}
      </div>
    </div>
  );
}
