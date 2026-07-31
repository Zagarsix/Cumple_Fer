import { useEffect, useState } from "react";

export default function VideoGallery({ videos, autoStart = false, onAutoStartDone, onDuckMusic }) {
  const [activeVideo, setActiveVideo] = useState(autoStart ? 0 : null);
  const [autoMode, setAutoMode] = useState(autoStart);

  // marca que el auto-play ya se usó, para que no se repita al volver a entrar
  useEffect(() => {
    if (autoStart && onAutoStartDone) onAutoStartDone();
  }, []);

  // baja la música mientras habla la familia y la sube al volver a la lista
  useEffect(() => {
    onDuckMusic(activeVideo !== null);
    return () => onDuckMusic(false);
  }, [activeVideo, onDuckMusic]);

  const handleEnded = () => {
    if (!autoMode) return; // sin reproducción automática se queda en el video terminado
    if (activeVideo < videos.length - 1) {
      setActiveVideo(activeVideo + 1);
    } else {
      setAutoMode(false);
      setActiveVideo(null);
    }
  };

  // un video que todavía no se ha subido no dispara onEnded, así que la cadena
  // automática se quedaría colgada: lo saltamos igual que si hubiera terminado
  const handleError = () => {
    if (autoMode) handleEnded();
  };

  const handleSelect = (index) => {
    setAutoMode(false);
    setActiveVideo(index);
  };

  const navButton =
    "px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="max-w-2xl w-full mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Con mucho amor para ti 💕
      </h2>

      {activeVideo !== null ? (
        <div className="flex flex-col items-center gap-4">
          <video
            key={activeVideo}
            src={videos[activeVideo].src}
            controls
            autoPlay
            onEnded={handleEnded}
            onError={handleError}
            className="rounded-2xl shadow-lg w-full max-h-[70vh]"
          />

          <p className="font-medium text-gray-700">{videos[activeVideo].name}</p>
          <p className="text-xs text-gray-400 -mt-3">
            Video {activeVideo + 1} de {videos.length}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveVideo(activeVideo - 1)}
              disabled={activeVideo === 0}
              className={`${navButton} bg-white shadow text-gray-700 hover:bg-pink-50`}
            >
              ← Anterior
            </button>

            <button
              onClick={() => setAutoMode((prev) => !prev)}
              aria-pressed={autoMode}
              className={`${navButton} shadow ${
                autoMode
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "bg-white text-gray-700 hover:bg-pink-50"
              }`}
            >
              {autoMode ? "⏸ Automático activado" : "▶ Reproducción automática"}
            </button>

            <button
              onClick={() => setActiveVideo(activeVideo + 1)}
              disabled={activeVideo === videos.length - 1}
              className={`${navButton} bg-white shadow text-gray-700 hover:bg-pink-50`}
            >
              Siguiente →
            </button>
          </div>

          <button
            onClick={() => {
              setAutoMode(false);
              setActiveVideo(null);
            }}
            className="text-pink-500 underline text-sm"
          >
            ← Volver a la lista
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">🎥</span>
              <span className="text-sm font-medium text-gray-700 text-center">
                {video.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}