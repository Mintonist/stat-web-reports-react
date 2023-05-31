import React, { useState } from 'react';

import FormComponent, { TextField, ColorPickerField } from '../common/form';

import { IDepart } from '../../models';

import { IS_REQUIRED, MIN_MAX_LEGTH } from '../../utils/validator';

interface UserProps {
  depart?: IDepart;
  onSubmit: any;
}
const DepartEditForm = ({ depart = null, onSubmit }: UserProps) => {
  const [data, setData] = useState({
    name: depart ? depart.name : '',
    code: depart ? depart.code : '',
    color: depart ? depart.color : '',
  });

  const validatorConfig = {
    name: {
      [IS_REQUIRED]: { message: 'Название не заполнено' },
    },
    code: {
      [IS_REQUIRED]: { message: 'Код не заполнен' },
      [MIN_MAX_LEGTH]: { min: 2, max: 6, message: 'Длина от 2 до 6 символов' },
    },
    color: {},
  };

  const handleSubmit = (data) => {
    console.log('DepartEditForm.handleSubmit()', data);
    // сохраняем
    onSubmit(data);
  };

  return (
    <div className="m-3">
      <FormComponent onSubmit={handleSubmit} validatorConfig={validatorConfig} defaultData={data}>
        <TextField label="Название" type="name" name="name" autoFocus />
        <TextField label="Код" type="code" name="code" />
        <ColorPickerField label="Цвет" name="color" />
        <div className="d-flex justify-content-center">
          <button className="btn btn-secondary " type="submit">
            {depart ? 'Сохранить изменения' : 'Создать'}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default DepartEditForm;
