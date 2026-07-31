import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { MUSIC_VOLUME } from "../audio";

export default function Trivia({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showClown, setShowClown] = useState(false);
  const audioRef = useRef(null);
  const sfxCtxRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = MUSIC_VOLUME;
    audio.play().catch(() => {});
    return () => audio.pause();
  }, []);

  const launchConfetti = () => {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  };

  const playTones = (notes, { type, volume }) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!sfxCtxRef.current) sfxCtxRef.current = new Ctx();
      const ctx = sfxCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      notes.forEach(([freq, delay, duration]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(volume, now + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.05);
      });
    } catch {
      // si el navegador no soporta Web Audio, solo quedan los efectos visuales
    }
  };

  const playErrorSound = () =>
    playTones([[330, 0, 0.3], [233, 0.2, 0.45]], { type: "sawtooth", volume: 0.55 });

  const playSuccessSound = () =>
    playTones(
      [[523, 0, 0.18], [659, 0.09, 0.18], [784, 0.18, 0.22], [1047, 0.28, 0.5]],
      { type: "triangle", volume: 0.5 }
    );

  const handleSelect = (index) => {
    setSelected(index);

    if (index === currentQuestion.correctIndex) {
      setWrong(false);
      setWrongAttempts(0);
      launchConfetti();
      playSuccessSound();
      setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          onComplete();
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelected(null);
        }
      }, 700);
    } else {
      setWrong(true);
      playErrorSound();
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);

      if (attempts >= 2) {
        setShowClown(true);
        setTimeout(() => setShowClown(false), 2200);
      }

      setTimeout(() => {
        setWrong(false);
        setSelected(null);
      }, 500);
    }
  };

  return (
    <div className="relative min-h-full flex items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100">
      <audio ref={audioRef} src="/audio/Trivia-suspense.mp3" loop />

      {wrong && (
        <div className="fixed inset-0 bg-red-500/40 pointer-events-none animate-pulse z-40" />
      )}

      {showClown && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 animate-fade-in">
          <span className="text-8xl mb-4">🤡</span>
          <p className="text-white text-2xl font-bold text-center px-6">
            ¡Te equivocaste de nuevo!
          </p>
        </div>
      )}

      <div className="max-w-md w-full mx-auto p-6 animate-fade-in">
        <p className="text-sm text-pink-500 font-medium mb-2">
          Pregunta {currentIndex + 1} de {questions.length}
        </p>

        <div className={`bg-white rounded-2xl shadow-lg p-6 ${wrong ? "animate-shake" : ""}`}>
          <p className="text-gray-500 text-sm mb-3 italic">{currentQuestion.description}</p>
          <h2 className="text-xl font-bold mb-5 text-gray-800">{currentQuestion.question}</h2>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`py-3 px-4 rounded-xl border-2 text-left transition-all
                  ${selected === index && index === currentQuestion.correctIndex
                    ? "bg-green-100 border-green-400"
                    : selected === index
                    ? "bg-red-100 border-red-400"
                    : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}