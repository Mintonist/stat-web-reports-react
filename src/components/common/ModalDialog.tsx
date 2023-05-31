import React from 'react';

interface ModalPropflex {
  title: string;
  descr?: string;
  isSmall?: boolean;
  children: React.ReactNode;
  onClose: any;
  submitButton?: string;
  onSubmit?: any;
}

const ModalDialog = ({
  title,
  descr = '',
  children,
  onClose,
  submitButton = '',
  onSubmit = null,
  isSmall = false,
}: ModalPropflex) => {
  return (
    <div
      className="modal show text-start"
      role="dialog"
      tabIndex={-1}
      onClick={(e: React.MouseEvent) => {
        if (e.target == e.currentTarget) onClose();
      }}
    >
      <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable '} style={{ width: '600px' }}>
        <div className="modal-content">
          <div className="modal-header p-2 px-3">
            <div>
              {title.length < 25 ? <h3 className="text-xl m-0">{title}</h3> : <h4 className="text-xl m-0">{title}</h4>}

              {descr && <p className="fs-6 fw-light lh-1 m-0 mt-2">{descr}</p>}
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={(e: React.MouseEvent) => {
                onClose();
              }}
            ></button>
          </div>
          <div className="modal-body p-0">{children}</div>
          {submitButton && (
            <div className="modal-footer p-1">
              <span className="btn btn-warning m-2 p-1 px-3" onClick={() => onSubmit()}>
                {submitButton}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    /* <div
        className="fixed bg-black/50 top-0 right-0 left-0 bottom-0"
        onClick={() => {
          console.log('on close dialog');
          onClose();
        }}
      ></div>
      <div className="w-[500px] p-5 rounded bg-white absolute top-10 left-1/2 -translate-x-1/2"></div> */
  );
};

export default ModalDialog;
