import React, { useEffect, useRef, useState } from 'react';
import LoadingAnim from '../components/ui/loadingAnim';
import { IDepart } from '../models';
import api from '../api/index.js';
import ItemsList from '../components/ui/itemsList';
import userStore from '../store/userStore';
import { useHistory } from 'react-router-dom';
import ModalDialog from '../components/common/ModalDialog';
import DepartEditForm from '../components/ui/departEditForm';

enum ModalType {
  NONE,
  CREATE,
  EDIT,
}

const Departs = () => {
  const history = useHistory();
  const [departs, setDeparts] = useState<IDepart[]>(null);
  const [modalState, setModalState] = useState<ModalType>(ModalType.NONE);
  const refDepartToEdit = useRef<IDepart>(null);

  const update = () => {
    api.departs.fetchAll().then((data: IDepart[]) => {
      if (!data) setDeparts([]);
      data.sort((a, b) => a.code.localeCompare(b.code));
      setDeparts(data);
    });
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <>
      <div className="d-flex flex-justify-content-between">
        <div className="flex-grow-1 mx-2">
          <h3>Управление отделами</h3>
          <p className="m-0">Отедлы помогают группировать отчёты для удобства поиска и рабоыт с ними. </p>
          <p>Здесь Вы можете создавать/удалять/редактировать отделы</p>
        </div>
        {userStore.isAdmin() && (
          <>
            <button
              type="button"
              className="btn me-2 btn-lg btn-secondary align-self-center"
              onClick={() => {
                setModalState(ModalType.CREATE);
              }}
            >
              Создать отдел
            </button>
            {modalState == ModalType.CREATE && (
              <ModalDialog
                title="Создание отдела"
                onClose={() => {
                  setModalState(ModalType.NONE);
                }}
              >
                <DepartEditForm
                  depart={null}
                  onSubmit={(data) => {
                    api.departs.add({ ...data });
                    update();
                    setModalState(ModalType.NONE);
                  }}
                ></DepartEditForm>
              </ModalDialog>
            )}
          </>
        )}
      </div>
      <hr className="hr" />
      {departs === null && <LoadingAnim />}
      {departs && departs.length == 0 && <h4>{'Отделов нет. Создайте первый отдел.'}</h4>}
      {departs && departs.length > 0 && (
        <>
          <ItemsList
            data={departs}
            onItemSelect={(dep: IDepart) => {
              history.push(`/depart/${dep._id}`);
            }}
            onItemEdit={
              userStore.isAdmin()
                ? (item) => {
                    refDepartToEdit.current = item;
                    setModalState(ModalType.EDIT);
                  }
                : null
            }
            onItemRemove={
              userStore.isAdmin()
                ? (item) => {
                    api.departs.remove(item._id);
                    update();
                  }
                : null
            }
          />
        </>
      )}
      {modalState == ModalType.EDIT && (
        <ModalDialog
          title="Редактирование отдела"
          onClose={() => {
            setModalState(ModalType.NONE);
          }}
        >
          <DepartEditForm
            depart={refDepartToEdit.current}
            onSubmit={(data) => {
              //setUser({ ...user, ...data });
              console.log(data);
              api.departs.update(refDepartToEdit.current._id, { ...data });
              refDepartToEdit.current = null;
              setModalState(ModalType.NONE);
              update();
            }}
          ></DepartEditForm>
        </ModalDialog>
      )}
    </>
  );
};

export default Departs;
