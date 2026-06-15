import { useState, useMemo, useEffect } from "react";
import type { Media, DownloadLink, SeasonData } from "../types/media";

interface DownloadLinksProps {
  media: Media;
  onToast: (msg: string) => void;
}

type AudioType = "sub" | "dub";

const QUALITY_CLASS: Record<string, string> = {
  "4K": "q-4k",
  "1080p": "q-1080p",
  "720p": "q-720p",
  "480p": "q-480p",
};

// Helper to group links by quality for the UI
function groupByQuality(links: DownloadLink[]): [string, DownloadLink[]][] {
  const map: Record<string, DownloadLink[]> = {};
  for (const link of links) {
    if (!map[link.quality]) map[link.quality] = [];
    map[link.quality].push(link);
  }
  return Object.entries(map);
}

export default function DownloadLinks({ media, onToast }: DownloadLinksProps) {
  // 1. Transform flat media.links into structured SeasonData arrays
  const seasons = useMemo<SeasonData[]>(() => {
    // SAFETY CHECK: If media is undefined, or links doesn't exist/isn't an array, return early.
    if (!media?.links || !Array.isArray(media.links)) {
      return [];
    }

    const seasonMap = new Map<number, SeasonData>();

    media.links.forEach((link) => {
      // Fallback to season 1 if backend doesn't provide a season (e.g., for movies)
      const seasonNum = link.season ?? 1;

      if (!seasonMap.has(seasonNum)) {
        seasonMap.set(seasonNum, {
          season: seasonNum,
          softsub_links: [],
          dubbed_links: [],
        });
      }

      const seasonObj = seasonMap.get(seasonNum)!;
      const formattedLink: DownloadLink = {
        quality: link.quality,
        codec: link.codec,
        url: link.url,
        size: link.size,
      };

      // Categorize by language type
      const lang = link.language?.toLowerCase() || "";
      if (lang.includes("dub")) {
        seasonObj.dubbed_links.push(formattedLink);
      } else {
        seasonObj.softsub_links.push(formattedLink);
      }
    });

    // Return an array sorted by season number
    return Array.from(seasonMap.values()).sort((a, b) => a.season - b.season);
  }, [media?.links]); // Safely track dependencies

  // 2. Safely initialize state
  const [activeSeason, setActiveSeason] = useState(seasons[0]?.season ?? 1);
  const [audio, setAudio] = useState<AudioType>("sub");

  // Keep active season synced if the media changes
  useEffect(() => {
    if (seasons.length > 0) {
      setActiveSeason(seasons[0].season);
      setAudio("sub");
    }
  }, [seasons]);

  // 3. Fallback UI if there are no links available at all
  if (!seasons || seasons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        <p className="text-sm text-[#f0f0f5]/50">
          No download links available for this title.
        </p>
      </div>
    );
  }

  // 4. Derive current display data
  const currentSeasonData =
    seasons.find((s) => s.season === activeSeason) || seasons[0];
  const hasDub = currentSeasonData.dubbed_links.length > 0;
  const activeLinks =
    audio === "sub"
      ? currentSeasonData.softsub_links
      : currentSeasonData.dubbed_links;
  const groups = groupByQuality(activeLinks);

  const handleSeasonChange = (num: number) => {
    setActiveSeason(num);
    const newSeasonData = seasons.find((s) => s.season === num);
    if (newSeasonData && !newSeasonData.dubbed_links.length) {
      setAudio("sub"); // Revert to sub if no dubbed links exist for the newly selected season
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    onToast("Link copied to clipboard");
  };

  return (
    <div>
      {/* Season selector */}
      {seasons.length > 1 && (
        <div className="mb-5">
          <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-[#f0f0f5]/40">
            Season
          </p>
          <div className="flex flex-wrap gap-2">
            {seasons.map((s) => (
              <button
                key={s.season}
                onClick={() => handleSeasonChange(s.season)}
                className={`season-pill h-8 cursor-pointer rounded-full border border-white/[0.08] px-4 text-xs font-semibold ${
                  s.season === activeSeason
                    ? "active bg-[#e84040] text-white"
                    : "bg-white/[0.05] text-[#f0f0f5]/60"
                }`}
              >
                S{String(s.season).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub / Dub toggle */}
      <div className="mb-5 flex w-fit items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.05] p-1">
        <button
          onClick={() => setAudio("sub")}
          className={`h-8 cursor-pointer rounded-[10px] px-4 text-xs font-semibold transition-all ${
            audio === "sub"
              ? "bg-white/[0.1] text-[#f0f0f5]"
              : "text-[#f0f0f5]/40 hover:text-[#f0f0f5]"
          }`}
        >
          Soft Sub
        </button>
        <button
          onClick={() => hasDub && setAudio("dub")}
          disabled={!hasDub}
          className={`h-8 rounded-[10px] px-4 text-xs font-semibold transition-all ${
            audio === "dub"
              ? "bg-white/[0.1] text-[#f0f0f5]"
              : "text-[#f0f0f5]/40 hover:text-[#f0f0f5]"
          } ${!hasDub ? "cursor-not-allowed opacity-30" : "cursor-pointer"}`}
        >
          Dubbed
        </button>
      </div>

      {/* Links list */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111118]/80 backdrop-blur-xl">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              width="36"
              height="36"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="mb-3"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <p className="text-sm text-[#f0f0f5]/30">
              No {audio === "sub" ? "soft-sub" : "dubbed"} links for this season
            </p>
          </div>
        ) : (
          groups.map(([quality, items], gi) => (
            <div
              key={quality}
              className={gi > 0 ? "border-t border-white/[0.06]" : ""}
            >
              {/* Quality group header */}
              <div className="flex items-center gap-2 px-4 pb-2 pt-3.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${QUALITY_CLASS[quality] ?? "q-480p"}`}
                >
                  {quality}
                </span>
                <span className="text-xs text-[#f0f0f5]/30">
                  {items.length} option{items.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Rows */}
              {items.map((link, li) => (
                <div
                  key={link.url}
                  className={`dl-row flex items-center gap-3 px-4 py-3 ${
                    li < items.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {/* codec error here because of script to insert database*/}
                      {link.url.split("/").at(-1)?.replaceAll(".", " ")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#f0f0f5]/40">
                      <span>{link.size ?? "—"}</span>
                      <span className="text-[#f0f0f5]/20">·</span>
                      <span>.mkv</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => copyLink(link.url)}
                      title="Copy link"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-white/[0.05] transition-colors hover:bg-white/10"
                    >
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                    </button>

                    <a
                      href={link.url}
                      download
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-[#e84040]/30 bg-[#e84040]/20 px-3 text-xs font-semibold text-[#ff6b6b] no-underline transition-colors hover:bg-[#e84040]/30"
                    >
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
