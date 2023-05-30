import React, { useEffect, useState } from 'react';
import { IDepart, IReport } from '../models';
import api from '../api/index.js';
import ItemsList from '../components/ui/itemsList';
import userStore from '../store/userStore';
import LoadingAnim from '../components/ui/loadingAnim';
import { BadgeList } from '../components/ui/badges';
import { IBadge } from '../components/ui/badges/badge';
import { useHistory } from 'react-router-dom';
import { reportSortConfig } from '../app';

const Main = () => {
  const history = useHistory();
  const [reports, setReports] = useState<IReport[]>(null);
  const [departs, setDeparts] = useState<IDepart[]>(null);

  const update = () => {
    api.reports.fetchAll().then((data: IReport[]) => {
      if (!data) setReports([]);
      data = data.filter((a) => !a.depart_id);
      data.sort((a, b) => a.name.localeCompare(b.name));
      setReports(data);
    });
    api.departs.fetchAll().then((data: IDepart[]) => {
      if (!data) setDeparts([]);
      data.sort((a, b) => a.code.localeCompare(b.code));
      setDeparts(data);
    });
  };

  const getBadges = (report: IReport) => {
    const res = [];
    if (departs && report.depart_id) {
      const dep = departs.filter((d) => d._id == report.depart_id);
      if (dep && dep.length > 0) res.push({ _id: dep[0]._id, title: dep[0].code, color: dep[0].color });
    }
    if (report.create_user_id == userStore.user._id) res.push({ _id: '0', icon: '/personIcon.svg' });
    return res;
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <>
      <div className="d-flex flex-justify-content-between">
        <div className="flex-grow-1 mx-2">
          <h3>Отчёты отделов</h3>
          <p className="m-0">Выберите отдел для просмотра отчётов отдела. </p>
        </div>
      </div>
      <hr className="hr" />
      {departs === null && <LoadingAnim />}
      {departs && departs.length == 0 && <h4>{'Отделов нет. Создайте первый отдел.'}</h4>}
      {departs && departs.length > 0 && (
        <div>
          <BadgeList
            badges={departs.map((d) => ({ _id: d._id, badgeClass: 'fs-2 my-1 p-3', title: d.code, color: d.color }))}
            onSelect={(info: IBadge) => {
              history.push(`/depart/${info._id}`);
            }}
          />
        </div>
      )}

      <hr className="hr mt-5" />
      <div className="d-flex flex-justify-content-between">
        <div className="flex-grow-1 mx-2">
          <h3>Общие отчёты</h3>
          <p className="m-0">Эти отчёты не принадлежат ни одному отделу. </p>
        </div>
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

export default Main;
