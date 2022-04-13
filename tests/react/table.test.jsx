import React from 'react';
import { TableCell } from "../../src/react/table/cell";
import { TableRow } from "../../src/react/table/row";
import { Table } from "../../src/react/table/table";

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import {
  TableCellViewModel, TableRowViewModel, TableViewModel
} from "../../src/viewmodels/table";
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
test("Table row test", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"]);

  const { container } = render(<TableRow model={tableRowViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    tableRowViewModel.getCells()[0].setText("t3");
  })
  expect(container.firstChild).toMatchSnapshot();
});
test("Table test", () => {
  var tableViewModel = new TableViewModel([
    {
      name: "f1"
    },
    {
      name: "f2"
    },
    {
      name: "f3"
    }
  ]);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.getDataCallback = (limit, offset, ready) => {
    if (limit === 2) {
      ready([
        { f1: 1 + offset * 2, f2: "one", f3: "first" },
        { f1: 2 + offset * 2, f2: "two", f3: "second" }
      ]);
    }
  };

  const { container } = render(<Table model={tableViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    tableViewModel.loadData();
  })
  expect(container.firstChild).toMatchSnapshot();
});

