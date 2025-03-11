import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import QRCode from 'qrcode.react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './BatchGeneratorPage.css';

const BatchGeneratorPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [batchData, setBatchData] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrSize, setQrSize] = useState(256);
  const [fileFormat, setFileFormat] = useState('png');

  // CSVファイルをインポート
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setBatchData(e.target.result);
    };
    reader.readAsText(file);
  };

  // バッチデータを処理してQRコードを生成
  const generateBatchQRCodes = () => {
    const lines = batchData.split('\n').filter(line => line.trim());
    const generatedCodes = lines.map((line, index) => ({
      id: index,
      value: line.trim(),
      name: `QRコード ${index + 1}`
    }));
    setQrCodes(generatedCodes);
  };

  // 全てのQRコードをZIPファイルとしてダウンロード
  const downloadAllQRCodes = async () => {
    if (qrCodes.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("qrcodes");
    
    // 各QRコードを処理
    const promises = qrCodes.map(async (qrCode, index) => {
      const canvas = document.getElementById(`qr-code-${qrCode.id}`);
      if (!canvas) return;
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const fileName = `qrcode-${index + 1}.${fileFormat}`;
          folder.file(fileName, blob);
          resolve();
        }, `image/${fileFormat}`);
      });
    });
    
    await Promise.all(promises);
    
    // ZIPファイルを生成してダウンロード
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `qrcodes-batch-${Date.now()}.zip`);
  };

  return (
    <div className={`batch-generator-page ${darkMode ? 'dark' : 'light'}`}>
      <h1>バッチQRコード生成</h1>
      
      <div className="batch-container">
        <div className="input-section">
          <div className="csv-import">
            <h3>CSVファイルインポート</h3>
            <input 
              type="file" 
              accept=".csv,.txt" 
              onChange={handleFileImport} 
            />
            <p className="hint">または以下にデータを直接入力してください（1行に1つのQRコード）</p>
          </div>
          
          <textarea
            className="batch-input"
            value={batchData}
            onChange={(e) => setBatchData(e.target.value)}
            placeholder="例：
https://example.com
連絡先情報1
テキストメッセージ1
https://another-example.com"
          />
          
          <div className="batch-options">
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
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </div>
            
            <div className="option-group">
              <label>背景色</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
            
            <div className="option-group">
              <label>ファイル形式</label>
              <select value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </div>
          </div>
          
          <button 
            className="generate-button"
            onClick={generateBatchQRCodes}
            disabled={!batchData.trim()}
          >
            QRコードを生成
          </button>
        </div>
        
        <div className="qr-preview-batch">
          <h3>プレビュー ({qrCodes.length}個のQRコード)</h3>
          
          {qrCodes.length > 0 && (
            <button 
              className="download-all-button"
              onClick={downloadAllQRCodes}
            >
              すべてダウンロード (ZIP)
            </button>
          )}
          
          <div className="qr-codes-grid">
            {qrCodes.map((qrCode) => (
              <div key={qrCode.id} className="qr-code-item">
                <QRCode
                  id={`qr-code-${qrCode.id}`}
                  value={qrCode.value}
                  size={qrSize}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={errorLevel}
                  renderAs="canvas"
                />
                <div className="qr-code-info">
                  <span className="qr-code-name">{qrCode.name}</span>
                  <span className="qr-code-value">{qrCode.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {qrCodes.length === 0 && (
            <div className="empty-batch">
              <p>QRコードを生成するにはデータを入力して「QRコードを生成」ボタンをクリックしてください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchGeneratorPage; 