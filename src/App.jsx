import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import { questions } from './data/questions';
import { results } from './data/results';
import { useQuiz } from './hooks/useQuiz';
import { downloadAsImage } from './utils/shareUtils';

// 畫面狀態
const SCREENS = {
  START: 'start',
  QUIZ: 'quiz',
  LOADING: 'loading',
  RESULT: 'result'
};

function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const { currentStep, answer, goBack, reset, isComplete, mbtiType } = useQuiz(questions);

  // 檢查 URL 參數是否有直接傳入結果
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get('result');
    if (resultParam && results[resultParam]) {
      setScreen(SCREENS.RESULT);
    }
  }, []);

  // 當測驗完成時，顯示載入畫面然後跳轉到結果
  useEffect(() => {
    if (isComplete && screen === SCREENS.QUIZ) {
      setScreen(SCREENS.LOADING);
    }
  }, [isComplete, screen]);

  // 載入畫面顯示 2 秒後跳轉到結果
  useEffect(() => {
    if (screen === SCREENS.LOADING) {
      const timer = setTimeout(() => {
        setScreen(SCREENS.RESULT);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleStart = () => {
    setScreen(SCREENS.QUIZ);
  };

  const handleRestart = () => {
    reset();
    setScreen(SCREENS.START);
    // 清除 URL 參數
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleShare = (cardRef) => {
    downloadAsImage(cardRef, `sleep-mbti-${mbtiType || 'result'}.png`);
  };

  // 獲取結果資料
  const getResultData = () => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get('result');
    const type = resultParam || mbtiType;
    return {
      result: results[type] || results.INFP,
      type: type || 'INFP'
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
        <LoadingScreen />
      )}

      {screen === SCREENS.RESULT && (
        <ResultScreen
          result={getResultData().result}
          mbtiType={getResultData().type}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default App;
