import html2canvas from 'html2canvas';

// API 基礎路徑
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3000';

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
 * 儲存測驗結果到資料庫
 * @param {string} mbtiType - MBTI 類型
 * @returns {Promise<string|null>} - 分享 ID 或 null
 */
export async function saveResult(mbtiType) {
  try {
    const response = await fetch(`${API_BASE}/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mbtiType })
    });

    if (!response.ok) {
      throw new Error('Failed to save result');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Failed to save result:', error);
    return null;
  }
}

/**
 * 複製分享連結到剪貼簿（使用資料庫 ID）
 * @param {string} mbtiType - MBTI 類型
 * @returns {Promise<string|null>} - 分享連結或 null
 */
export async function copyShareLink(mbtiType) {
  try {
    // 先儲存到資料庫取得 ID
    const id = await saveResult(mbtiType);

    if (!id) {
      // 如果儲存失敗，使用舊的 URL 參數方式
      const url = `${window.location.origin}${window.location.pathname}?result=${mbtiType}`;
      await navigator.clipboard.writeText(url);
      alert('連結已複製到剪貼簿！');
      return url;
    }

    // 使用新的分享連結格式
    const url = `${window.location.origin}/share/${id}`;
    await navigator.clipboard.writeText(url);
    alert('連結已複製到剪貼簿！\n分享此連結，朋友可以看到你的測驗結果預覽。');
    return url;
  } catch (error) {
    console.error('Failed to copy link:', error);
    // Fallback
    const url = `${window.location.origin}${window.location.pathname}?result=${mbtiType}`;
    prompt('請複製以下連結：', url);
    return null;
  }
}

/**
 * 分享到 Facebook
 * @param {string} mbtiType - MBTI 類型
 */
export async function shareToFacebook(mbtiType) {
  const id = await saveResult(mbtiType);
  const shareUrl = id
    ? `${window.location.origin}/share/${id}`
    : `${window.location.origin}${window.location.pathname}?result=${mbtiType}`;

  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    '_blank',
    'width=600,height=400'
  );
}

/**
 * 分享到 LINE
 * @param {string} mbtiType - MBTI 類型
 */
export async function shareToLine(mbtiType) {
  const id = await saveResult(mbtiType);
  const shareUrl = id
    ? `${window.location.origin}/share/${id}`
    : `${window.location.origin}${window.location.pathname}?result=${mbtiType}`;

  window.open(
    `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
    '_blank',
    'width=600,height=400'
  );
}

export default { downloadAsImage, copyShareLink, saveResult, shareToFacebook, shareToLine };
