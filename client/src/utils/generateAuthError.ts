export function generateAuthError(code) {
  switch (code) {
    case 'INVALID_PASSWORD':
      return 'Неверный логин/пароль';
    case 'EMAIL_EXISTS':
      return 'email занят';
    case 'LOGIN_NOT_FOUND':
      return 'Логин не найден';
    case 'INVALID_DATA':
      return 'Ошибка в данных формы';

    default:
      return code;
  }
}
