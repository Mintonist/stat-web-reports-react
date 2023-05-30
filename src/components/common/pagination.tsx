import * as React from 'react';
import _ from 'lodash';

interface IPgainationProps {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: any;
}

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange }: IPgainationProps) => {
  const pageCount = Math.ceil(itemsCount / pageSize);
  if (pageCount == 1) return null;

  const pages = _.range(1, pageCount + 1);
  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li className={'page-item ' + (page == currentPage ? 'active' : '')} key={page}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
