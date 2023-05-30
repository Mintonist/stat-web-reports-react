import React, { useEffect, useState } from 'react';
import LoadingAnim from '../components/ui/loadingAnim';
import { IUser } from '../models';
import api from '../api/index.js';
import ItemsList from '../components/ui/itemsList';
import userStore from '../store/userStore';
import { IFilterConfig } from '../utils/sorter';
import { useHistory } from 'react-router-dom';
import ModalDialog from '../components/common/ModalDialog';
import UserEditForm from '../components/ui/userEditForm';

const filterConfig: IFilterConfig = {
  label: 'Роль',
  filterProperty: 'role',
  values: [
    { key: 'Все', value: '' },
    { key: 'Admin', value: 'admin' },
    { key: 'Editor', value: 'editor' },
    { key: 'Viewer', value: 'viewer' },
  ],
  value: '',
};

const Users = () => {
  const history = useHistory();
  const [users, setUsers] = useState<IUser[]>(null);
  const [modalState, setModalState] = useState<boolean>(false);

  const update = () => {
    api.users.fetchAll().then((data: IUser[]) => {
      if (!data) setUsers([]);
      data.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(data);
    });
  };

  useEffect(() => {
    update();
  }, []);

  const getBadges = (user: IUser) => {
    return [
      { _id: '1', title: user.role },
      { _id: '2', icon: '/personIcon.svg' },
    ];
  };

  return (
    <>
      <div className="d-flex flex-justify-content-between">
        <div className="flex-grow-1 mx-2">
          <h3>Управление пользователями</h3>
          <p className="m-0">
            Здесь Вы можете создавать/удалять/редактировать поьзователей. Доступные роли:
            <br /> <strong>Admin</strong>: доступно создание/редактирование/удаление отчётов, отделов и пользователей
            (весь функционал). Видит чужие личные отчёты.
            <br />
            <strong>Editor</strong>: доступно создание/редактирование/удаление отчётов. Не видит чужие личные отчёты.
            <br />
            <strong>Viewer</strong>: только просмотр общедоступных отчётов.
          </p>
        </div>
        {userStore.isAdmin() && (
          <>
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => setModalState(true)}
            >
              Создать пользователя
            </button>
            {modalState && (
              <ModalDialog
                title="Создание пользователя"
                descr=""
                onClose={() => {
                  setModalState(false);
                }}
                submitButton=""
                // isSmall
                onSubmit={() => {}}
              >
                <UserEditForm
                  user={null}
                  onSubmit={(data) => {
                    const newUser = api.users.add({ ...data });
                    update();
                    setModalState(false);
                  }}
                ></UserEditForm>
              </ModalDialog>
            )}
          </>
        )}
      </div>
      <hr className="hr" />
      {users === null && <LoadingAnim />}
      {users && users.length == 0 && <h4>{'Пользователей нет.'}</h4>}
      {users && users.length > 0 && (
        <>
          <ItemsList
            data={users}
            filterConfig={filterConfig}
            getBadges={getBadges}
            onItemSelect={(u: IUser) => {
              history.push(`/profile/${u._id}`);
            }}
            onItemEdit={userStore.isAdmin() ? () => {} : null}
            onItemRemove={
              userStore.isAdmin()
                ? (item) => {
                    api.users.remove(item._id);
                    update();
                  }
                : null
            }
          />
        </>
      )}
    </>
  );
};

export default Users;
