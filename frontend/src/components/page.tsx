"use client";

import { useState, useEffect, useCallback } from "react";

/** Cinematic blurred backdrop */
const CinematicBackground = () => (
  <>
    <div className="bg-cinematic" />
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "rgba(0,0,0,0.2)",
      }}
    />
  </>
);

// ── Navbar ───────────────────────────────────────────────────────────────────

// ── Movie Card ────────────────────────────────────────────────────────────────

// ── Suggestions Grid ──────────────────────────────────────────────────────────

const SuggestionsGrid = ({ movies }: { movies: Movie[] }) => (
  <div style={{ marginTop: 24 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
        You might like
      </h2>
      <button
        style={{
          fontSize: 14,
          color: "rgba(240,240,245,0.45)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "color 0.15s",
        }}
      >
        See all
      </button>
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12,
      }}
      className="cards-grid"
    >
      {movies.map((m) => (
        <MovieCard key={m.title} movie={m} />
      ))}
    </div>
  </div>
);

// ── Trailer Card ──────────────────────────────────────────────────────────────

const TrailerCard = ({ trailer }: { trailer: TrailerItem }) => (
  <div
    className="trailer-card"
    style={{
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      marginTop: 2,
    }}
  >
    <img
      className="trailer-img"
      src={trailer.img}
      alt={trailer.title}
      style={{
        width: "100%",
        height: 100,
        objectFit: "cover",
        display: "block",
        transition: "transform 0.3s",
      }}
    />
    <div
      className="trailer-gradient"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "10px 12px",
      }}
    >
      <span
        style={{ fontSize: 12, fontWeight: 600, maxWidth: "calc(100% - 40px)" }}
      >
        {trailer.title}
      </span>
      <button
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#ef4444",
          fontSize: 14,
          border: "none",
          cursor: "pointer",
        }}
      >
        <IconPlay size={12} />
      </button>
    </div>
  </div>
);

// ── New Trailers Panel ────────────────────────────────────────────────────────

const NewTrailersPanel = ({ trailers }: { trailers: TrailerItem[] }) => (
  <div
    style={{
      background: "rgba(17,17,24,0.8)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600 }}>🔥 New Trailer</span>
    </div>
    {trailers.map((t) => (
      <TrailerCard key={t.title} trailer={t} />
    ))}
  </div>
);

// ── Watch List Panel ──────────────────────────────────────────────────────────

const WatchListPanel = ({ items }: { items: ContinueItem[] }) => (
  <div
    style={{
      background: "rgba(17,17,24,0.8)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <div style={{ padding: "16px 18px" }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>Watch List</span>
    </div>
    {items.map((item) => (
      <div
        key={item.name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px",
          cursor: "pointer",
          borderBottom: "1px solid rgba(220,38,38,0.1)",
          transition: "background 0.15s",
          margin: "0 4px",
        }}
      >
        <img
          src={item.img}
          alt={item.name}
          style={{
            width: 52,
            height: 52,
            borderRadius: 10,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </p>
        </div>
        <button
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: 12,
            transition: "background 0.15s",
          }}
        >
          <IconPlay size={10} />
        </button>
      </div>
    ))}
  </div>
);

// ── Left Panel ────────────────────────────────────────────────────────────────

const LeftPanel = () => (
  <aside
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: "sticky",
      top: 20,
    }}
    className="left-panel"
  >
    <NewTrailersPanel trailers={TRAILERS} />
    <WatchListPanel items={CONTINUE_DATA} />
  </aside>
);

// ── Mobile Bottom Nav ─────────────────────────────────────────────────────────

interface MobileNavProps {
  activeNav: number;
  onNavChange: (idx: number) => void;
}

const MobileNav = ({ activeNav, onNavChange }: MobileNavProps) => {
  const items = [
    { label: "Home", icon: <IconHome /> },
    { label: "Search", icon: <IconSearch size={22} /> },
    { label: "Saved", icon: <IconHeart /> },
    { label: "Profile", icon: <IconUser /> },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        zIndex: 100,
      }}
      className="mobile-nav"
    >
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => onNavChange(i)}
          className={`mob-btn${activeNav === i ? " active" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "transparent",
            border: "none",
            color: activeNav === i ? "#e84040" : "rgba(240,240,245,0.45)",
            cursor: "pointer",
            padding: "6px 16px",
          }}
        >
          {item.icon}
          <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ─── RESPONSIVE STYLE INJECTION ──────────────────────────────────────────────

const ResponsiveStyles = () => (
  <style>{`

  `}</style>
);

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <GlobalStyles />
      <ResponsiveStyles />

      <div
        style={{
          background: "#0a0a0f",
          color: "#f0f0f5",
          minHeight: "100vh",
          overflowX: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <CinematicBackground />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

          <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

          <main
            style={{
              marginTop: 68,
              padding: 16,
              minHeight: "calc(100vh - 68px)",
              paddingBottom: 80,
              width: "100%",
            }}
            className="sm-main"
          >
            <style>{`
              @media (min-width: 640px) {
                .sm-main { margin-left: 72px !important; padding: 28px !important; padding-bottom: 28px !important; }
              }
            `}</style>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 24,
                alignItems: "start",
              }}
              className="main-grid"
            >
              <style>{`
                @media (min-width: 1024px) {
                  .main-grid { grid-template-columns: 280px 1fr !important; }
                }
              `}</style>

              <LeftPanel />

              <div>
                <HeroSlider slides={HERO_SLIDES} />
                <SuggestionsGrid movies={MOVIES} />
              </div>
            </div>
          </main>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} />
        </div>
      </div>
    </>
  );
}
