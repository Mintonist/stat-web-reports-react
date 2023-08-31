import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reportSortConfig } from '../app';
import ItemsList from '../components/ui/itemsList';
import LoadingAnim from '../components/ui/loadingAnim';
import { IReport } from '../models';
//import userStore from '../store/userMobx';
import { useHistory } from 'react-router-dom';
import ModalDialog from '../components/common/ModalDialog';
import UserEditForm from '../components/ui/userEditForm';
import ReportEditForm from '../components/ui/reportEditForm';
//import { useReports } from '../hooks/useReports';
//import { useDeparts } from '../hooks/useDeparts';
//import { useUsers } from '../hooks/useUsers';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserInfo, updateUser, getUserById, isCurrentUserAdmin } from '../store/users';
import { getDeparts } from '../store/departs';
import { filterReports, updateReport, deleteReport } from '../store/reports';

enum ModalType {
  NONE,
  USER,
  REPORT,
}

const Profile = () => {
  const dispatch: any = useDispatch();
  const history = useHistory();
  const loggedUser = useSelector(getCurrentUserInfo());
  const isAdmin = useSelector(isCurrentUserAdmin());
  let { id: userId } = useParams();
  //if (!userId) userId = userStore.user._id;
  if (!userId) userId = loggedUser._id;

  //const { getUser, updateUser } = useUsers();
  //const user = getUser(userId);
  const user = useSelector(getUserById(userId));

  //const { filterReports, deleteReport, updateReport } = useReports();
  const reports = useSelector(filterReports(userId, false));

  //const { departs } = useDeparts();
  const departs = useSelector(getDeparts());

  const [modalState, setModalState] = useState<ModalType>(ModalType.NONE);
  const refReportToEdit = useRef<IReport>(null);

  // const update = () => {
  //   api.users.getById(userId).then((u: IUser) => {
  //     console.log('user', u);
  //     if (u) {
  //       setUser(u);
  //       api.reports.fetchAll(userStore.user ? userStore.user._id : 0).then((data: IReport[]) => {
  //         if (!data) data = [];
  //         else { .filter((obj) => obj.create_user_id === userId || obj.is_public)
  //           data = data.filter((a) => a.create_user_id == u._id);
  //           data.sort((a, b) => a.name.localeCompare(b.name));
  //         }
  //         setReports(data);
  //       });
  //     }
  //   });
  //   api.departs.fetchAll().then((data: IDepart[]) => {
  //     if (!data) data = [];
  //     data.sort((a, b) => a.code.localeCompare(b.code));
  //     setDeparts(data);
  //   });
  // };
  // useEffect(() => {
  //   update();
  // }, []);

  const getBadges = (report: IReport) => {
    const res = [];
    if (departs && report.depart_id) {
      const dep = departs.filter((d) => d._id == report.depart_id);
      if (dep && dep.length > 0) res.push({ _id: dep[0]._id, title: dep[0].code, color: dep[0].color });
    }
    if (!report.is_public && report.create_user_id == loggedUser._id) res.push({ _id: '0', icon: '/personIcon.svg' });
    return res;
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
          {(isAdmin /*userStore.isAdmin()*/ || loggedUser._id == userId) && user && (
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => {
                setModalState(ModalType.USER);
              }}
            >
              Редактировать
            </button>
          )}
        </div>
      )}
      {user && modalState == ModalType.USER && (
        <ModalDialog
          title="Редактирование пользователя"
          onClose={() => {
            setModalState(ModalType.NONE);
          }}
        >
          <UserEditForm
            user={user}
            onSubmit={async (data) => {
              //setUser({ ...user, ...data });
              //api.users.update(user._id, { ...data });
              //await updateUser(userId, data);
              dispatch(updateUser(userId, data));
              setModalState(ModalType.NONE);
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
            onItemEdit={
              isAdmin /*userStore.isAdmin()*/
                ? (data) => {
                    refReportToEdit.current = data;
                    setModalState(ModalType.REPORT);
                  }
                : null
            }
            onItemRemove={
              isAdmin /*userStore.isAdmin()*/
                ? (item) => {
                    dispatch(deleteReport(item._id));
                    // api.reports.remove(item._id);
                    // update();
                  }
                : null
            }
          />
        </>
      )}
      {refReportToEdit.current && modalState == ModalType.REPORT && (
        <ModalDialog
          title="Редактирование отчёта"
          onClose={() => {
            setModalState(ModalType.NONE);
          }}
        >
          <ReportEditForm
            report={refReportToEdit.current}
            onSubmit={(data) => {
              dispatch(updateReport(refReportToEdit.current._id, { ...refReportToEdit.current, ...data }));
              //api.reports.update(refReportToEdit.current._id, { ...refReportToEdit.current, ...data });
              setModalState(ModalType.NONE);
              //update();
            }}
          ></ReportEditForm>
        </ModalDialog>
      )}
    </>
  );
};

export default Profile;
