import React from 'react';

interface TableProps {
  children: Array<any>;
}

const Table = ({ children }: TableProps) => {
  return <table className="table">{children}</table>;
};

export default Table;
