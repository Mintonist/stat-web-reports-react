import React, { useEffect, useState } from 'react';
import FormComponent, { TextField, SelectField, RadioField } from '../common/form';
import { IDepart, IReport } from '../../models';
import api from '../../api/index.js';
import { IS_REQUIRED } from '../../utils/validator';

interface UserProps {
  report?: IReport;
  onSubmit: any;
}
const ReportEditForm = ({ report = null, onSubmit }: UserProps) => {
  const [data, setData] = useState({
    name: report ? report.name : '',
    depart_id: report ? report.depart_id : '',
    is_public: report ? String(report.is_public) : 'true',
  });

  const [departs, setDeparts] = useState<IDepart[]>([]);

  useEffect(() => {
    api.departs.fetchAll().then((data) => setDeparts(data));
  }, []);

  const validatorConfig = {
    name: {
      [IS_REQUIRED]: { message: 'Название не заполнено' },
    },
    depart_id: {},
    is_public: {},
  };

  const handleSubmit = (data) => {
    console.log('ReportEditForm.handleSubmit()', data);
    //приводим к boolean
    if (data.is_public === 'true') data.is_public = true;
    if (data.is_public === 'false') data.is_public = false;
    // сохраняем
    onSubmit(data);
  };

  return (
    <div className="m-3">
      <FormComponent onSubmit={handleSubmit} validatorConfig={validatorConfig} defaultData={data}>
        <TextField label="Название" type="name" name="name" autoFocus />
        <SelectField
          label="Отдел"
          name="depart_id"
          options={departs
            .map((d) => {
              return { name: d.code + ' - ' + d.name, _id: d._id };
            })
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .concat({ name: 'Без отдела', _id: '0' })}
          defaultOption="Выбор..."
        />
        <RadioField
          label="Видимость: "
          name="is_public"
          options={[
            { name: 'Для всех', _id: 'true' },
            { name: 'Личный', _id: 'false' },
          ]}
        />
        <div className="d-flex justify-content-center">
          <button className="btn btn-secondary " type="submit">
            {report ? 'Сохранить изменения' : 'Создать'}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default ReportEditForm;
