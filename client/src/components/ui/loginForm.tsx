import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import TextField from '../common/form/textField';
//import api from '../../api/index.js';
import { useHistory } from 'react-router-dom';
import { IS_REQUIRED } from '../../utils/validator';
import FormComponent, { CheckBoxField } from '../common/form';
import { IUser } from '../../models';
//import userStore from '../../store/userMobx';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthError, login } from '../../store/users';

const LoginForm = () => {
  const dispatch: any = useDispatch();
  const history = useHistory();
  // const history = useHistory();
  // const [data, setData] = useState({ login: '', password: '', stayOn: false });
  // const [errors, setErrors] = useState({});
  // let [submitAmount, setSubmitAmount] = useState(0);
  const loginError = useSelector(getAuthError());
  const [sumbitErrors, setSumbitErrors] = useState({});

  const validatorConfig = {
    login: { [IS_REQUIRED]: { message: 'Логин пустой' } },
    password: {
      [IS_REQUIRED]: { message: 'Пароль пустой' },
    },
  };

  // useEffect(() => {
  //   if (submitAmount > 0) validate();
  // }, [data]);

  // const handleChange = (target) => {
  //   if (target) {
  //     //--> понять синтаксис квадратных скобок для [target.name] - это налаог образения к полю объекта: obj.name ~ obj["name"]
  //     setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  //   }
  // };

  // const validate = () => {
  //   setSubmitAmount(submitAmount++);
  //   // валидация вручную
  //   const errors = validator(data, validatorConfig);
  //   setErrors(errors);

  //   // валидация через yup
  //   // validateSchema
  //   //   .validate(data)
  //   //   .then(() => setErrors({}))
  //   //   .catch((err) => setErrors({ [err.path]: err.message }));

  //   // true - если нет ошибок
  //   return Object.keys(errors).length === 0;
  // };

  const handleSubmit = (data) => {
    console.log('LoginForm.handleSubmit()', data);

    try {
      //await login(data);
      dispatch(login(data));
      //console.log(history.location.state);
      history.push(
        history.location.state && history.location.state.from && history.location.state.from.pathname
          ? history.location.state.from.pathname
          : '/'
      );
    } catch (err) {
      console.log('LodinForm. submit error:', err);
      setSumbitErrors(err);
    }

    // api.users.login(data.login, data.password).then((user: IUser) => {
    //   if (!user) {
    //     //setSubmitAmount(0);
    //     //setData({ login: '', password: '', stayOn: false });
    //   } else {
    //     localStorage.setItem('user', JSON.stringify(user));
    //     userStore.setUser(user);
    //     //history.replace(`/main`);
    //     window.location.replace('/main');
    //   }
    // });
  };

  return (
    <FormComponent onSubmit={handleSubmit} validatorConfig={validatorConfig} defaultErrors={sumbitErrors} autoClear>
      <TextField
        label="Логин"
        name="login"
        //value={data.login} error={errors['login']} onChange={handleChange}
      />
      <TextField
        label="Пароль"
        type="password"
        name="password"
        // value={data.password}
        // error={errors['password']}
        // onChange={handleChange}
      />
      <CheckBoxField
        name="stayOn"
        // value={data.stayOn} onChange={handleChange}
      >
        Оставаться в системе
      </CheckBoxField>

      <button className="btn btn-secondary w-100 mx-auto" type="submit">
        Submit
      </button>
    </FormComponent>
  );
};

export default LoginForm;
