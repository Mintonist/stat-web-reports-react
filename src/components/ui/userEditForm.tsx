import React, { useEffect, useState } from 'react';

import FormComponent, { TextField, SelectField } from '../common/form';

import { IUser } from '../../models';

import { IS_REQUIRED, IS_EMAIL, MIN_MAX_LEGTH } from '../../utils/validator';

interface UserProps {
  user?: IUser;
  onSubmit: any;
}
const UserEditForm = ({ user = null, onSubmit }: UserProps) => {
  //console.log('UserEditForm');
  const [data, setData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    login: user ? user.login : '',
    password: user ? user.password : '',
    role: user ? user.role : '',
  });
  // const [errors, setErrors] = useState({});
  // let [submitAmount, setSubmitAmount] = useState(0);

  // const handleChange = (target) => {
  //   if (target) {
  //     // console.log('handleChange', target.name, target.value);
  //     //--> понять синтаксис квадратных скобок для [target.name] - это налаог образения к полю объекта: obj.name ~ obj["name"]
  //     setData((prevState) => {
  //       //console.dir(prevState);
  //       return { ...prevState, [target.name]: target.value };
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (submitAmount > 0) validate();
  // }, [data]);

  const validatorConfig = {
    email: { [IS_EMAIL]: { message: 'Email не корректный' } },
    name: {
      [IS_REQUIRED]: { message: 'ФИО не заполнено' },
    },
    login: {
      [IS_REQUIRED]: { message: 'Логин не заполнен' },
      [MIN_MAX_LEGTH]: { min: 5, message: 'Слишком короткий логин' },
    },
    password: {
      [IS_REQUIRED]: { message: 'Пароль пустой' },
      // [MIN_MAX_LEGTH]: { min: 8, max: 16, message: 'Пароль должен быть от 8 до 16 символов' },
      //  [HAS_SPECIAL_CHARACTER]: { message: 'Пароль не содержит спец.символ' },
      // [HAS_DIGIT]: { message: 'Пароль не содержит цифру' },
      // [HAS_CAPITAL_SYMBOL]: { message: 'Пароль не содержит заглавной буквы' },
    },
    role: { [IS_REQUIRED]: { message: 'Нужно выбрать роль' } },
  };

  // const validate = () => {
  //   setSubmitAmount(submitAmount++);
  //   const errors = validator(data, validatorConfig);

  //   setErrors(errors);

  //   // true - если нет ошибок
  //   return Object.keys(errors).length === 0;
  // };

  const handleSubmit = (data) => {
    // e.preventDefault();

    // validate();
    // // если есть ошибки валидации
    // if (!validate()) return;

    // setSubmitAmount(0);

    // сохраняем
    onSubmit(data);
    // if (user) {
    //   api.users.update(user._id, {
    //     name: data.name,
    //     email: data.email,
    //     role: data.role,
    //     login: data.login,
    //     password: data.password,
    //   });
    // } else {
    //   api.users.add({
    //     name: data.name,
    //     email: data.email,
    //     role: data.role,
    //     login: data.login,
    //     password: data.password,
    //   });
    // }
  };

  return (
    <div className="m-3">
      <FormComponent onSubmit={handleSubmit} validatorConfig={validatorConfig}>
        <TextField
          label="Логин"
          type="login"
          name="login"
          autoFocus
          // value={data.login}
          // error={errors['login']}
          // onChange={handleChange}
        />
        <TextField
          label="Пароль"
          type="password"
          name="password"
          // value={data.password}
          // error={errors['password']}
          // onChange={handleChange}
        />
        <TextField
          label="ФИО"
          type="name"
          name="name"
          // value={data.name}
          // error={errors['name']}
          // onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          //value={data.email} error={errors['email']} onChange={handleChange}
        />
        <SelectField
          label="Роль"
          name="role"
          //value={data.role}
          options={[
            { name: 'admin', _id: '1' },
            { name: 'editor', _id: '2' },
            { name: 'viewer', _id: '3' },
          ]}
          defaultOption="Выбор..."
          // error={errors['role']}
          // onChange={handleChange}
        />
        <div className="d-flex justify-content-center">
          <button className="btn btn-secondary " type="submit">
            {user ? 'Сохранить изменения' : 'Создать'}
          </button>
        </div>
      </FormComponent>
    </div>
  );
};

export default UserEditForm;
