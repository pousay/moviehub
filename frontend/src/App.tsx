import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Media from "./pages/Media";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Category from "./pages/Category";
export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0f] font-['Inter',sans-serif] text-[#f0f0f5]">
      <div className="bg-cinematic" />

      <div className="fixed inset-0 z-0 bg-black/20" />
      <div className="relative z-10 flex min-h-screen w-full justify-center align-middle">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all/:filter" element={<Category />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/media/:id" element={<Media />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
        </Routes>
      </div>
    </div>
  );
}
