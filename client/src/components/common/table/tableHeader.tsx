import React from 'react';

interface TableProps {
  onSort: any;
  sortBy: any;
  columns: any;
}

const TableHeader = ({ onSort, sortBy, columns }: TableProps) => {
  const handleSort = (name: string) => {
    if (sortBy.path == name) {
      onSort({ path: name, order: sortBy.order == 'asc' ? 'desc' : 'asc' });
    } else {
      onSort({ path: name, order: 'asc' });
    }
  };

  return (
    <thead className="text-center">
      <tr>
        {Object.keys(columns).map((key) => (
          <th
            key={key}
            onClick={columns[key].path ? () => handleSort(columns[key].path) : undefined}
            {...{ role: columns[key].path && 'button' }}
            scope="col"
          >
            {columns[key].title}
            {columns[key].path && sortBy.path == columns[key].path && sortBy.order == 'asc' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            )}
            {columns[key].path && sortBy.path == columns[key].path && sortBy.order == 'desc' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-up-fill"
                viewBox="0 0 16 16"
              >
                <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
              </svg>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
