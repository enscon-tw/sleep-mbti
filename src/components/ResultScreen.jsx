import { useEffect, useState, useRef } from 'react';

export default function ResultScreen({ result, mbtiType, onRestart, onShare }) {
  const [animatedStats, setAnimatedStats] = useState({
    sensitivity: 0,
    imagination: 0,
    ritual: 0
  });
  const cardRef = useRef(null);

  useEffect(() => {
    if (result?.stats) {
      const timer = setTimeout(() => {
        setAnimatedStats(result.stats);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // 防御性檢查
  if (!result) {
    return <div className="text-center text-white">載入中...</div>;
  }

  const getStatLabel = (value) => {
    if (value >= 70) return '高';
    if (value >= 40) return '中';
    return '低';
  };

  return (
    <div className="w-full fade-in relative z-10">
      {/* Paper Card */}
      <div className="paper-card text-center" ref={cardRef}>
        <p className="text-sm text-water font-bold tracking-widest mb-2 uppercase">
          Earclink Sleep Festival
        </p>
        <h2 className="text-base text-slate-500 mb-4">你的深夜靈魂是...</h2>

        {/* Icon */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 bg-blue-50 rounded-full filter blur-2xl opacity-70" />
          <div className="w-full h-full flex items-center justify-center text-8xl watercolor-illustration relative z-10">
            {result.icon}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black font-serif text-ink mb-2 tracking-wide">
          {result.animal}
        </h1>

        {/* Subtitle */}
        {result.subtitle && (
          <p className="text-base text-slate-500 mb-3 font-serif">
            {result.subtitle}
          </p>
        )}

        {/* Tags */}
        {result.tags && (
          <div className="mb-8 flex flex-wrap justify-center">
            {result.tags.map((tag, index) => (
              <span key={index} className="watercolor-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="space-y-4 px-2 mb-8 text-left">
          <div>
            <div className="flex justify-between text-xs text-slate-600 font-bold mb-2">
              <span>環境敏感度</span>
              <span className="text-water">{getStatLabel(result.stats.sensitivity)}</span>
            </div>
            <div className="stat-track-ink">
              <div
                className="stat-bar-ink"
                style={{ width: `${animatedStats.sensitivity}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 font-bold mb-2">
              <span>腦內小劇場</span>
              <span className="text-water">{getStatLabel(result.stats.imagination)}</span>
            </div>
            <div className="stat-track-ink">
              <div
                className="stat-bar-ink"
                style={{ width: `${animatedStats.imagination}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 font-bold mb-2">
              <span>儀式感需求</span>
              <span className="text-water">{getStatLabel(result.stats.ritual)}</span>
            </div>
            <div className="stat-track-ink">
              <div
                className="stat-bar-ink"
                style={{ width: `${animatedStats.ritual}%` }}
              />
            </div>
          </div>
        </div>

        {/* Soul Whisper */}
        <div className="mb-6 text-left relative">
          <div className="text-xs text-water font-bold mb-2 tracking-wider">靈魂私語</div>
          <p className="text-base text-slate-700 leading-7 font-serif px-1">
            {result.soulWhisper}
          </p>
        </div>

        {/* Night Weight */}
        <div className="mb-6 text-left relative">
          <div className="text-xs text-water font-bold mb-2 tracking-wider">夜晚的重量</div>
          <p className="text-base text-slate-700 leading-7 font-serif px-1">
            {result.nightWeight}
          </p>
        </div>

        {/* Sleep Tip */}
        <div className="mb-6 text-left relative">
          <div className="text-xs text-water font-bold mb-2 tracking-wider">好眠處方箋</div>
          <p className="text-base text-slate-700 leading-7 font-serif px-1">
            {result.sleepTip}
          </p>
        </div>

        {/* Quote */}
        <div className="mb-8 text-center relative bg-blue-50/50 rounded-2xl py-6 px-4 mx-2">
          <span className="absolute top-2 left-4 text-5xl text-blue-200 font-serif opacity-60">
            "
          </span>
          <p className="text-lg text-ink leading-8 font-serif relative z-10 italic">
            {result.quote}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => onShare(cardRef)}
            className="w-full watercolor-btn py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 font-serif shadow-lg"
          >
            <span>🎁</span> 儲存結果圖片
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-white text-ink border-2 border-blue-100 py-3.5 rounded-2xl font-bold text-base hover:bg-blue-50 transition font-serif"
          >
            重新測驗
          </button>
        </div>
      </div>

      {/* MBTI Type */}
      <div className="text-center mt-4">
        <span className="text-xs text-slate-400">{mbtiType}</span>
      </div>
    </div>
  );
}
