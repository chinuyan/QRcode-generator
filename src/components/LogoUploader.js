import React, { useState } from 'react';
import './LogoUploader.css';

const LogoUploader = ({ onLogoChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewUrl(null);
      onLogoChange(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      onLogoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    onLogoChange(null);
  };

  return (
    <div className="logo-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="logo-upload"
        className="file-input"
      />
      <label htmlFor="logo-upload" className="upload-button">
        ロゴを選択
      </label>
      
      {previewUrl && (
        <div className="logo-preview">
          <img src={previewUrl} alt="ロゴプレビュー" />
          <button 
            type="button" 
            className="remove-logo" 
            onClick={handleRemoveLogo}
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUploader; 