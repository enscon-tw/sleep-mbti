import { useState, useEffect } from 'react';

export default function QuizScreen({ questions, currentStep, onAnswer, onBack }) {
  const [animKey, setAnimKey] = useState(0);
  const question = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, [currentStep]);

  return (
    <div className="w-full relative z-10 font-medium">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-water mb-3 uppercase tracking-wider font-bold">
          <span>Question {String(currentStep + 1).padStart(2, '0')} / {questions.length}</span>
          {currentStep > 0 && (
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-water transition"
            >
              ← 上一題
            </button>
          )}
        </div>
        <div className="watercolor-progress-container">
          <div
            className="watercolor-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={animKey} className="fade-in">
        <h2 className="text-2xl text-ink font-bold leading-snug mb-10 min-h-[80px] font-serif">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option.type, option.text)}
              className="option-card w-full p-5 text-left text-base text-slate-700 leading-relaxed font-medium"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
