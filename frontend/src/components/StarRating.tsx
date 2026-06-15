interface StarRatingProps {
  rating: number; // e.g. 9.2
}

export default function StarRating({ rating }: StarRatingProps) {
  const filled = Math.round(rating / 2);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < filled ? "#fbbf24" : "none"}
            stroke={i < filled ? "#fbbf24" : "rgba(255,255,255,0.2)"}
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <span className="text-xl font-bold text-[#fbbf24]">{rating}</span>
      <span className="mt-0.5 text-xs text-[#f0f0f5]/40">/ 10</span>
    </div>
  );
}
