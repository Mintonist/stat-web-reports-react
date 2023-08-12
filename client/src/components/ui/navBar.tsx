import * as React from 'react';
import { NavLink } from 'react-router-dom';
import userStore from '../../store/userStore';

const NavBar = () => {
  const pages = [
    { id: 1, label: 'Отделы', link: '/departs' },
    // { id: 2, label: 'Login', link: '/' },
    { id: 3, label: 'Пользователи', link: '/users' },
  ];

  const handleExit = () => {
    localStorage.removeItem('user');
    userStore.setUser(null);
    window.location.replace('/login');
  };

  return (
    <>
      <nav className="navbar sticky-top navbar-dark m-0 p-0" style={{ backgroundColor: '#3E8CBA' }}>
        <div className="container-fluid m-0 p-0">
          <NavLink className="navbar-brand p-2 pe-3 m-0" style={{ backgroundColor: '#3A78A6' }} to="/">
            <img src="/logo64.png" alt="" width="34" height="34" className="d-inline-block align-text-top me-1" />
            Stat Platform
          </NavLink>

          {userStore.isAdmin() && (
            <ul className="navbar-nav me-auto flex-row">
              {pages.map((page) => (
                <li key={page.id} className="nav-item">
                  <NavLink
                    activeClassName="active"
                    className="nav-link"
                    aria-current="page"
                    to={page.link}
                    // onClick={() => setActivePage(page.id)}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ backgroundColor: '#3E8CBA', border: 'none' }}
                    >
                      {page.label}
                    </button>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex">
            {userStore.isAdmin() && (
              <NavLink className="nav-link" aria-current="page" to="/report">
                <button type="button" className="btn btn-secondary">
                  Создать отчёт
                </button>
              </NavLink>
            )}
            <div className="btn-group ms-2">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle"
                style={{ backgroundColor: '#3E8CBA', border: 'none' }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userStore.user.login}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink activeClassName="" className="dropdown-item" to="/profile">
                    Профиль
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <div role="button" className="dropdown-item" onClick={handleExit}>
                    Выход
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
