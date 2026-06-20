// // services/media.service.ts
// import { fetcher } from "./base";

// export interface Media { /* your fields */ }

// const MediaService = {
//   getAll: (params?: Record<string, unknown>) =>
//     fetcher.get<Media[]>("/media/get", { params }).then(r => r.data),

//   getById: (id: number) =>
//     fetcher.get<Media>(`/media/${id}`).then(r => r.data),
// };

// export default MediaService;