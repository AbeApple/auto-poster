import React, { useState, useEffect } from 'react';

const AutoSaveInput = ({ 
  value, 
  onChange, 
  onSave, 
  location, 
  type = 'text', 
  id, 
  className,
  placeholder = '',
  rows,
  maxLength,
  min,
  max
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      console.log(`AutoSaveInput: Saving ${location} with value: ${newValue}`);
      onSave(newValue);
    }, 500);
    setTimeoutId(newTimeoutId);
  };

  return type === 'textarea' ? (
    <textarea
      id={id}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      rows={rows}
      maxLength={maxLength}
    />
  ) : (
    <input
      type={type}
      id={id}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={maxLength}
      min={min}
      max={max}
    />
  );
};

export default AutoSaveInput;
