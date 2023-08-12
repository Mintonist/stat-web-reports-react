import React from 'react';

const LoadingAnim = () => {
  return (
    <>
      <div className="d-flex h-auto justify-content-center align-items-center">
        <div className="lds-ellipsis m-0">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default LoadingAnim;
