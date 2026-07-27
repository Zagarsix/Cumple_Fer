import { useState } from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Trivia from "./components/Trivia";
import FinalMessage from "./components/FinalMessage";
import VideoGallery from "./components/VideoGallery";
import { questions, finalMessage } from "./data/questions";
import { useUnlock } from "./hooks/useUnlock";

const videos = [
  { name: "Ariane", src: "/videos/ariane.mp4" },
  { name: "Vale", src: "/videos/vale.mp4" },
  { name: "Sayita", src: "/videos/sayita.mp4" },
  { name: "Tatita", src: "/videos/tata.mp4" },
  { name: "Nanita", src: "/videos/nanita.mp4" },
  // ... agrega el resto aquí
];

function App() {
  const { unlocked, unlock } = useUnlock();
  const [view, setView] = useState("welcome"); // welcome | playingTrivia | final | videos

  const handleNavigate = (tabKey) => {
    if (tabKey === "welcome") {
      setView("welcome");
      return;
    }
    if (!unlocked) return; // pestaña bloqueada, no hace nada
    setView(tabKey); // "final" o "videos"
  };

  const handleTriviaComplete = () => {
    unlock();
    setView("final");
  };

  return (
    <div className="min-h-screen">
      <Navbar activeView={view === "playingTrivia" ? "final" : view} unlocked={unlocked} onNavigate={handleNavigate} />

      <div className="pt-16">
        {view === "welcome" && <Welcome onStart={() => setView("playingTrivia")} />}
        {view === "playingTrivia" && (
          <Trivia questions={questions} onComplete={handleTriviaComplete} />
        )}
        {view === "final" && (
          <FinalMessage message={finalMessage} onContinue={() => setView("videos")} />
        )}
        {view === "videos" && <VideoGallery videos={videos} />}
      </div>
    </div>
  );
}

export default App;