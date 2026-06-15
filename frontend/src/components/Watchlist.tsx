import type { Media } from "../types/media";
import { IconPlay } from "./Icons";

export default function WatchListPanel({ items }: { items: Media[] }) {
  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-white/10
        bg-[rgba(17,17,24,0.8)]
        backdrop-blur-[20px]
      "
    >
      <div className="px-[18px] py-4">
        <span className="text-sm font-semibold">Watch List</span>
      </div>

      {items.map((item) => (
        <div
          key={item.title}
          className="
            mx-1 flex cursor-pointer items-center gap-3
            border-b border-red-600/10
            px-[18px] py-[10px]
            transition-colors duration-150
          "
        >
          <img
            src={item.backdrop}
            alt={item.title}
            className="
              h-[62.5px] w-[62.5px]
              shrink-0 rounded-[10px]
              object-cover
            "
          />

          <div className="min-w-0 flex-1">
            <p
              className="
                truncate text-[13px]
                font-medium
              "
            >
              {item.title}
            </p>
          </div>

          <button
            className="
            hover:scale-125 ease-linear transition-transform duration-100
              flex h-8 w-8 shrink-0
              cursor-pointer items-center justify-center
              rounded-full border-0
              bg-white/10 pl-1
             text-red-500
              transition-colors duration-150
            "
          >
            <IconPlay size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
