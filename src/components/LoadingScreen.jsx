export default function LoadingScreen({ message }) {
  return (
    <div className="text-center w-full relative z-10">
      <div className="inline-block relative w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-blue-200 rounded-full opacity-60 animate-ping" />
        <div className="absolute inset-2 bg-white rounded-full" />
        <div className="absolute inset-4 bg-indigo-500 rounded-full opacity-80 animate-pulse" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl">🐠</span>
      </div>
      <h3 className="text-ink text-xl font-bold mb-3 font-serif">
        {message || "正在調配你的靈魂色彩..."}
      </h3>
      <p className="text-slate-500 text-sm">請稍候片刻</p>
    </div>
  );
}
