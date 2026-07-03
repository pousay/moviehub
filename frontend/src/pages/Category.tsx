import { useEffect, useState } from "react";
import SuggestionsGrid from "../components/SuggestionGrid";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MediaService from "../api/media";
import type { Media } from "../types/media";
import { useNavigate, useParams } from "react-router-dom";

export default function Category() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const { filter } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    switch (filter) {
      case "all":
        break;
      case "movies":
        break;
      case "series":
        break;
      default:
        navigate("/all/all");

        break;
    }
    const fetchMedia = async () => {
      try {
        const response = await MediaService.getRandom(30, 8);
        setMedia(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedia();
  }, [filter]);

  return (
    <>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mt-17 min-h-[calc(100vh-68px)] w-full p-4 pb-20 sm:ml-18 sm:p-7 sm:pb-7">
        {media && <SuggestionsGrid only_list={true} media={media} />}
        {/* <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr]"> */}
        {/* <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "sticky",
              top: 20,
            }}
            className="left-panel"
          ></aside> */}

        {/* <div> */}
        {/* </div> */}
        {/* </div> */}
      </main>
    </>
  );
}
