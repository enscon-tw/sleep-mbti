/**
 * 根據分數計算 MBTI 類型
 * @param {Object} scores - 各維度的分數 { I, E, S, N, T, F, J, P }
 * @returns {string} MBTI 類型，如 "INFP"
 */
export function calculateMBTI(scores) {
  const { I, E, S, N, T, F, J, P } = scores;

  const mbti = [
    I >= E ? 'I' : 'E',
    S >= N ? 'S' : 'N',
    T >= F ? 'T' : 'F',
    J >= P ? 'J' : 'P'
  ].join('');

  return mbti;
}

export default calculateMBTI;
