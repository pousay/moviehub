import { IconSearch, IconBell } from "./Icons";

interface NavbarProps {
  activeTab: number;
  onTabChange: (idx: number) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = ["All", "Movies", "TV Series"];

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-[99]
        flex h-[68px] items-center gap-4
        border-b border-white/10
        bg-[rgba(10,10,15,0.75)]
        px-4 backdrop-blur-[20px]
        sm:left-[72px] sm:px-7
      "
    >
      <div className="relative max-w-[320px] flex-1">
        <span
          className="
            pointer-events-none absolute
            top-1/2 left-[14px]
            flex -translate-y-1/2
            opacity-40
          "
        >
          <IconSearch />
        </span>

        <input
          type="text"
          placeholder="Search movies, series..."
          className="
            search-input
            h-10 w-full
            rounded-full
            border border-white/15
            bg-white/10
            px-4 pl-10
            text-sm text-[#f0f0f5]
            transition-all duration-200
            outline-none
            placeholder:text-white/40
          "
        />
      </div>

      <nav className="hidden-mobile ml-2 flex gap-1">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => onTabChange(i)}
            className={`
              nav-tab
              h-9 cursor-pointer rounded-full border-0
              px-[18px] text-sm font-medium
              transition-all duration-150
              ${
                activeTab === i
                  ? "active"
                  : "bg-transparent text-[rgba(240,240,245,0.45)]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="
            relative flex h-[38px] w-[38px]
            cursor-pointer items-center justify-center
            rounded-full border-0
            bg-white/10 text-[#f0f0f5]
            transition-colors duration-150
          "
        >
          <IconBell />

          <span
            className="
              absolute top-[7px] right-[7px]
              h-[7px] w-[7px]
              rounded-full
              border-2 border-[#0a0a0f]
              bg-[#e84040]
            "
          />
        </button>

        <div
          className="
            flex cursor-pointer items-center gap-[10px]
            rounded-full border border-white/15
            bg-white/10
            py-[5px] pr-[14px] pl-[5px]
            transition-colors duration-150
          "
        >
          <div
            className="
              avatar-grad
              flex h-[30px] w-[30px] shrink-0
              items-center justify-center
              rounded-full
              text-xs font-bold text-white
            "
          >
            AM
          </div>

          <div className="hidden-mobile leading-none">
            <p className="mb-1 text-[13px] font-semibold">Arfi Maulana</p>

            <p className="m-0 text-[11px] text-[rgba(240,240,245,0.45)]">
              @arfimaulana_
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
