import React from 'react';
import Select from 'react-select';

interface TFProps {
  label?: string;
  value?: any[];
  name: string;
  options: any;
  error?: string;
  onChange?: any;
}

const MultiSelectField = ({ label = null, value = [], name, options, error = null, onChange = null }: TFProps) => {
  let optionArray = [];
  if (!Array.isArray(options) && typeof options == 'object') {
    optionArray = Object.keys(options).map((key) => ({ label: options[key].name, value: options[key]._id }));
  } else {
    optionArray = options.map((opt) => ({ label: opt.name, value: opt._id }));
  }

  const handleChange = (value) => {
    onChange({ name: name, value: value });
  };

  return (
    <div className="mb-3">
      <label className="form-label mx-2">{label}</label>
      <Select
        isMulti
        closeMenuOnSelect={false}
        name={name}
        defaultValue={value}
        options={optionArray}
        className={'basic-multi-select ' + (error ? 'is-invalid' : '')}
        classNamePrefix="select"
        onChange={handleChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default React.memo(MultiSelectField);
