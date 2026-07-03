// services/media.service.ts
import { fetcher } from "./base";
import type { Media } from "../types/media";

export enum MediaFilter {
  all = "all",
  movie = "movie",
  series = "series",
}

const MediaService = {
  getRandom: (count = 4, minRate = 7, filter: MediaFilter = MediaFilter.all) =>
    fetcher
      .get<Media[]>("/media/random", {
        params: {
          count,
          min_rate: minRate,
          media_type: filter,
        },
      })
      .then((r) => r.data),
};

export default MediaService;
