import { useEffect, useState } from "react";

const SLIDE_MS = 4000;

// Las fotos del carrusel son 9:16 (0.5625). Las que vengan más anchas que esto no se
// pueden recortar sin dejar gente fuera, así que se muestran completas sobre un fondo
// desenfocado de la misma foto, que rellena el marco sin perder detalle.
const NINE_SIXTEEN = 9 / 16;
const WIDE_THRESHOLD = 0.65;

export default function FinalMessage({ message, photos, onContinue }) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState([]);
  const [ratios, setRatios] = useState({});

  const visible = photos.filter((src) => !broken.includes(src));
  const activeSrc = visible.length ? visible[index % visible.length] : null;

  useEffect(() => {
    if (visible.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % visible.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [index, visible.length]); // el índice reinicia el contador tras un cambio manual

  const go = (delta) =>
    setIndex((i) => (i + delta + visible.length) % visible.length);

  const handleLoad = (src, e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight) {
      setRatios((prev) => ({ ...prev, [src]: naturalWidth / naturalHeight }));
    }
  };

  const arrow =
    "absolute top-[30%] lg:top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white text-xl backdrop-blur-sm transition-colors hover:bg-black/60";

  const card = (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 text-center lg:bg-white lg:shadow-xl">
      <span className="text-4xl">🎂</span>
      <p className="text-base sm:text-lg font-medium text-white mt-3 mb-5 leading-relaxed lg:text-gray-800 lg:text-xl">
        {message}
      </p>
      <button
        onClick={onContinue}
        className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        Ver mensajes de tu familia 💌
      </button>
    </div>
  );

  return (
    <div className="h-full lg:flex lg:items-stretch">
      {/* Carrusel: pegado al navbar, a pantalla completa en móvil y a media pantalla en escritorio */}
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-pink-100 to-purple-100 lg:w-1/2">
        {photos.map((src) => {
          const ratio = ratios[src] ?? NINE_SIXTEEN;
          const isWide = ratio > WIDE_THRESHOLD;

          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                src === activeSrc ? "opacity-100" : "opacity-0"
              }`}
            >
              {isWide && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl"
                  style={{ backgroundImage: `url("${src}")` }}
                />
              )}
              {/* en escritorio siempre la foto completa: recortarla ahí cortaba cabezas */}
              <img
                src={src}
                alt=""
                onLoad={(e) => handleLoad(src, e)}
                onError={() => setBroken((prev) => [...prev, src])}
                className={`relative h-full w-full object-top lg:object-contain lg:object-center ${
                  isWide ? "object-contain" : "object-cover"
                }`}
              />
            </div>
          );
        })}

        {visible.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className={`${arrow} left-3`}
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className={`${arrow} right-3`}
            >
              ›
            </button>

            <div className="absolute bottom-3 left-0 right-0 z-10 flex flex-wrap justify-center gap-2 px-4 lg:bottom-5">
              {visible.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setIndex(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    src === activeSrc ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* En móvil y tablet el mensaje va sobrepuesto sobre las fotos */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-10 animate-fade-in lg:hidden">
          <div className="mx-auto w-full max-w-sm">{card}</div>
        </div>
      </div>

      {/* En escritorio el mensaje ocupa la otra mitad, con sus márgenes */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-10 xl:p-16">
        <div className="w-full max-w-lg animate-fade-in">{card}</div>
      </div>
    </div>
  );
}
