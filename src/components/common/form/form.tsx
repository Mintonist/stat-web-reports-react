import React, { useCallback, useEffect, useRef, useState } from 'react';
import { validator } from '../../../utils/validator';

interface Props {
  children: any;
  validatorConfig: any;
  onSubmit: any;
  defaultData?: object;
  autoClear?: boolean;
}

const FormComponent = ({ children, validatorConfig, onSubmit, defaultData = null, autoClear = false }: Props) => {
  const [data, setData] = useState(defaultData || {});
  const [errors, setErrors] = useState({});

  // до первого нажатия submit button - ошибки не показываем
  let submitAmount = useRef(0);

  useEffect(() => {
    if (Object.keys(data).length > 0 && submitAmount.current > 0) validate(data);
  }, [data]);

  const handleChange = useCallback(
    (target) => {
      if (target) {
        //--> понять синтаксис квадратных скобок для [target.name] - это налаог образения к полю объекта: obj.name ~ obj["name"]
        setData((prevState) => ({ ...prevState, [target.name]: target.value }));
      }
    },
    [setData]
  );

  //   const handleChange = (target) => {
  //     if (target) {
  //       //--> понять синтаксис квадратных скобок для [target.name] - это налаог образения к полю объекта: obj.name ~ obj["name"]
  //       setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  //       console.log('handleChange', data, target);
  //     }
  //   };

  const isValid = Object.keys(errors).length === 0;

  const validate = useCallback(
    (data) => {
      const err = validator(data, validatorConfig);
      // console.log('errors', err, data, validatorConfig);
      // console.log('isValid', isValid, Object.keys(err).length);
      setErrors(err);
      //console.log('isValid', isValid, Object.keys(err).length);
      // true - если нет ошибок
      return Object.keys(err).length === 0;
    },
    [validatorConfig, setErrors, isValid]
  );

  //   const validate = (data) => {
  //     const errors = validator(data, validatorConfig);
  //     console.log('errors', errors, data, validatorConfig);
  //     setErrors(errors);
  //     // true - если нет ошибок
  //     return Object.keys(errors).length === 0;
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAmount.current++; // после пе

    // если есть ошибки валидации - не вызываем onSubmit();
    if (validate(data)) {
      submitAmount.current = 0;
      if (autoClear) {
        setData(defaultData || {});
      }
      onSubmit(data);
    }
  };

  const handleKeyDown = useCallback((e) => {
    // если есть ошибки валидации - не вызываем верхний уровень
    if (e.keyCode == 13) {
      e.preventDefault();
      const form = e.target.form;
      const indexField = Array.prototype.indexOf.call(form, e.target);
      form.elements[indexField + 1].focus();
    }
  }, []);

  const clonedElements = React.Children.map(children, (child) => {
    const type = typeof child.type;
    let config = {};
    // пришёл элемент формы
    if (type == 'object') {
      if (!child.props.name) throw new Error("Need 'name' prop", child);
      config = {
        ...child.props,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        value: data[child.props.name] || '',
        error: errors[child.props.name],
      };
    }
    //--> что делаем если кнопка вложена в вёрстку?
    // пришла кнопка (или div c кнопкой:)
    if (type == 'string') {
      if (child.type == 'button') {
        if (child.props.type == 'submit' || child.props.type == undefined) {
          config = { ...child.props, disabled: !isValid };
        }
      }
    }

    return React.cloneElement(child, config);
  });

  return <form onSubmit={handleSubmit}>{clonedElements}</form>;
};

export default FormComponent;
