import React from 'react';
import { TableCell } from "../../../src/react/table/cell";


import { render, } from '@testing-library/react'
import {
  TableCellViewModel
} from "../../../src/viewmodels/table";
import { act } from 'react-dom/test-utils';

test("Table cell test", () => {
  var tableCellViewModel = new TableCellViewModel("t1");

  const { container } = render(<TableCell model={tableCellViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    tableCellViewModel.setText("t2");
  })

  expect(container.firstChild).toMatchSnapshot();
});