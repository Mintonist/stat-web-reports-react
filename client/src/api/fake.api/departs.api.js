export const departsAsObject = {
  tedious: {
    _id: '11',
    code: 'АБ',
    name: 'Абонемент',
    color: '#E98B43',
  },
  strange: {
    _id: '22',
    code: 'ТО',
    name: 'Тифло Отдел',
    color: '#842C2A',
  },
  buller: {
    _id: '33',
    code: 'ОР',
    name: 'Отдел Развития',
    color: '#022F46',
  },
  alcoholic: {
    _id: '44',
    code: 'ООФиК',
    name: 'Отдел Обработки',
    color: '#032437',
  },
  handsome: {
    _id: '55',
    code: 'ДО',
    name: 'Детский Отдел',
    color: '#C23D2A',
  },
  uncertain: {
    _id: '66',
    code: 'НД',
    name: 'Надомный абонемент',
    color: '#C20D0A',
  },
  uncertain2: {
    _id: '77',
    code: 'ОВО',
    name: 'Внестационарный отдел',
    color: '#C20D0A',
  },
};

export const departs = [
  departsAsObject.alcoholic,
  departsAsObject.buller,
  departsAsObject.handsome,
  departsAsObject.strange,
  departsAsObject.tedious,
  departsAsObject.uncertain,
  departsAsObject.uncertain2,
];

if (!localStorage.getItem('departs')) {
  localStorage.setItem('departs', JSON.stringify(departs));
}

let count1 = 0,
  count2 = 0;

const update = (id, data) =>
  new Promise((resolve) => {
    const departs = JSON.parse(localStorage.getItem('departs'));
    const index = departs.findIndex((u) => u._id === id);
    departs[index] = { ...departs[index], ...data };
    localStorage.setItem('departs', JSON.stringify(departs));
    resolve(departs[index]);
  });

const add = (data) =>
  new Promise((resolve) => {
    const departs = JSON.parse(localStorage.getItem('departs'));
    departs.push({ ...data, _id: String(Math.ceil(Math.random() * 1000)) });
    localStorage.setItem('departs', JSON.stringify(departs));
    resolve(departs[departs.length - 1]);
  });

const remove = (id) =>
  new Promise((resolve) => {
    let departs = JSON.parse(localStorage.getItem('departs'));
    departs = departs.filter((obj) => obj._id != id);
    localStorage.setItem('departs', JSON.stringify(departs));
    resolve(true);
  });

const getById = (id) =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      console.log('departs.api.getById', ++count1);
      resolve(JSON.parse(localStorage.getItem('departs')).find((obj) => obj._id === id));
    }, 1000);
  });

const fetchAll = () =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      console.log('departs.api.fetchAll', ++count2);
      resolve(JSON.parse(localStorage.getItem('departs')));
    }, 1000);
  });

export default {
  fetchAll,
  getById,
  update,
  remove,
  add,
};
