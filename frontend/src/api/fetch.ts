import axios from 'axios';
import { token } from "./env";

const API_BASE_URL = "http://127.0.0.1:8000";

export const fetcher = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});