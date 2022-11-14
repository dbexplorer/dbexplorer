import React, { useEffect, useRef, useState } from 'react';
import { TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

export function Table({ model }: { model: TableViewModel }) {
  const [rows, setRows] = useState(model.rows);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [loadBackVisible, setLoadBackVisible] = useState(true);
  model.addRowsCallback = setRows;
  model.loadMoreVisibleCallback = setLoadMoreVisible;
  model.loadBackVisibleCallback = setLoadBackVisible;
  const css = model.css();


  const headerCells = model.headerViewModel.captionsViewModel.getCells();
  const tableBodyRef = useRef(null);
  const footerRef = useRef(null);
  const loadBackRef = useRef(null);

  function observerCallback(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    if (entry.isIntersecting) model.loadData();
  }
  function observerBackCallback(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    if (entry.isIntersecting) model.loadData(true);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback);
    const observer2 = new IntersectionObserver(observerBackCallback);
    if (footerRef.current) observer.observe(footerRef.current);
    // TODO: check if we need unobserve
    // return () => {
    //   if (footerRef.current) observer.unobserve(footerRef.current);
    // }
    if (loadBackRef.current) observer2.observe(loadBackRef.current);
    if (model.getKey()) {
      const currentRowIndex = model.getCurrentRowIndex();
      if (currentRowIndex >= 0) tableBodyRef.current.childNodes[currentRowIndex].scrollIntoView({ block: "center" });
    }
  }, [footerRef, loadBackRef, rows]);

  return (
    <table className={css.root}>
      <thead className={css.head}><tr>{headerCells.map((cell, index) => <th key={index}>{cell.getText()}</th>)}</tr></thead>
      <tbody ref={tableBodyRef} className={css.body}>
        {loadBackVisible ? <tr ref={loadBackRef} className={css.loadingTop}><td>Loading...</td></tr> : null}
        {
          rows.map((row, index) => <TableRow key={row.getKey()} model={row} />)
        }
        {loadMoreVisible ? <tr ref={footerRef} className={css.loadingBottom}><td>Loading...</td></tr> : null}
      </tbody>
    </table>
  );
}