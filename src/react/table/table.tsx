import React, { useEffect, useRef, useState } from 'react';
import { TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

export function Table({ model }: { model: TableViewModel }) {
  const [rows, setRows] = useState(model.rows);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  model.addRowsCallback = setRows;
  model.loadMoreVisibleCallback = setLoadMoreVisible;
  const css = model.css();

  const headerCells = model.headerViewModel.captionsViewModel.getCells();
  const footerRef = useRef(null);

  function handleLoadMoreClick(): void {
    model.loadData();
  }
  function observerCallback(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    if (entry.isIntersecting) model.loadData();
  }
  useEffect(() => {
    model.loadData();
    const observer = new IntersectionObserver(observerCallback);
    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    }
  }, [footerRef]);

  return (
    <table className={css.root}>
      <thead className={css.head}><tr>{headerCells.map((cell, index) => <th key={index}>{cell.getText()}</th>)}</tr></thead>
      <tbody className={css.body}>
        {
          rows.map((row, index) => <TableRow key={index} model={row} />)
        }
      </tbody>
      {loadMoreVisible ? <tfoot ref={footerRef} className={css.foot}><tr><td><button onClick={handleLoadMoreClick}>Load more data...</button></td></tr></tfoot> : null}
    </table>
  );
}