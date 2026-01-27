import { useState, useCallback } from 'react';
import { calculateMBTI } from '../utils/calculateMBTI';

export function useQuiz(questions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerTexts, setAnswerTexts] = useState([]); // 儲存答案文字用於 AI 生成
  const [scores, setScores] = useState({
    I: 0, E: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  });

  const answer = useCallback((type, text = '') => {
    setScores(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    setAnswers(prev => [...prev, type]);
    setAnswerTexts(prev => [...prev, text]);
    setCurrentStep(prev => prev + 1);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep > 0 && answers.length > 0) {
      const lastAnswer = answers[answers.length - 1];
      setScores(prev => ({
        ...prev,
        [lastAnswer]: prev[lastAnswer] - 1
      }));
      setAnswers(prev => prev.slice(0, -1));
      setAnswerTexts(prev => prev.slice(0, -1));
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, answers]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAnswers([]);
    setAnswerTexts([]);
    setScores({
      I: 0, E: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    });
  }, []);

  const isComplete = currentStep >= questions.length;
  const mbtiType = isComplete ? calculateMBTI(scores) : null;

  return {
    currentStep,
    scores,
    answer,
    goBack,
    reset,
    isComplete,
    mbtiType,
    answerTexts
  };
}

export default useQuiz;
