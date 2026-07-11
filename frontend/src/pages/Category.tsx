import { useEffect, useState } from "react";
import SuggestionsGrid from "../components/SuggestionGrid";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MediaService, { MediaFilter } from "../api/media";
import { useNavigate, useParams } from "react-router-dom";
import type { Media } from "../types/media";

export default function Category() {
  const [activeNav, setActiveNav] = useState(0);

  const [media, setMedia] = useState<Media[]>([]);

  const { filter } = useParams();
  const navigate = useNavigate();

  const mediaFilter =
    filter === "movies"
      ? MediaFilter.movie
      : filter === "series"
        ? MediaFilter.series
        : MediaFilter.all;

  useEffect(() => {
    if (!["all", "movies", "series"].includes(filter ?? "")) {
      navigate("/category/all", { replace: true });
      return;
    }

    const fetchMedia = async () => {
      const response = await MediaService.getRandom(30, 8, mediaFilter);
      setMedia(response);
    };

    fetchMedia();
  }, [mediaFilter, filter, navigate]);

  return (
    <>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <Navbar />

      <main className="mt-17 min-h-[calc(100vh-68px)] w-full p-4 pb-20 sm:ml-18 sm:p-7 sm:pb-7">
        {media && <SuggestionsGrid only_list={true} media={media} />}
      </main>
    </>
  );
}
