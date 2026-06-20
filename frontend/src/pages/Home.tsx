import { useEffect, useState } from "react";
import SuggestionsGrid from "../components/SuggestionGrid";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import WatchListPanel from "../components/Watchlist";
import HeroSlider from "../components/Hero";
import { fetcher } from "../api/base";

export default function Page() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const [media, setMedia] = useState([]);

  const fetchMedia = async () => {
    try {
      const response = await fetcher.get("/media/random?count=4&min_rate=9");
      setMedia(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0f] font-['Inter',sans-serif] text-[#f0f0f5]">
      <div className="bg-cinematic" />

      <div className="fixed inset-0 z-0 bg-black/20" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

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
              <WatchListPanel items={media} />
            </aside>

            <div>
              <HeroSlider media={media} />
              <SuggestionsGrid media={media} />
            </div>
          </div>
        </main>

        {/* <MobileNav activeNav={activeNav} onNavChange={setActiveNav} /> */}
      </div>
    </div>
  );
}
