import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Trivia from "./components/Trivia";
import FinalMessage from "./components/FinalMessage";
import VideoGallery from "./components/VideoGallery";
import { questions, finalMessage } from "./data/questions";
import { useUnlock } from "./hooks/useUnlock";
import { MUSIC_VOLUME, MUSIC_VOLUME_DUCKED } from "./audio";

const videos = [
  { name: "Ariane", src: "/videos/ariane.mp4" },
  { name: "Vale", src: "/videos/vale.mp4" },
  { name: "Sayita", src: "/videos/sayita.mp4" },
  { name: "Tatita", src: "/videos/tata.mp4" },
  { name: "Nanita", src: "/videos/nanita.mp4" },
  { name: "Tío Jacob", src: "/videos/tio-jacob.mp4" },
  { name: "Muchachita", src: "/videos/muchachita.mp4" },
  { name: "Dany", src: "/videos/dany.mp4" },
  { name: "Papito", src: "/videos/papito.mp4" },
];

// Fotos del carrusel
const finalPhotos = [
  "/images/final/foto1.jpeg",
  "/images/final/foto2.jpeg",
  "/images/final/foto3.jpeg",
  "/images/final/foto4.jpeg",
  "/images/final/foto5.jpeg",
  "/images/final/foto6.jpeg",
  "/images/final/foto7.jpeg",
  "/images/final/foto8.jpeg",
  "/images/final/foto9.jpeg",
  "/images/final/foto10.jpeg",
  "/images/final/foto11.jpeg",
  "/images/final/foto12.jpeg",
  "/images/final/foto13.jpeg",
  "/images/final/foto14.jpeg",
  "/images/final/foto15.jpeg",
  "/images/final/foto16.jpeg",
];

function App() {
  const { unlocked, unlock } = useUnlock();
  const [view, setView] = useState("welcome");
  const [videosAutoPlayed, setVideosAutoPlayed] = useState(false);
  const musicRef = useRef(null);
  const [musicDucked, setMusicDucked] = useState(false);

  // La música emotiva acompaña el mensaje final y sigue sonando sin cortes en la galería
  useEffect(() => {
    const music = musicRef.current;
    if (view === "final" || view === "videos") {
      music.play().catch(() => {});
    } else {
      music.pause();
      music.currentTime = 0;
    }
  }, [view]);

  useEffect(() => {
    musicRef.current.volume = musicDucked ? MUSIC_VOLUME_DUCKED : MUSIC_VOLUME;
  }, [musicDucked]);

  const handleDuckMusic = useCallback((ducked) => setMusicDucked(ducked), []);

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
    <div className="flex flex-col h-dvh">
      <audio ref={musicRef} src="/audio/emotional-music.mp3" loop />

      <Navbar activeView={view === "playingTrivia" ? "final" : view} unlocked={unlocked} onNavigate={handleNavigate} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {view === "welcome" && <Welcome onStart={() => setView("playingTrivia")} />}
        {view === "playingTrivia" && (
          <Trivia questions={questions} onComplete={handleTriviaComplete} />
        )}
        {view === "final" && (
          <FinalMessage
            message={finalMessage}
            photos={finalPhotos}
            onContinue={() => setView("videos")}
          />
        )}
        {view === "videos" && (
          <VideoGallery
            videos={videos}
            autoStart={!videosAutoPlayed}
            onAutoStartDone={() => setVideosAutoPlayed(true)}
            onDuckMusic={handleDuckMusic}
          />
        )}
      </div>
    </div>
  );
}

export default App;