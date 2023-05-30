export function validator(data, config) {
  const errors = {};

  function validate(method: string, dataParam: string, configParam: any): string {
    switch (method) {
      case IS_REQUIRED:
        if (dataParam.trim() === '') return configParam.message;
        break;

      case IS_SET_TRUE:
        if (dataParam != 'true') return configParam.message;
        break;

      case MIN_MAX_LEGTH:
        if (dataParam.trim().length < configParam.min || dataParam.trim().length > configParam.max)
          return configParam.message;
        break;

      case HAS_SPECIAL_CHARACTER:
        if (dataParam.trim().search(new RegExp('[!@#$%]')) == -1) return configParam.message;
        break;

      case HAS_CAPITAL_SYMBOL:
        if (dataParam.trim().search(new RegExp('[A-Z]')) == -1) return configParam.message;
        break;

      case HAS_DIGIT:
        if (dataParam.trim().search(new RegExp('[0-9]')) == -1) return configParam.message;
        break;

      case IS_EMAIL:
        if (dataParam.trim().length > 0 && dataParam.trim().match(new RegExp('^\\S+@\\S+\\.\\S+$')) == null)
          return configParam.message;
        break;

      default:
        break;
    }
  }

  // проверка на наличие поля в data
  for (const fieldName in config) {
    for (const validateMethod in config[fieldName]) {
      if (validateMethod == IS_REQUIRED && !data[fieldName]) {
        errors[fieldName] = config[fieldName][validateMethod]['message'];
        break;
      }
    }
  }

  // проверка занчений согласно конфигу
  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const err = validate(validateMethod, String(data[fieldName]), config[fieldName][validateMethod]);
      if (err) {
        errors[fieldName] = err;
        break;
      }
    }
  }

  return errors;
}

export const IS_REQUIRED: string = 'IS_REQUIRED';
export const MIN_MAX_LEGTH: string = 'MIN_MAX_LEGTH';
export const HAS_SPECIAL_CHARACTER: string = 'SPECIAL_CHARACTERS';
export const HAS_CAPITAL_SYMBOL: string = 'HAS_CAPITAL_SYMBOL';
export const HAS_DIGIT: string = 'HAS_DIGIT';
export const IS_EMAIL: string = 'IS_EMAIL';
export const IS_SET_TRUE: string = 'IS_SET_TRUE';
