export function generateAuthError(code) {
  switch (code) {
    case 'INVALID_PASSWORD':
      return 'Неверный логин/пароль';
    case 'EMAIL_EXISTS':
      return 'email занят';
    default:
      return 'Ошибка. Попробуйте позже';
  }
}
