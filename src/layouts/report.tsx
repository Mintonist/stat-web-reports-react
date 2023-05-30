import React, { useState } from 'react';
import { Grid, Input, Select } from 'react-spreadsheet-grid';
import ExcelBar from '../components/ui/excelBar';

const rows = [
  { id: 'user1', name: 'Иван', prof: 'шахматист' },
  { id: 'user2', name: 'Марья', prof: 'доярка' },
  { id: 'user3', name: '', prof: '' },
  { id: 'user4', name: '', prof: '' },
  { id: 'user5', name: '', prof: '' },
  { id: 'user6', name: '', prof: '' },
];

const Report = () => {
  return (
    <>
      <ExcelBar />
      <Grid
        columns={[
          {
            title: () => 'A',
            value: (row, { focus }) => {
              return <Input value={row.name} focus={focus} />;
            },
          },
          {
            title: () => 'B',
            value: (row, { focus }) => {
              return <Input value={row.prof} focus={focus} />;
            },
          },
          {
            title: () => 'C',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'D',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'E',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'F',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'G',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'H',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'I',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
          {
            title: () => 'J',
            value: (row, { focus }) => {
              return <Input value="" focus={focus} />;
            },
          },
        ]}
        rows={rows}
        getRowKey={(row) => row.id}
      />
    </>
  );
};

export default Report;
