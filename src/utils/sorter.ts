export interface ISortConfig {
  asc?: boolean;
  label: string;
  sortProperty: string;
}

export function sortData(data: Array<Object>, { asc = true, sortProperty }: ISortConfig): Array<Object> {
  data.sort((a, b) => {
    if (a[sortProperty] === b[sortProperty]) return 0;
    else {
      switch (typeof a[sortProperty]) {
        case 'string':
          return asc ? a[sortProperty].localeCompare(b[sortProperty]) : !a[sortProperty].localeCompare(b[sortProperty]);

        case 'number':
          return asc ? (a[sortProperty] > b[sortProperty] ? 1 : -1) : a[sortProperty] < b[sortProperty] ? 1 : -1;

        case 'boolean':
          return asc ? (a[sortProperty] ? 1 : -1) : b[sortProperty] ? 1 : -1;

        default:
          return 0;
      }
    }
  });

  return data;
}

export interface IKeyValue {
  key: string;
  value: string;
}
export interface IFilterConfig {
  label: string;
  filterProperty: string;
  values: IKeyValue[];
  value: string;
}

export function filterData(data: Array<Object>, { filterProperty, value }: IFilterConfig): Array<Object> {
  if (!value) return data;
  data = data.filter((a) => {
    return a[filterProperty] === value;
  });
  return data;
}
