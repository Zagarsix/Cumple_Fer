import { useState } from "react";

export default function VideoGallery({ videos }) {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="max-w-2xl w-full mx-auto p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Mensajes con mucho amor para ti 💕
      </h2>

      {activeVideo !== null ? (
        <div className="flex flex-col items-center gap-4">
          <video
            src={videos[activeVideo].src}
            controls
            autoPlay
            className="rounded-2xl shadow-lg w-full max-h-[70vh]"
          />
          <p className="font-medium text-gray-700">{videos[activeVideo].name}</p>
          <button
            onClick={() => setActiveVideo(null)}
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
              onClick={() => setActiveVideo(index)}
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