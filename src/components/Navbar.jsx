export default function Navbar({ activeView, unlocked, onNavigate }) {
  const tabs = [
    { key: "welcome", label: "Bienvenida", locked: false },
    { key: "final", label: "Mensaje secreto", locked: !unlocked },
    { key: "videos", label: "Videos", locked: !unlocked },
  ];

  return (
    <nav className="shrink-0 bg-white/90 backdrop-blur shadow-md z-50 flex flex-wrap justify-center gap-1 sm:gap-2 px-2 py-2 sm:py-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          disabled={tab.locked}
          onClick={() => onNavigate(tab.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${activeView === tab.key ? "bg-pink-500 text-white" : "text-gray-600"}
            ${tab.locked ? "opacity-40 cursor-not-allowed" : "hover:bg-pink-100"}
          `}
        >
          {tab.locked && "🔒 "}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}