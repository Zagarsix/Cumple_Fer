export default function FinalMessage({ message, onContinue }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/hija-final.jpg')" }}
    >
      <div className="max-w-md w-full mx-auto text-center animate-fade-in">
        <div className="bg-white/30 backdrop-blur rounded-2xl shadow-lg p-8">
          <span className="text-5xl">🎂</span>
          <p className="text-xl font-semibold text-gray-800 mt-4 mb-6 leading-relaxed">
            {message}
          </p>
          <button
            onClick={onContinue}
            className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Ver mensajes de tu familia 💌
          </button>
        </div>
      </div>
    </div>
  );
}