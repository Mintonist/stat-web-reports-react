import React from 'react';

interface TFProps {
  label?: string;
  value?: string;
  name: string;
  defaultOption?: string;
  options: any;
  error?: string;
  onChange?: any;
}

const SelectField = ({
  label = null,
  value = '',
  name,
  defaultOption = '',
  options,
  error = null,
  onChange = null,
}: TFProps) => {
  let optionArray = [];
  if (!Array.isArray(options) && typeof options == 'object') {
    optionArray = Object.keys(options).map((key) => ({ name: options[key].name, _id: options[key]._id }));
  } else {
    optionArray = options;
  }

  const handleChange = ({ target }) => {
    console.log('SelectField.handleChange():', target.name, target.value);
    onChange({
      name: target.name,
      value: target.value,
      //value: target.options[target.options.selectedIndex].text
    });
  };

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label m-0">
        {label}
      </label>
      <select
        className={'form-select ' + (error ? 'is-invalid' : '')}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
      >
        <option disabled value="">
          {defaultOption}
        </option>
        {optionArray.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default React.memo(SelectField);
