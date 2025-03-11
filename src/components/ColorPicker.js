import React from 'react';
import './ColorPicker.css';

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="color-picker">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        maxLength={7}
      />
    </div>
  );
};

export default ColorPicker; 