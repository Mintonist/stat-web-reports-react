import React from 'react';

interface TFProps {
  children: any;
  value?: boolean;
  name: string;
  error?: string;
  onChange?: any;
  onKeyDown?: any;
}

const CheckBoxField = ({ children, value = false, name, error = null, onChange = null, onKeyDown = null }: TFProps) => {
  const handleChange = () => {
    onChange({ name: name, value: !value });
  };

  return (
    <div className="mb-3">
      <div className={'form-check ' + (error ? 'is-invalid' : '')}>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id={name}
          checked={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
        <label className="form-check-label" htmlFor={name}>
          {children}
        </label>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default React.memo(CheckBoxField);
