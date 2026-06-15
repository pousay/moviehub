import { useState } from "react";
import DownloadLinks from "./DownloadLink";
import type { Media } from "../types/media";

type Tab = "downloads" | "comments";
type AudioMode = "sub" | "dub";

export default function MediaDetails({
  media,
  onToast,
}: {
  media: Media;
  onToast: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("downloads");

  return (
    <>
      {media && (
        <div className="min-w-0 flex-1 pt-2 lg:pt-16">
          <div className="mb-3 flex flex-wrap items-start gap-3">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="bg-brand/20 border-brand/30 text-brand-light rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                  {media.type}
                </span>
                <span className="text-[11px] text-[#f0f0f5]/40">
                  {media.year} · {media.country}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
                {media.title}
              </h1>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-[#fbbf24]">
                {media.imdb_rate}
              </span>
              <span className="mt-0.5 text-xs text-[#f0f0f5]/40">/ 10</span>
            </div>
            <span className="text-[#f0f0f5]/20">·</span>
            <span className="text-sm text-[#f0f0f5]/50">
              <span className="font-medium text-[#f0f0f5]/80">
                {media.imdb_votes && media.imdb_votes.toLocaleString()}
              </span>{" "}
              votes
            </span>
            <span className="text-[#f0f0f5]/20">·</span>
            <div className="flex items-center gap-1.5 text-sm text-[#f0f0f5]/50">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                ~{media.duration} minute {media.type === "series" ? "/ ep" : ""}
              </span>
            </div>
            {media.type === "series" && (
              <>
                <span className="text-[#f0f0f5]/20">·</span>
                <div className="flex items-center gap-1.5 text-sm text-[#f0f0f5]/50">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="7" width="20" height="15" rx="2" />
                    <polyline points="17 2 12 7 7 2" />
                  </svg>
                  <span>
                    {media.total_seasons} Seasons · {media.total_episodes}{" "}
                    Episodes
                  </span>
                </div>
              </>
            )}
          </div>

          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#f0f0f5]/60">
            {media.overview}
          </p>

          {/* Tabs */}
          <div className="mb-6 flex gap-6 border-b border-white/[0.08]">
            <button
              className={`cursor-pointer border-0 bg-transparent pb-3 text-sm font-semibold transition-colors ${
                activeTab === "downloads"
                  ? "text-[#f0f0f5]"
                  : "text-[#f0f0f5]/40 hover:text-[#f0f0f5]/80"
              }`}
              onClick={() => setActiveTab("downloads")}
            >
              Downloads
            </button>
            <button
              className={`cursor-pointer border-0 bg-transparent pb-3 text-sm font-semibold transition-colors ${
                activeTab === "comments"
                  ? "text-[#f0f0f5]"
                  : "text-[#f0f0f5]/40 hover:text-[#f0f0f5]/80"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              Comments
              <span className="ml-1 text-xs text-[#f0f0f5]/30">(4)</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "downloads" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-5" id="season-selector">
                {media.type === "series" && (
                  <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-[#f0f0f5]/40">
                    Season
                  </p>
                )}
                <div className="flex flex-wrap gap-2" id="season-pills">
                  {/* Map seasons here */}
                </div>
              </div>
              <DownloadLinks media={media} onToast={onToast} />
            </div>
          )}

          {activeTab === "comments" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-[#f0f0f5]/60">
                Comments section goes here...
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
