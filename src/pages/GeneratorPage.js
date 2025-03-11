import React, { useState, useEffect, useContext } from 'react';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import { ThemeContext } from '../contexts/ThemeContext';
import ColorPicker from '../components/ColorPicker';
import LogoUploader from '../components/LogoUploader';
import './GeneratorPage.css';

const GeneratorPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const [logo, setLogo] = useState(null);
  const [qrType, setQrType] = useState('text');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [shouldSaveHistory, setShouldSaveHistory] = useState(true);

  // 設定を読み込む
  useEffect(() => {
    // デフォルト設定を読み込む
    const savedSize = localStorage.getItem('defaultQrSize');
    const savedErrorLevel = localStorage.getItem('defaultErrorLevel');
    const savedFgColor = localStorage.getItem('defaultFgColor');
    const savedBgColor = localStorage.getItem('defaultBgColor');
    const saveHistory = localStorage.getItem('saveHistory');
    
    if (savedSize) setQrSize(Number(savedSize));
    if (savedErrorLevel) setErrorLevel(savedErrorLevel);
    if (savedFgColor) setFgColor(savedFgColor);
    if (savedBgColor) setBgColor(savedBgColor);
    if (saveHistory !== null) setShouldSaveHistory(saveHistory !== 'false');
  }, []);

  // QRコードの値を生成
  const generateQRValue = () => {
    if (qrType === 'contact') {
      const { name, phone, email, address } = contactInfo;
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nADR:${address}\nEND:VCARD`;
    }
    return qrValue;
  };

  // 履歴に保存
  const saveToHistory = (value) => {
    if (!shouldSaveHistory) return;
    
    try {
      // 既存の履歴を取得
      const savedHistory = localStorage.getItem('qrCodeHistory');
      let history = [];
      
      if (savedHistory) {
        history = JSON.parse(savedHistory);
      }
      
      // 新しいQRコードを履歴に追加
      const newQrCode = {
        value: value,
        date: Date.now(),
        fgColor: fgColor,
        bgColor: bgColor,
        errorLevel: errorLevel
      };
      
      // 重複を避けるため、同じ値のQRコードがあれば削除
      history = history.filter(item => item.value !== value);
      
      // 新しいQRコードを先頭に追加
      history.unshift(newQrCode);
      
      // 履歴が多すぎる場合は古いものを削除（最大50件）
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      
      // 履歴を保存
      localStorage.setItem('qrCodeHistory', JSON.stringify(history));
    } catch (error) {
      console.error('履歴の保存に失敗しました:', error);
    }
  };

  // QRコードを保存
  const saveQRCode = (format) => {
    const canvas = document.getElementById('qr-code');
    if (!canvas) return;
    
    const qrValue = generateQRValue();
    
    // 履歴に保存
    saveToHistory(qrValue);

    if (format === 'svg') {
      // SVG形式で保存
      const svgData = document.getElementById('qr-code-svg').outerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      saveAs(blob, `qrcode-${Date.now()}.svg`);
    } else {
      // PNG/JPG形式で保存
      canvas.toBlob((blob) => {
        saveAs(blob, `qrcode-${Date.now()}.${format}`);
      }, `image/${format}`);
    }
  };

  // QRコードを共有
  const shareQRCode = async () => {
    try {
      const canvas = document.getElementById('qr-code');
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      // 履歴に保存
      saveToHistory(generateQRValue());
      
      if (navigator.share) {
        await navigator.share({
          title: 'QRコード共有',
          files: [file],
        });
      } else {
        alert('お使いのブラウザは共有機能に対応していません。');
      }
    } catch (error) {
      console.error('共有に失敗しました:', error);
    }
  };

  return (
    <div className={`generator-page ${darkMode ? 'dark' : 'light'}`}>
      <h1>QRコード生成</h1>
      
      <div className="generator-container">
        <div className="input-section">
          <div className="qr-type-selector">
            <button 
              className={qrType === 'text' ? 'active' : ''} 
              onClick={() => setQrType('text')}
            >
              テキスト/URL
            </button>
            <button 
              className={qrType === 'contact' ? 'active' : ''} 
              onClick={() => setQrType('contact')}
            >
              連絡先情報
            </button>
          </div>
          
          {qrType === 'text' ? (
            <div className="text-input">
              <textarea
                placeholder="テキストまたはURLを入力してください"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
              />
            </div>
          ) : (
            <div className="contact-input">
              <input
                type="text"
                placeholder="名前"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="電話番号"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
              />
              <input
                type="email"
                placeholder="メールアドレス"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              />
              <input
                type="text"
                placeholder="住所"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              />
            </div>
          )}
          
          <div className="customization-options">
            <div className="option-group">
              <label>QRコードサイズ</label>
              <input
                type="range"
                min="128"
                max="512"
                step="8"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
              />
              <span>{qrSize}px</span>
            </div>
            
            <div className="option-group">
              <label>エラー訂正レベル</label>
              <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)}>
                <option value="L">L - 低 (7%)</option>
                <option value="M">M - 中 (15%)</option>
                <option value="Q">Q - 高 (25%)</option>
                <option value="H">H - 最高 (30%)</option>
              </select>
            </div>
            
            <div className="option-group">
              <label>前景色</label>
              <ColorPicker color={fgColor} onChange={setFgColor} />
            </div>
            
            <div className="option-group">
              <label>背景色</label>
              <ColorPicker color={bgColor} onChange={setBgColor} />
            </div>
            
            <div className="option-group">
              <label>ロゴ追加</label>
              <LogoUploader onLogoChange={setLogo} />
            </div>
          </div>
        </div>
        
        <div className="qr-preview">
          <div className="qr-code-container">
            {(qrValue || (qrType === 'contact' && contactInfo.name)) ? (
              <>
                <QRCode
                  id="qr-code"
                  value={generateQRValue()}
                  size={qrSize}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={errorLevel}
                  imageSettings={logo ? {
                    src: logo,
                    excavate: true,
                    width: qrSize * 0.2,
                    height: qrSize * 0.2,
                  } : undefined}
                  renderAs="canvas"
                />
                <div style={{ display: 'none' }}>
                  <QRCode
                    id="qr-code-svg"
                    value={generateQRValue()}
                    size={qrSize}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={errorLevel}
                    imageSettings={logo ? {
                      src: logo,
                      excavate: true,
                      width: qrSize * 0.2,
                      height: qrSize * 0.2,
                    } : undefined}
                    renderAs="svg"
                  />
                </div>
              </>
            ) : (
              <div className="empty-qr">
                <p>QRコードをプレビューするには<br />テキストを入力してください</p>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className="save-button" 
              onClick={() => saveQRCode('png')}
              disabled={!qrValue && !(qrType === 'contact' && contactInfo.name)}
            >
              PNG保存
            </button>
            <button 
              className="save-button" 
              onClick={() => saveQRCode('jpg')}
              disabled={!qrValue && !(qrType === 'contact' && contactInfo.name)}
            >
              JPG保存
            </button>
            <button 
              className="save-button" 
              onClick={() => saveQRCode('svg')}
              disabled={!qrValue && !(qrType === 'contact' && contactInfo.name)}
            >
              SVG保存
            </button>
            <button 
              className="share-button" 
              onClick={shareQRCode}
              disabled={!qrValue && !(qrType === 'contact' && contactInfo.name)}
            >
              共有
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage; 