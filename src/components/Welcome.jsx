import { useEffect, useRef } from "react";
import { MUSIC_VOLUME } from "../audio";

export default function Welcome({ onStart }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = MUSIC_VOLUME;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    // activa el autoplay con sonido, en el primer click en cualquier parte de la pantalla
    window.addEventListener("click", tryPlay, { once: true });
    return () => {
      window.removeEventListener("click", tryPlay);
      audio.pause();
    };
  }, []);

  return (
    <div
      className="h-full flex flex-col items-center justify-end pb-14 bg-[length:150%_auto] bg-top bg-no-repeat
                 lg:pb-20 lg:bg-cover lg:bg-center"
      style={{ backgroundImage: "url('/images/Welcome4.jpg')", backgroundColor: "#d9f0f8" }}
    >
      <audio ref={audioRef} src="/audio/Happy-birthday.mp3" loop />

      <button
        onClick={onStart}
        className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold text-base sm:text-xl py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-xl animate-pulse mx-4 text-center"
      >
        ¿Quieres jugar? 🎉
      </button>
    </div>
  );
}