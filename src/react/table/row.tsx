import React from 'react';
import { TableRowViewModel } from '../../viewmodels/table';
import { TableCell } from './cell';

export function TableRow({ model }: { model: TableRowViewModel }) {
  function handleClick() {
    return model.exploreCallback();
  }
  return (
    <><tr className={model.css().root} onClick={handleClick}>{model.getCells().map((cell, index) => <TableCell key={index} model={cell} />)}</tr></>
  );
}