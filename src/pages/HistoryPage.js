import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import './HistoryPage.css';

const HistoryPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [history, setHistory] = useState([]);

  // 履歴データをロード
  useEffect(() => {
    const savedHistory = localStorage.getItem('qrCodeHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('履歴の読み込みに失敗しました:', error);
      }
    }
  }, []);

  // 履歴を消去
  const clearHistory = () => {
    if (window.confirm('履歴をすべて消去しますか？この操作は元に戻せません。')) {
      localStorage.removeItem('qrCodeHistory');
      setHistory([]);
    }
  };

  // QRコードを保存
  const saveQRCode = (qrValue, format) => {
    const canvas = document.getElementById(`history-qr-${qrValue.slice(0, 10)}`);
    if (!canvas) return;

    canvas.toBlob((blob) => {
      saveAs(blob, `qrcode-${Date.now()}.${format}`);
    }, `image/${format}`);
  };

  return (
    <div className={`history-page ${darkMode ? 'dark' : 'light'}`}>
      <h1>QRコード履歴</h1>
      
      {history.length > 0 ? (
        <>
          <div className="history-actions">
            <button className="clear-history" onClick={clearHistory}>
              履歴を消去
            </button>
          </div>
          
          <div className="history-grid">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <QRCode
                  id={`history-qr-${item.value.slice(0, 10)}`}
                  value={item.value}
                  size={150}
                  fgColor={item.fgColor || '#000000'}
                  bgColor={item.bgColor || '#ffffff'}
                  level={item.errorLevel || 'M'}
                  renderAs="canvas"
                />
                <div className="history-item-info">
                  <p className="history-item-value">{item.value}</p>
                  <p className="history-item-date">{new Date(item.date).toLocaleString()}</p>
                </div>
                <div className="history-item-actions">
                  <button onClick={() => saveQRCode(item.value, 'png')}>PNG</button>
                  <button onClick={() => saveQRCode(item.value, 'jpg')}>JPG</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-history">
          <p>履歴はありません。QRコードを生成すると、ここに表示されます。</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 