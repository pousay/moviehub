import {
  IconSettings,
  IconHome,
  IconHeart,
  IconDownload,
  IconUser,
} from "./Icons";

interface SidebarProps {
  activeNav: number;
  onNavChange: (idx: number) => void;
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const SidebarButton = ({
  icon,
  active = false,
  onClick,
}: SidebarButtonProps) => (
  <button
    onClick={onClick}
    className={`
      sidebar-btn
      flex h-11.5 w-full cursor-pointer items-center justify-center
      rounded-xl border-0 bg-transparent transition-all duration-150
      ${active ? "text-[#e84040] active" : "text-[rgba(240,240,245,0.45)]"}
    `}
  >
    {icon}
  </button>
);

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const navIcons = [
    <IconHome />,
    <IconHeart />,
    <IconDownload />,
    <IconUser />,
  ];

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-100 hidden w-18
        flex-col items-center bg-[rgba(10,10,15,0.7)]
        py-6 backdrop-blur-[20px]
        border-r border-white/10
        sm:flex
      "
    >
      {/* Logo */}
      <div
        className="
          mb-8 flex h-9.5 w-9.5 shrink-0
          items-center justify-center rounded-[10px]
          bg-[#e84040] text-lg font-black text-white
        "
      >
        S
      </div>

      {/* Nav icons */}
      <nav className="flex flex-1 flex-col gap-1.5 w-full px-3">
        {navIcons.map((icon, i) => (
          <SidebarButton
            key={i}
            icon={icon}
            active={activeNav === i}
            onClick={() => onNavChange(i)}
          />
        ))}
      </nav>

      {/* Settings */}
      <div className="w-full px-3">
        <SidebarButton icon={<IconSettings />} />
      </div>
    </aside>
  );
}
