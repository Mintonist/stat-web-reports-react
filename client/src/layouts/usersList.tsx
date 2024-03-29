import React, { useRef, useState } from 'react';
import LoadingAnim from '../components/ui/loadingAnim';
import { IUser } from '../models';
import ItemsList from '../components/ui/itemsList';
//import userStore from '../store/userMobx';
import { IFilterConfig } from '../utils/sorter';
import { useHistory } from 'react-router-dom';
import ModalDialog from '../components/common/ModalDialog';
import UserEditForm from '../components/ui/userEditForm';
//import { useUsers } from '../hooks/useUsers';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserInfo, getUsers, updateUser, createUser, deleteUser, isCurrentUserAdmin } from '../store/users';

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

enum ModalType {
  NONE,
  CREATE,
  EDIT,
}

const Users = () => {
  const dispatch: any = useDispatch();
  const history = useHistory();
  //const { users, addUser, updateUser, deleteUser } = useUsers();
  const users = useSelector(getUsers());
  const loggedUser = useSelector(getCurrentUserInfo());
  const isAdmin = useSelector(isCurrentUserAdmin());

  const [modalState, setModalState] = useState<ModalType>(ModalType.NONE);
  const refUserToEdit = useRef<IUser>(null);

  // const update = () => {
  //   api.users.fetchAll().then((data: IUser[]) => {
  //     if (!data) setUsers([]);
  //     data.sort((a, b) => a.name.localeCompare(b.name));
  //     setUsers(data);
  //   });
  // };

  // useEffect(() => {
  //   update();
  // }, []);

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
        {isAdmin && (
          <>
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => {
                setModalState(ModalType.CREATE);
              }}
            >
              Создать пользователя
            </button>
            {modalState == ModalType.CREATE && (
              <ModalDialog
                title="Создание пользователя"
                onClose={() => {
                  setModalState(ModalType.NONE);
                }}
              >
                <UserEditForm
                  user={null}
                  onSubmit={(data) => {
                    dispatch(createUser({ ...data }));
                    //api.users.add({ ...data });
                    //update();
                    setModalState(ModalType.NONE);
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
            onItemEdit={
              isAdmin
                ? (item) => {
                    refUserToEdit.current = item;
                    setModalState(ModalType.EDIT);
                  }
                : null
            }
            onItemRemove={
              isAdmin
                ? (item) => {
                    dispatch(deleteUser(item._id));
                    //api.users.remove(item._id);
                    //update();
                  }
                : null
            }
          />
        </>
      )}
      {modalState == ModalType.EDIT && (
        <ModalDialog
          title="Редактирование пользователя"
          onClose={() => {
            setModalState(ModalType.NONE);
          }}
        >
          <UserEditForm
            user={refUserToEdit.current}
            onSubmit={(data) => {
              //setUser({ ...user, ...data });
              console.log(data);
              dispatch(updateUser(refUserToEdit.current._id, { ...data }));
              // api.users.update(refUserToEdit.current._id, { ...data });
              refUserToEdit.current = null;
              setModalState(ModalType.NONE);
              //update();
            }}
          ></UserEditForm>
        </ModalDialog>
      )}
    </>
  );
};

export default Users;
