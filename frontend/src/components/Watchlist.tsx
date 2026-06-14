import { IconPlay } from "./Icons";

interface ContinueItem {
  name: string;
  img: string;
}

export default function WatchListPanel({ items }: { items: ContinueItem[] }) {
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
          key={item.name}
          className="
            mx-1 flex cursor-pointer items-center gap-3
            border-b border-red-600/10
            px-[18px] py-[10px]
            transition-colors duration-150
          "
        >
          <img
            src={item.img}
            alt={item.name}
            className="
              h-[52px] w-[52px]
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
              {item.name}
            </p>
          </div>

          <button
            className="
              flex h-7 w-7 shrink-0
              cursor-pointer items-center justify-center
              rounded-full border-0
              bg-white/10
              text-[12px] text-red-600
              transition-colors duration-150
            "
          >
            <IconPlay size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}
