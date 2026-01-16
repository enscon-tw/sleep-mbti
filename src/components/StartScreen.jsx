export default function StartScreen({ onStart }) {
  return (
    <div className="text-center fade-in relative z-10">
      <div className="mb-10">
        <div className="w-32 h-32 mx-auto flex items-center justify-center relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 blur-xl animate-pulse" />
          <span className="text-6xl text-ink relative z-10 watercolor-illustration">
            🌙
          </span>
        </div>
      </div>

      <h2 className="text-sm tracking-[0.3em] text-water mb-3 uppercase font-bold">
        World Sleep Month
      </h2>

      <h1 className="text-4xl font-black text-ink mb-6 font-serif tracking-wide">
        深夜靈魂圖鑑
      </h1>

      <p className="text-slate-600 text-base leading-8 mb-12 px-4 font-medium">
        在深藍色的夢境潮汐中，<br />
        尋找你靈魂棲息的頻率。<br />
        <span className="text-sm opacity-70 mt-2 block">
          —— 慢慢睡好，不必一次到位。
        </span>
      </p>

      <button
        onClick={onStart}
        className="w-full watercolor-btn py-4 rounded-2xl text-lg font-bold tracking-widest font-serif"
      >
        開啟我的圖鑑手札
      </button>
    </div>
  );
}
