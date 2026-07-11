import { useEffect, useState } from "react";
import SuggestionsGrid from "../components/SuggestionGrid";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import WatchListPanel from "../components/Watchlist";
import HeroSlider from "../components/Hero";
import MediaService from "../api/media";
import type { Media } from "../types/media";

export default function Home() {
  const [activeNav, setActiveNav] = useState(0);

  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await MediaService.getRandom(12, 9);
        setMedia(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedia();
  }, []);

  return (
    <>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <Navbar />

      <main className="mt-17 min-h-[calc(100vh-68px)] w-full p-4 pb-20 sm:ml-18 sm:p-7 sm:pb-7">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr]">
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "sticky",
              top: 20,
            }}
            className="left-panel"
          >
            {media && <WatchListPanel items={media.slice(0, 4)} />}
          </aside>

          <div>
            <HeroSlider media={media.slice(4, 8)} />
            <SuggestionsGrid media={media.slice(8)} />
          </div>
        </div>
      </main>

      {/* <MobileNav activeNav={activeNav} onNavChange={setActiveNav} /> */}
    </>
  );
}
