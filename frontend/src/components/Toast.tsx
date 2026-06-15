import { useEffect, useState } from "react";

interface ToastProps {
  message: string | null;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2400);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  return (
    <div
      className="fixed bottom-20 sm:bottom-8 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#1a1a24] px-5 py-2.5 text-sm font-medium text-[#f0f0f5] pointer-events-none transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? "0px" : "8px"})`,
      }}
    >
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="#6ee7b7"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
