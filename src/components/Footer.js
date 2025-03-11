import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import './Footer.css';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`app-footer ${darkMode ? 'dark' : 'light'}`}>
      <div className="footer-content">
        <p>&copy; {currentYear} QRコードジェネレーター</p>
        <div className="footer-links">
          <a href="/privacy">プライバシーポリシー</a>
          <a href="/terms">利用規約</a>
          <a href="/contact">お問い合わせ</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 