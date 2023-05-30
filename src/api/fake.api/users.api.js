const users = [
  {
    _id: '111',
    name: 'Джон Дориан',
    email: 'Jony7351@tw.com',
    login: 'John_D',
    password: 'John_D',
    role: 'admin',
    create_ts: 0,
    login_ts: 0,
  },
  {
    _id: '222',
    name: 'Кокс',
    email: 'white4571@twipet.com',
    login: 'Cox_P',
    password: 'Cox_P',
    role: 'viewer',
    create_ts: 0,
    login_ts: 0,
  },
  {
    _id: '333',
    name: 'Боб Келсо',
    email: 'bob007@tw.com',
    login: 'Kelso_B',
    password: 'Kelso_B',
    role: 'editor',
    create_ts: 0,
    login_ts: 0,
  },
];

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(users));
}

const fetchAll = () =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      resolve(JSON.parse(localStorage.getItem('users')));
    }, 600);
  });

const update = (id, data) =>
  new Promise((resolve) => {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex((u) => u._id === id);
    users[index] = { ...users[index], ...data };
    localStorage.setItem('users', JSON.stringify(users));
    resolve(users[index]);
  });

const add = (data) =>
  new Promise((resolve) => {
    const users = JSON.parse(localStorage.getItem('users'));
    users.push({ ...data, _id: Math.ceil(Math.random() * 1000) });
    localStorage.setItem('users', JSON.stringify(users));
    resolve(users[users.length - 1]);
  });

const remove = (id) =>
  new Promise((resolve) => {
    let users = JSON.parse(localStorage.getItem('users'));
    users = users.filter((obj) => obj._id != id);
    localStorage.setItem('users', JSON.stringify(users));
    resolve(users[users.length - 1]);
  });

const getById = (id) =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      resolve(JSON.parse(localStorage.getItem('users')).find((obj) => obj._id === id));
    }, 500);
  });

const login = (login, pass) =>
  new Promise((resolve) => {
    window.setTimeout(function () {
      const user = JSON.parse(localStorage.getItem('users')).find(
        (obj) => obj.login === login && obj.password === pass
      );
      resolve(user);
    }, 500);
  });

export default {
  fetchAll,
  getById,
  update,
  remove,
  login,
  add,
};
