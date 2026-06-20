// services/media.service.ts
import { fetcher } from "./base";
import type { Media } from "../types/media";

const MediaService = {
  getRandom: (count = 4, minRate = 7) =>
    fetcher
      .get<Media[]>("/media/random", { params: { count, min_rate: minRate } })
      .then((r) => r.data),
};

export default MediaService;