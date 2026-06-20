import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetcher = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const clearAndRedirect = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

fetcher.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");

      // no refresh token at all → session is fully dead
      if (!refresh) {
        clearAndRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/user/refresh`, {
          refresh_token: refresh,
        });
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return fetcher(original);
      } catch {
        clearAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);