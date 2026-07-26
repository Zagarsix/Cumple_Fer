import { useEffect, useRef } from "react";

export default function Welcome({ onStart }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    // Los navegadores bloquean el autoplay con sonido; esto lo activa
    // apenas haya el primer click en cualquier parte de la pantalla
    window.addEventListener("click", tryPlay, { once: true });
    return () => {
      window.removeEventListener("click", tryPlay);
      audio.pause();
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-end pb-20 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Welcome3.jpg')" }}
    >
      <audio ref={audioRef} src="/audio/Happy-birthday.mp3" loop />

      <button
        onClick={onStart}
        className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold text-xl py-4 px-8 rounded-full shadow-xl animate-pulse"
      >
        ¿Quieres jugar? 🎉
      </button>
    </div>
  );
}