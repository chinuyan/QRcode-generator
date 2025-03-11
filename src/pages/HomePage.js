import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FaQrcode, FaListAlt, FaCog } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`home-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="hero-section">
        <h1>QRコードジェネレーター</h1>
        <p>簡単にカスタマイズ可能なQRコードを作成</p>
        <Link to="/generator" className="cta-button">
          QRコードを作成する
        </Link>
      </div>

      <div className="features-section">
        <h2>主な機能</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaQrcode />
            </div>
            <h3>QRコード生成</h3>
            <p>テキスト、URL、連絡先情報などからQRコードを簡単に生成できます。</p>
            <Link to="/generator">今すぐ作成</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaListAlt />
            </div>
            <h3>バッチ処理</h3>
            <p>複数のQRコードを一度に生成し、ZIPファイルとしてダウンロードできます。</p>
            <Link to="/batch">バッチ生成を試す</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCog />
            </div>
            <h3>カスタマイズ</h3>
            <p>色、サイズ、エラー訂正レベルなど、QRコードを自由にカスタマイズできます。</p>
            <Link to="/generator">カスタマイズする</Link>
          </div>
        </div>
      </div>
      
      <div className="how-to-section">
        <h2>使い方</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>情報を入力</h3>
            <p>テキスト、URL、または連絡先情報を入力します。</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>カスタマイズ</h3>
            <p>色、サイズ、ロゴなどをお好みに合わせて調整します。</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>ダウンロード</h3>
            <p>生成したQRコードをPNG、JPG、SVG形式で保存できます。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 