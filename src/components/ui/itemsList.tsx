import React, { useState } from 'react';
import { filterData, IFilterConfig, IKeyValue, ISortConfig, sortData } from '../../utils/sorter';
import { paginate } from '../../utils/paginate';
import { TextField } from '../common/form';
import Pagination from '../common/pagination';
import { BadgeList } from './badges';

interface GroupListProps {
  data: Object | Array<Object>;
  pageSize?: number;
  valueProperty?: string;
  contentProperty?: string;
  colorProperty?: string | null;
  getBadges?: Function;
  sortConfigs?: ISortConfig[];
  filterConfig?: IFilterConfig;
  onItemSelect?: any;
  onItemEdit?: any;
  onItemRemove?: any;
}

const ItemsList = ({
  data,
  pageSize = 8,
  valueProperty = '_id',
  contentProperty = 'name',
  colorProperty = 'color',
  getBadges = null,
  sortConfigs = [],
  filterConfig = null,
  onItemSelect = null,
  onItemEdit = null,
  onItemRemove = null,
}: GroupListProps) => {
  const items: Array<Object> = Array.isArray(data) ? data : Object.keys(data).map((k) => data[k]);

  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<ISortConfig>(null);
  const [filter, setFilter] = useState<IFilterConfig>(null);

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

  const handleSearchStringChange = (target) => {
    const value: string = target.value.trim();
    setSearchString(value);
    if (value.length > 0) {
      setCurrentPage(1);
    }
  };

  const handleSortChange = (obj: ISortConfig) => {
    setSortConfig(obj);
  };
  const handleFilterChange = (str: string) => {
    // filterConfig.value = str;
    setFilter({ ...filterConfig, value: str });
  };

  let filteredItems = searchString
    ? items.filter((u) => u[contentProperty].toLowerCase().indexOf(searchString.toLowerCase()) != -1)
    : items;
  filteredItems = filter && filter.value ? filterData(filteredItems, filter) : filteredItems;
  const sortedUsers = sortConfig
    ? sortData(filteredItems, sortConfig)
    : /**_.orderBy(filteredItems, [sortConfig.sortProperty], [sortConfig.asc ? 'asc' : 'desc'])**/
      filteredItems;
  const croppedItems = paginate(sortedUsers, currentPage, pageSize);

  return (
    <>
      <div className="d-flex justify-content-between mx-2 my-0">
        <div className="w-25">
          <TextField
            placeholder="Поиск..."
            name="search"
            mb={0}
            value={searchString}
            onChange={handleSearchStringChange}
          />
        </div>
        <div>
          {filterConfig && (
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-light dropdown-toggle"
                // style={{ backgroundColor: '#3E8CBA', border: 'none' }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {filterConfig.label}
              </button>
              <ul className="dropdown-menu">
                {filterConfig.values.map((obj: IKeyValue) => (
                  <li key={obj.key}>
                    <div role="button" className="dropdown-item" onClick={() => handleFilterChange(obj.value)}>
                      {obj.key}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sortConfigs && sortConfigs.length > 0 && (
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-light dropdown-toggle"
                // style={{ backgroundColor: '#3E8CBA', border: 'none' }}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Сортировка
              </button>
              <ul className="dropdown-menu">
                {sortConfigs.map((obj: ISortConfig) => (
                  <li key={obj.label}>
                    <div role="button" className="dropdown-item" onClick={() => handleSortChange(obj)}>
                      {obj.label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ul className="list-group py-2">
        {croppedItems.map((item) => (
          <li key={item[valueProperty]} className="list-group-item p-0 m-2 my-1 border-0">
            <div
              className="p-2 px-3 rounded"
              style={
                item[colorProperty]
                  ? {
                      backgroundColor: item[colorProperty] + 'AA',
                      border: '2px solid ' + item[colorProperty],
                    }
                  : {
                      backgroundColor: '#FFF',
                      border: '2px solid #CCC',
                    }
              }
              role={onItemSelect && 'button'}
              onDoubleClick={() => {
                onItemSelect && onItemSelect(item);
              }}
            >
              <div className="d-flex justify-content-between">
                <strong className="fw-bold w-50">{item[contentProperty]}</strong>
                <div className="me-4">{getBadges && getBadges(item) && <BadgeList badges={getBadges(item)} />}</div>
                <div className="d-flex justify-content-end">
                  {onItemEdit && (
                    <img
                      role="button"
                      src="/editIcon.svg"
                      alt=""
                      width="28"
                      height="28"
                      className="d-inline-block align-text-top me-3"
                      onClick={() => {
                        onItemEdit && onItemEdit(item);
                      }}
                    />
                  )}
                  {onItemRemove && (
                    <img
                      role="button"
                      src="/removeIcon.svg"
                      alt=""
                      width="28"
                      height="28"
                      className="d-inline-block align-text-top me-0"
                      onClick={() => {
                        onItemRemove && onItemRemove(item);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-center">
        <Pagination
          itemsCount={sortedUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ItemsList;
