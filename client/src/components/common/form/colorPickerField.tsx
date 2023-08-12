import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { TwitterPicker } from 'react-color';

interface TFProps {
  label?: string;
  value?: string;
  name: string;
  error?: string;
  onChange?: any;
}

const ColorPickerField = ({ label = null, value = '#F00', name, error = null, onChange = null }: TFProps) => {
  const [state, setState] = useState({
    displayColorPicker: false,
    color: value,
  });

  const handleClick = () => {
    setState({ ...state, displayColorPicker: !state.displayColorPicker });
  };

  const handleClose = () => {
    setState({ ...state, displayColorPicker: false });
  };

  const handleChange = (color) => {
    console.log(color);
    setState({ ...state, displayColorPicker: false, color: color.hex });
    onChange({ name: name, value: color.hex });
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '56px',
        height: '24px',
        borderRadius: '2px',
        //background: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})`,
        background: `${state.color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '10',
        top: '180px',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  return (
    <div className="mb-3">
      <label className="mb-0">{label}</label>
      <div>
        <div style={styles.swatch} onClick={handleClick}>
          <div style={styles.color} />
        </div>
        {state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={handleClose} />
            {/* <SketchPicker
              disableAlpha
              color={state.color}
              onChange={handleChange}
              presetColors={[
                '#D0021B',
                '#F5A623',
                '#F8E71C',
                '#8B572A',
                '#7ED321',
                '#417505',
                '#BD10E0',
                '#9013FE',
                '#4A90E2',
                '#50E3C2',
                '#B8E986',
                '#000000',
                '#4A4A4A',
                '#9B9B9B',
                '#FFFFFF',
              ]}
            /> */}
            <TwitterPicker
              color={state.color}
              triangle="hide"
              onChangeComplete={handleChange}
              colors={[
                '#FF6900',
                '#FCB900',
                '#7BDCB5',
                '#00D084',
                '#8ED1FC',
                '#0693E3',
                '#ABB8C3',
                '#EB144C',
                '#F78DA7',
                '#9900EF',
              ]}
            />
          </div>
        ) : null}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default React.memo(ColorPickerField);
