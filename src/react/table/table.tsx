import React, { useEffect, useState } from 'react';
import { TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

export function Table({ model }: { model: TableViewModel }) {
  const [rows, setRows] = useState(model.rows);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  model.addRowsCallback = setRows;
  model.loadMoreVisibleCallback = setLoadMoreVisible;
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
      {loadMoreVisible ? <tfoot className={css.foot}><tr><td><button onClick={handleLoadMoreClick}>Load more data...</button></td></tr></tfoot> : null}
    </table>
  );
}