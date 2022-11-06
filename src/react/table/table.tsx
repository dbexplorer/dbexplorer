import React, { useEffect, useRef, useState } from 'react';
import { TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

export function Table({ model }: { model: TableViewModel }) {
  const [rows, setRows] = useState(model.rows);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [loadBackVisible, setLoadBackVisible] = useState(false);
  model.addRowsCallback = setRows;
  model.loadMoreVisibleCallback = setLoadMoreVisible;
  model.loadBackVisibleCallback = setLoadBackVisible;
  const css = model.css();


  const headerCells = model.headerViewModel.captionsViewModel.getCells();
  const footerRef = useRef(null);
  const loadBackRef = useRef(null);

  function handleLoadMoreClick(): void {
    model.loadData();
  }
  function handleLoadBackClick(): void {
    model.loadData(true);
  }
  function observerCallback(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    if (entry.isIntersecting) model.loadData();
  }
  function observerBackCallback(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    if (entry.isIntersecting) model.loadData(true);
  }
  useEffect(() => {
    model.loadData();
    const observer = new IntersectionObserver(observerCallback);
    /*if (footerRef.current) */observer.observe(footerRef.current);
    // TODO: check if we need unobserve
    // return () => {
    //   if (footerRef.current) observer.unobserve(footerRef.current);
    // }
  }, [footerRef]);

  useEffect(() => {
    if (loadBackVisible) {
      const observer = new IntersectionObserver(observerBackCallback);
      observer.observe(loadBackRef.current);
    }
  }, [loadBackRef]);

  return (
    <table className={css.root}>
      <thead className={css.head}><tr>{headerCells.map((cell, index) => <th key={index}>{cell.getText()}</th>)}</tr></thead>
      <tbody className={css.body}>
        {loadBackVisible ? <tr ref={loadBackRef} ><td><button onClick={handleLoadBackClick}>Load more data...</button></td></tr> : null}
        {
          rows.map((row, index) => <TableRow key={row.getKey()} model={row} />)
        }
      </tbody>
      {loadMoreVisible ? <tfoot ref={footerRef} className={css.foot}><tr><td><button onClick={handleLoadMoreClick}>Load more data...</button></td></tr></tfoot> : null}
    </table>
  );
}