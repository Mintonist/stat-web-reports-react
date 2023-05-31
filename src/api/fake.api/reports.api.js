export const reportsAsObject = {
  doctor: {
    _id: '11',
    name: 'Отчёт 11',
    depart_id: '11',
    is_public: true,
    create_ts: 0,
    create_user_id: '111',
    change_ts: 0,
    change_user_id: '111',
    rate: 3,
  },
  waiter: {
    _id: '22',
    name: 'Отчёт 22',
    depart_id: '11',
    is_public: true,
    create_ts: 0,
    create_user_id: '111',
    change_ts: 44,
    change_user_id: '111',
    rate: 56,
  },
  physics: {
    _id: '33',
    name: 'Отчёт 33',
    is_public: false,
    create_ts: 0,
    create_user_id: '333',
    change_ts: 154,
    change_user_id: '333',
    rate: 24,
  },
  engineer: {
    _id: '44',
    name: 'Отчёт 44 c длинным названием',
    is_public: true,
    create_ts: 0,
    create_user_id: '111',
    change_ts: 56,
    change_user_id: '222',
    rate: 39,
  },
  actor: {
    _id: '55',
    name: 'Отчёт 55 с очень длинным названием',
    depart_id: '22',
    is_public: true,
    create_ts: 0,
    create_user_id: '222',
    change_ts: 245,
    change_user_id: '333',
    rate: 42,
  },
  cook: {
    _id: '66',
    name: 'Отчёт 66',
    depart_id: '22',
    is_public: false,
    create_ts: 0,
    create_user_id: '111',
    change_ts: 44,
    change_user_id: '111',
    rate: 41,
  },
};

export const reports = [
  reportsAsObject.actor,
  reportsAsObject.cook,
  reportsAsObject.doctor,
  reportsAsObject.engineer,
  reportsAsObject.physics,
  reportsAsObject.waiter,
];

if (!localStorage.getItem('reports')) {
  localStorage.setItem('reports', JSON.stringify(reports));
}

const update = (id, data) =>
  new Promise((resolve) => {
    const reports = JSON.parse(localStorage.getItem('reports'));
    const index = reports.findIndex((u) => u._id === id);
    reports[index] = { ...reports[index], ...data };
    localStorage.setItem('reports', JSON.stringify(reports));
    resolve(reports[index]);
  });

const add = (data) =>
  new Promise((resolve) => {
    const reports = JSON.parse(localStorage.getItem('reports'));
    reports.push({ ...data, _id: Math.ceil(Math.random() * 1000) });
    localStorage.setItem('reports', JSON.stringify(reports));
    resolve(reports[reports.length - 1]);
  });

const remove = (id) =>
  new Promise((resolve) => {
    let reports = JSON.parse(localStorage.getItem('reports'));
    reports = reports.filter((obj) => obj._id != id);
    localStorage.setItem('reports', JSON.stringify(reports));
    resolve(reports[reports.length - 1]);
  });

const getById = (id) =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      resolve(JSON.parse(localStorage.getItem('reports')).find((obj) => obj._id === id));
    }, 500);
  });

const fetchAll = (userId) =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      resolve(
        JSON.parse(localStorage.getItem('reports')).filter((obj) => obj.create_user_id === userId || obj.is_public)
      );
    }, 500);
  });

export default {
  fetchAll,
  getById,
  update,
  remove,
  add,
};
