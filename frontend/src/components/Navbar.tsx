import { useEffect, useState } from "react";
import { fetcher } from "../api/base";
import { IconSearch, IconBell } from "./Icons";
import type { Profile } from "../types/profile";
import { Link } from "react-router-dom";

interface NavbarProps {
  activeTab: number;
  onTabChange: (idx: number) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = ["All", "Movies", "TV Series"];
  const [user, setUser] = useState<Profile | null>(null);

  const fetchPFP = async () => {
    try {
      const response = await fetcher.get("/user/profile");
      setUser(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    

    fetchPFP();
  }, []);

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
              h-9 cursor-pointer rounded-2xl border-0
              hover:rounded-tl-2xl hover:rounded-br-2xl hover:rounded-bl-[0px] hover:rounded-tr-[0px]
              px-[18px] mx-1 text-sm font-medium
              transition-all duration-300 ease-linear
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
        {2 === 3 && (
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
        )}
        {2 === 2 ? (
          <Link
            to="login"
            className="bg-red-500 text-center flex items-center justify-center align-middle rounded mx-2 px-3 py-1  hover:scale-105 cursor-pointer"
          >
            login
          </Link>
        ) : (
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
              bg-red-500
              flex h-[30px] w-[30px] shrink-0
              items-center justify-center
              rounded-full
              text-xs font-bold text-white
            "
            >
              <div className="w-10 h-10 text-center flex items-center justify-center align-middle rounded-full cursor-pointer m-2">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="pointer-events-none"
                >
                  <circle cx="20" cy="14" r="7" fill="#6B7280" />
                  <ellipse cx="20" cy="34" rx="12" ry="9" fill="#6B7280" />
                </svg>
              </div>{" "}
            </div>

            <div className="hidden-mobile leading-none">
              <p className="mb-1 text-[13px] font-semibold">
                {user?.fullname ? user.fullname : "User"}
              </p>

              <p className="m-0 text-[11px] text-[rgba(240,240,245,0.45)]">
                @{user?.username}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
