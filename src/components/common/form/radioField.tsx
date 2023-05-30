import React from 'react';

interface TFProps {
  label?: string;
  value?: string;
  name: string;
  defaultOption?: string;
  options: any;
  error?: string;
  onChange?: any;
  onKeyDown?: any;
}

const RadioField = ({
  label = null,
  value = '',
  name,
  defaultOption = '',
  options,
  error = null,
  onChange = null,
  onKeyDown = null,
}: TFProps) => {
  let optionArray = [];
  if (!Array.isArray(options) && typeof options == 'object') {
    optionArray = Object.keys(options).map((key) => ({ name: options[key].name, _id: options[key]._id }));
  } else {
    optionArray = options;
  }

  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value });
  };

  return (
    <div className="mb-3">
      <label className="form-label mx-2">{label}</label>
      {optionArray.map((opt) => (
        <div key={opt._id} className="form-check form-check-inline">
          <input
            className={'form-check-input ' + (error ? 'is-invalid' : '')}
            type="radio"
            name={name}
            id={opt.name + '_' + opt._id}
            value={opt._id}
            checked={opt._id == value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
          <label className="form-check-label" htmlFor={opt.name + '_' + opt._id}>
            {opt.name}
          </label>
        </div>
      ))}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default React.memo(RadioField);
