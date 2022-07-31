import React, { useEffect, useState } from 'react';
import { TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

export function Table({ model }: { model: TableViewModel }) {
  const [rows, setRows] = useState(model.rows);
  model.addRowsCallback = setRows;
  const css = model.css();

  const headerCells = model.headerViewModel.captionsViewModel.getCells();

  function handleLoadMoreClick() {
    model.loadData();
  }
  useEffect(() => {
    model.loadData();
  }, [])

  return (
    <table className={css.root}>
      <thead className={css.head}><tr>{headerCells.map((cell, index) => <th key={index}>{cell.getText()}</th>)}</tr></thead>
      <tbody className={css.body}>
        {
          rows.map((row, index) => <TableRow key={index} model={row} />)
        }
      </tbody>
      <tfoot className={css.foot}><tr><td><button onClick={handleLoadMoreClick}>Load more data...</button></td></tr></tfoot>
    </table>
  );
}