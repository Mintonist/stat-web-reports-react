import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { reportSortConfig } from '../app';
import ItemsList from '../components/ui/itemsList';
import LoadingAnim from '../components/ui/loadingAnim';
import { IDepart, IReport, IUser } from '../models';
import userStore from '../store/userStore';
import { useHistory } from 'react-router-dom';
import ModalDialog from '../components/common/ModalDialog';
import UserEditForm from '../components/ui/userEditForm';

const Profile = () => {
  const history = useHistory();
  let { id: userId } = useParams();
  if (!userId) userId = userStore.user._id;

  const [reports, setReports] = useState<IReport[]>(null);
  const [departs, setDeparts] = useState<IDepart[]>(null);
  const [user, setUser] = useState<IUser>(null);
  const [modalState, setModalState] = useState<boolean>(false);

  const update = () => {
    api.users.getById(userId).then((u: IUser) => {
      if (u) {
        setUser(u);
        api.reports.fetchAll().then((data: IReport[]) => {
          if (!data) data = [];
          else {
            data = data.filter((a) => a.create_user_id == u._id);
            data.sort((a, b) => a.name.localeCompare(b.name));
          }
          setReports(data);
        });
      }
    });
    api.departs.fetchAll().then((data: IDepart[]) => {
      if (!data) data = [];
      data.sort((a, b) => a.code.localeCompare(b.code));
      setDeparts(data);
    });
  };
  useEffect(() => {
    update();
  }, []);

  const getBadges = (report: IReport) => {
    const res = [];
    if (departs && report.depart_id) {
      const dep = departs.filter((d) => d._id == report.depart_id);
      if (dep && dep.length > 0) res.push({ _id: dep[0]._id, title: dep[0].code, color: dep[0].color });
    }
    if (report.create_user_id == userStore.user._id) res.push({ _id: '0', icon: '/personIcon.svg' });
    return res;
  };

  const handleEdit = () => {
    setModalState(true);
  };

  return (
    <>
      {user === null && <LoadingAnim />}
      {user && (
        <div className="d-flex flex-justify-content-between">
          <div className="flex-grow-1 mx-2">
            <h3>Пользователь: {user ? user.name : ''}</h3>
            <p className="m-0">
              Логин: <strong>{user ? user.login : ''}</strong>
            </p>
            <p className="m-0">
              Email: <strong>{user ? user.email : ''}</strong>
            </p>
            <p className="m-0">
              Роль: <strong>{user ? user.role : ''}</strong>
            </p>
          </div>
          {(userStore.isAdmin() || userStore.user._id == userId) && user && (
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => handleEdit()}
            >
              Редактировать
            </button>
          )}
        </div>
      )}
      {user && modalState && (
        <ModalDialog
          title="Редактирование пользователя"
          descr=""
          onClose={() => {
            setModalState(false);
          }}
          submitButton=""
          // isSmall
          onSubmit={() => {}}
        >
          <UserEditForm
            user={user}
            onSubmit={(data) => {
              setUser({ ...user, ...data });
              api.users.update(user._id, { ...data });
              setModalState(false);
            }}
          ></UserEditForm>
        </ModalDialog>
      )}
      <hr className="hr mt-4" />
      <div className="flex-grow-1 mx-2">
        {/* <h3>Отчёты, созданные пользователем</h3> */}
        <p className="m-0">Отчёты, созданные пользователем:</p>
      </div>
      <hr className="hr" />
      {reports === null && <LoadingAnim />}
      {reports && reports.length == 0 && <h4>{'Отчётов нет. Создайте первый отчёт.'}</h4>}
      {reports && reports.length > 0 && (
        <>
          <ItemsList
            data={reports}
            sortConfigs={reportSortConfig}
            getBadges={getBadges}
            onItemSelect={(rep: IReport) => {
              history.push(`/report/${rep._id}`);
            }}
            onItemEdit={userStore.isAdmin() ? () => {} : null}
            onItemRemove={
              userStore.isAdmin()
                ? (item) => {
                    api.reports.remove(item._id);
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

export default Profile;
