import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { reportSortConfig } from '../app';
import ItemsList from '../components/ui/itemsList';
import LoadingAnim from '../components/ui/loadingAnim';
import { IDepart, IReport } from '../models';
import userStore from '../store/userStore';
import { useHistory } from 'react-router-dom';
import Badge from '../components/ui/badges/badge';
import DepartEditForm from '../components/ui/departEditForm';
import ModalDialog from '../components/common/ModalDialog';
import ReportEditForm from '../components/ui/reportEditForm';

enum ModalType {
  NONE,
  DEPART,
  REPORT,
}

const Depart = () => {
  const history = useHistory();
  let { id: departId } = useParams();

  const [reports, setReports] = useState<IReport[]>(null);
  const [depart, setDepart] = useState<IDepart>(null);
  const [modalState, setModalState] = useState<ModalType>(ModalType.NONE);
  const refReportToEdit = useRef<IReport>(null);

  const update = () => {
    api.reports.fetchAll(userStore.user ? userStore.user._id : 0).then((data: IReport[]) => {
      if (!data) data = [];
      else {
        data = data.filter((a) => a.depart_id == departId);
        data.sort((a, b) => a.name.localeCompare(b.name));
      }
      setReports(data);
    });
    api.departs.getById(departId).then((dep: IDepart) => {
      console.dir(dep);
      setDepart(dep);
    });
  };
  useEffect(() => {
    update();
  }, []);

  const getBadges = (report: IReport) => {
    const res = [];
    if (depart && report.depart_id) {
      res.push({ _id: depart._id, title: depart.code, color: depart.color });
    }
    if (!report.is_public && report.create_user_id == userStore.user._id)
      res.push({ _id: '0', icon: '/personIcon.svg' });
    return res;
  };

  return (
    <>
      {depart === null && <LoadingAnim />}
      {depart && (
        <div className="d-flex flex-justify-content-between">
          <div className="flex-grow-1 mx-2 d-flex align-items-center">
            {/* <h3>Отдел </h3> */}
            {depart && <Badge {...depart} title={depart.name} badgeClass={'fs-1 p-3'} />}
          </div>
          {userStore.isAdmin() && (
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => {
                setModalState(ModalType.DEPART);
              }}
            >
              Редактировать
            </button>
          )}
        </div>
      )}
      {modalState == ModalType.DEPART && (
        <ModalDialog
          title="Редактирование отдела"
          onClose={() => {
            setModalState(ModalType.NONE);
          }}
        >
          <DepartEditForm
            depart={depart}
            onSubmit={(data) => {
              setDepart({ ...depart, ...data });
              api.departs.update(depart._id, { ...data });

              setModalState(ModalType.NONE);
              //update();
            }}
          ></DepartEditForm>
        </ModalDialog>
      )}
      <hr className="hr mt-4" />
      <div className="flex-grow-1 mx-2">
        {/* <h3>Отчёты, созданные пользователем</h3> */}
        <p className="m-0">Отчёты отдела:</p>
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
              userStore.isAdmin()
                ? (data) => {
                    refReportToEdit.current = data;
                    setModalState(ModalType.REPORT);
                  }
                : null
            }
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
              api.reports.update(refReportToEdit.current._id, { ...refReportToEdit.current, ...data });
              setModalState(ModalType.NONE);
              update();
            }}
          ></ReportEditForm>
        </ModalDialog>
      )}
    </>
  );
};

export default Depart;
