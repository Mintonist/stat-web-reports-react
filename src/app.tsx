import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/ui/navBar';
import Depart from './layouts/depart';
import Departs from './layouts/departsList';
import Login from './layouts/login';

import Main from './layouts/main';
import NotFound from './layouts/notFound';
import Profile from './layouts/profile';
import Report from './layouts/report';
import Users from './layouts/usersList';
import { IUser } from './models';
import userStore from './store/userStore';
import { ISortConfig } from './utils/sorter';

export const reportSortConfig: ISortConfig[] = [
  { label: 'По алфавиту', asc: true, sortProperty: 'name' },
  { label: 'По рейтингу', asc: false, sortProperty: 'rate' },
  { label: 'По дате', asc: false, sortProperty: 'change_ts' },
];

const App = () => {
  const updateUserFromLocalStorage = () => {
    // излекаем данные пользователя
    const str = localStorage.getItem('user');
    const user: IUser = str ? JSON.parse(str) : null;
    userStore.setUser(user);
  };

  // useEffect(() => {
  //   updateUserFromLocalStorage();
  // }, []);

  updateUserFromLocalStorage();

  // обёртка для Route
  const NavRoute = ({ exact, path, component: Component }) => (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <>
          <div className="vh-100 d-flex flex-column justify-content-start ">
            <NavBar />
            {/* делам обрамление с макс.шириной на всю высоту экрана */}
            <div className="app-data p-3 w-100 shadow flex-grow-1">
              <Component {...props} />
            </div>
          </div>
        </>
      )}
    />
  );

  console.log('userStore.user', userStore.user);
  return (
    <>
      {!userStore.user && (
        <Switch>
          <Route path="/" component={Login} />
          <Redirect to="/" />
        </Switch>
      )}
      {userStore.user && (
        <Switch>
          {/* <Route path="/login" component={Login} />
        <Route path="/users/:userId?/edit" component={Users} />
        <Route path="/users/:userId?" component={Users} />
        <Route path="/users/:userId" component={UserInfo} /> */}

          <Route exact path="/report/:id?" component={Report} />
          <NavRoute exact path="/users" component={Users} />
          <NavRoute exact path="/profile/:id?" component={Profile} />
          <NavRoute exact path="/departs" component={Departs} />
          <NavRoute exact path="/depart/:id?" component={Depart} />
          <NavRoute exact path="/main" component={Main} />
          <NavRoute exact path="/404" component={NotFound} />
          <Redirect exact from="/" to="/main" />
          <Redirect to="/404" />
        </Switch>
      )}
    </>
  );
};

export default App;
