import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import MediaHero from "../components/MediaHero";
import { fetcher } from "../api/base";
import type { Media } from "../types/media";
import MediaPoster from "../components/MediaPoster";
import Toast from "../components/Toast";
import Comments from "../components/Comment";
import DownloadLinks from "../components/DownloadLink";
import MediaDetails from "../components/MediaDetails";
export default function Media() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const { id } = useParams();

  const [media, setMedia] = useState<Media>({});

  const fetchMedia = async () => {
    try {
      const response = await fetcher.get(`/media/get?media_id=${id}`);
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
        <main className="sm:ml-[72px] mt-[68px] w-full pb-24 sm:pb-10">
          <MediaHero media={media} />
          <div className="px-4 sm:px-8 -mt-32 sm:-mt-40 relative">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              <MediaPoster media={media} onToast={() => {}} />
              <MediaDetails media={media} onToast={() => {}} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
