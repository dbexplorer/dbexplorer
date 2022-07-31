import React, { useState, useEffect } from 'react';
import { TableCellViewModel } from '../../viewmodels/table';

export function TableCell({ model }: { model: TableCellViewModel }) {
  const [text, setText] = useState(model.getText());

  model.updateCallback = setText;

  return <td className={model.css().root}>{text}</td>;
}