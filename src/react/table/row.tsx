import React, { useState } from 'react';
import { TableRowViewModel } from '../../viewmodels/table';
import { TableCell } from './cell';

export function TableRow({ model }: { model: TableRowViewModel }) {
  const [rootCss, setRootCss] = useState(model.css().root);

  model.updateCssCallback = setRootCss;
  function handleClick() {
    return model.exploreCallback();
  }
  return (
    <tr className={rootCss} onClick={handleClick}>{model.getCells().map((cell, index) => <TableCell key={index} model={cell} />)}</tr>
  );
}