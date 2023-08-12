import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const pages = [
  { id: '1', label: 'Вставить проекцию', icon: '/pastViewIcon.png', link: '/' },
  { id: '2', label: 'Сохранить', icon: '/saveIcon.png', link: '/' },
  { id: '3', label: 'Экспорт в Excel', icon: '/excelIcon.png', link: '/' },
];

const ExcelBar = () => {
  const history = useHistory();

  return (
    <>
      <nav className="navbar sticky-top navbar-dark m-0 p-0" style={{ backgroundColor: '#3E8CBA' }}>
        <div className="container-fluid m-0 p-0">
          <div className="flex-grow-1">
            {pages.map((page) => (
              <div key={page.id} className="d-inline-flex flex-row p-1" style={{ borderRight: 'solid #3A78A6' }}>
                <NavLink className="navbar-brand px-3 m-0" to={page.link}>
                  <img src={page.icon} alt="" width="32" height="32" className="d-inline-block align-text-top me-2" />
                  {page.label}
                </NavLink>
              </div>
            ))}
          </div>

          <NavLink
            className="nav-link"
            aria-current="page"
            to="/"
            onClick={(e) => {
              e.preventDefault();
              history.goBack();
            }}
          >
            <img src="/exitIcon.svg" alt="" width="42" height="42" className="d-inline-block align-text-top me-1" />
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default ExcelBar;
