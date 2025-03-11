import React, { useContext, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [defaultQrSize, setDefaultQrSize] = useState(localStorage.getItem('defaultQrSize') || '256');
  const [defaultErrorLevel, setDefaultErrorLevel] = useState(localStorage.getItem('defaultErrorLevel') || 'M');
  const [defaultFgColor, setDefaultFgColor] = useState(localStorage.getItem('defaultFgColor') || '#000000');
  const [defaultBgColor, setDefaultBgColor] = useState(localStorage.getItem('defaultBgColor') || '#ffffff');
  const [saveHistory, setSaveHistory] = useState(localStorage.getItem('saveHistory') !== 'false');
  
  // 設定を保存
  const saveSettings = () => {
    localStorage.setItem('defaultQrSize', defaultQrSize);
    localStorage.setItem('defaultErrorLevel', defaultErrorLevel);
    localStorage.setItem('defaultFgColor', defaultFgColor);
    localStorage.setItem('defaultBgColor', defaultBgColor);
    localStorage.setItem('saveHistory', saveHistory);
    
    alert('設定が保存されました');
  };
  
  // 設定をリセット
  const resetSettings = () => {
    if (window.confirm('設定をデフォルトに戻しますか？')) {
      localStorage.removeItem('defaultQrSize');
      localStorage.removeItem('defaultErrorLevel');
      localStorage.removeItem('defaultFgColor');
      localStorage.removeItem('defaultBgColor');
      localStorage.removeItem('saveHistory');
      
      setDefaultQrSize('256');
      setDefaultErrorLevel('M');
      setDefaultFgColor('#000000');
      setDefaultBgColor('#ffffff');
      setSaveHistory(true);
      
      alert('設定がリセットされました');
    }
  };

  return (
    <div className={`settings-page ${darkMode ? 'dark' : 'light'}`}>
      <h1>設定</h1>
      
      <div className="settings-container">
        <div className="settings-group">
          <h2>アプリケーション設定</h2>
          
          <div className="setting-item">
            <label>テーマ</label>
            <div className="theme-toggle-container">
              <button 
                className={`theme-option ${!darkMode ? 'active' : ''}`}
                onClick={() => darkMode && toggleTheme()}
              >
                ライトモード
              </button>
              <button 
                className={`theme-option ${darkMode ? 'active' : ''}`}
                onClick={() => !darkMode && toggleTheme()}
              >
                ダークモード
              </button>
            </div>
          </div>
          
          <div className="setting-item">
            <label>履歴を保存</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="history-toggle" 
                checked={saveHistory}
                onChange={() => setSaveHistory(!saveHistory)}
              />
              <label htmlFor="history-toggle"></label>
            </div>
          </div>
        </div>
        
        <div className="settings-group">
          <h2>QRコードのデフォルト設定</h2>
          
          <div className="setting-item">
            <label>デフォルトサイズ</label>
            <div className="size-input">
              <input
                type="range"
                min="128"
                max="512"
                step="8"
                value={defaultQrSize}
                onChange={(e) => setDefaultQrSize(e.target.value)}
              />
              <span>{defaultQrSize}px</span>
            </div>
          </div>
          
          <div className="setting-item">
            <label>エラー訂正レベル</label>
            <select 
              value={defaultErrorLevel}
              onChange={(e) => setDefaultErrorLevel(e.target.value)}
            >
              <option value="L">L - 低 (7%)</option>
              <option value="M">M - 中 (15%)</option>
              <option value="Q">Q - 高 (25%)</option>
              <option value="H">H - 最高 (30%)</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>前景色</label>
            <div className="color-input">
              <input
                type="color"
                value={defaultFgColor}
                onChange={(e) => setDefaultFgColor(e.target.value)}
              />
              <input
                type="text"
                value={defaultFgColor}
                onChange={(e) => setDefaultFgColor(e.target.value)}
                maxLength={7}
              />
            </div>
          </div>
          
          <div className="setting-item">
            <label>背景色</label>
            <div className="color-input">
              <input
                type="color"
                value={defaultBgColor}
                onChange={(e) => setDefaultBgColor(e.target.value)}
              />
              <input
                type="text"
                value={defaultBgColor}
                onChange={(e) => setDefaultBgColor(e.target.value)}
                maxLength={7}
              />
            </div>
          </div>
        </div>
        
        <div className="settings-actions">
          <button className="save-settings" onClick={saveSettings}>
            設定を保存
          </button>
          <button className="reset-settings" onClick={resetSettings}>
            デフォルトに戻す
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 