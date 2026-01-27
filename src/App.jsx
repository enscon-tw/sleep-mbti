import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import { questions } from './data/questions';
import { results } from './data/results';
import { useQuiz } from './hooks/useQuiz';
import { downloadAsImage } from './utils/shareUtils';

// API 基礎路徑
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3000';

// 畫面狀態
const SCREENS = {
  START: 'start',
  QUIZ: 'quiz',
  LOADING: 'loading',
  RESULT: 'result'
};

function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentStep, answer, goBack, reset, isComplete, mbtiType, answerTexts } = useQuiz(questions);

  // 檢查 URL 參數是否有直接傳入結果
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get('result');
    const generatedParam = params.get('generated');

    if (generatedParam) {
      // 載入 AI 生成的結果
      fetchGeneratedResult(generatedParam);
    } else if (resultParam && results[resultParam]) {
      // 舊版 MBTI 結果（向下相容）
      setScreen(SCREENS.RESULT);
    }
  }, []);

  // 從 API 取得 AI 生成的結果
  const fetchGeneratedResult = async (id) => {
    try {
      setScreen(SCREENS.LOADING);
      const response = await fetch(`${API_BASE}/api/generate/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGeneratedResult(data);
        setGeneratedId(id);
        setScreen(SCREENS.RESULT);
      } else {
        setScreen(SCREENS.START);
      }
    } catch (error) {
      console.error('Failed to fetch generated result:', error);
      setScreen(SCREENS.START);
    }
  };

  // 當測驗完成時，呼叫 API 生成結果
  useEffect(() => {
    if (isComplete && screen === SCREENS.QUIZ && !isGenerating) {
      generateResult();
    }
  }, [isComplete, screen]);

  // 呼叫 Gemini API 生成結果
  const generateResult = async () => {
    setIsGenerating(true);
    setScreen(SCREENS.LOADING);

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: answerTexts })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedResult(data);
        setGeneratedId(data.id);
        setScreen(SCREENS.RESULT);
      } else {
        // 如果生成失敗，使用舊的 MBTI 結果作為備案
        console.error('Generation failed, falling back to MBTI result');
        setScreen(SCREENS.RESULT);
      }
    } catch (error) {
      console.error('Failed to generate result:', error);
      setScreen(SCREENS.RESULT);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = () => {
    setScreen(SCREENS.QUIZ);
  };

  const handleRestart = () => {
    reset();
    setGeneratedResult(null);
    setGeneratedId(null);
    setScreen(SCREENS.START);
    // 清除 URL 參數
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleShare = (cardRef) => {
    const filename = generatedResult
      ? `sleep-mbti-${generatedResult.animal || 'result'}.png`
      : `sleep-mbti-${mbtiType || 'result'}.png`;
    downloadAsImage(cardRef, filename);
  };

  // 獲取結果資料
  const getResultData = () => {
    // 優先使用 AI 生成的結果
    if (generatedResult) {
      return {
        result: {
          animal: generatedResult.animal,
          subtitle: generatedResult.subtitle,
          icon: generatedResult.icon,
          tags: generatedResult.tags,
          stats: generatedResult.stats,
          soulWhisper: generatedResult.soulWhisper,
          nightWeight: generatedResult.nightWeight,
          sleepTip: generatedResult.sleepTip,
          quote: generatedResult.quote,
          generatedImage: generatedResult.generatedImage
        },
        type: generatedId || 'generated',
        isGenerated: true
      };
    }

    // 舊版 MBTI 結果（向下相容）
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get('result');
    const type = resultParam || mbtiType;
    return {
      result: results[type] || results.INFP,
      type: type || 'INFP',
      isGenerated: false
    };
  };

  return (
    <div className="app-container">
      {screen === SCREENS.START && (
        <StartScreen onStart={handleStart} />
      )}

      {screen === SCREENS.QUIZ && !isComplete && (
        <QuizScreen
          questions={questions}
          currentStep={currentStep}
          onAnswer={answer}
          onBack={goBack}
        />
      )}

      {(screen === SCREENS.LOADING || (screen === SCREENS.QUIZ && isComplete)) && (
        <LoadingScreen message={isGenerating ? "正在為你創造獨特的海洋生物分身..." : undefined} />
      )}

      {screen === SCREENS.RESULT && (
        <ResultScreen
          result={getResultData().result}
          mbtiType={getResultData().type}
          onRestart={handleRestart}
          onShare={handleShare}
          isGenerated={getResultData().isGenerated}
        />
      )}
    </div>
  );
}

export default App;
