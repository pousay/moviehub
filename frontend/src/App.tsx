import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Login from "./pages/Login";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/media/:id" element={<Media />} />
      <Route path="*" element={<Navigate to="/" replace />} />{" "}
    </Routes>
  );
}
