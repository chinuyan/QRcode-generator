import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaQrcode } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <header className={`app-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="logo">
        <FaQrcode />
        <h1>QRコードジェネレーター</h1>
      </div>
      
      <nav className="main-nav">
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">ホーム</Link>
          </li>
          <li className={location.pathname === '/generator' ? 'active' : ''}>
            <Link to="/generator">QRコード生成</Link>
          </li>
          <li className={location.pathname === '/batch' ? 'active' : ''}>
            <Link to="/batch">バッチ生成</Link>
          </li>
          <li className={location.pathname === '/history' ? 'active' : ''}>
            <Link to="/history">履歴</Link>
          </li>
          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings">設定</Link>
          </li>
        </ul>
      </nav>
      
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </header>
  );
};

export default Header; 