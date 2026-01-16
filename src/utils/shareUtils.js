import html2canvas from 'html2canvas';

/**
 * 將 DOM 元素轉換為圖片並下載
 * @param {React.RefObject} elementRef - 要截圖的元素的 ref
 * @param {string} filename - 下載的檔案名稱
 */
export async function downloadAsImage(elementRef, filename = 'sleep-mbti-result.png') {
  if (!elementRef.current) return;

  try {
    const canvas = await html2canvas(elementRef.current, {
      backgroundColor: '#0a0e1a',
      scale: 2,
      useCORS: true,
      logging: false
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to generate image:', error);
    alert('圖片產生失敗，請稍後再試');
  }
}

/**
 * 複製分享連結到剪貼簿
 * @param {string} mbtiType - MBTI 類型
 */
export async function copyShareLink(mbtiType) {
  const url = `${window.location.origin}${window.location.pathname}?result=${mbtiType}`;

  try {
    await navigator.clipboard.writeText(url);
    alert('連結已複製到剪貼簿！');
  } catch (error) {
    console.error('Failed to copy link:', error);
    prompt('請複製以下連結：', url);
  }
}

export default { downloadAsImage, copyShareLink };
