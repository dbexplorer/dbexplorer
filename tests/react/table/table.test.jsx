import React from 'react';
import { Table } from "../../../src/react/table/table";
import { render, fireEvent } from '@testing-library/react'
import { TableViewModel } from "../../../src/viewmodels/table";
jest.mock("../../../src/react/table/row", () => ({
  TableRow: (props) => {
    return <tr className={"mock-table-row"} title={props.model.getKey()} />;
  }
}));
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
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.limit === 2) {
      ready([
        { key: 1 + offset * 2, data: { f1: 1 + offset * 2, f2: "one", f3: "first" } },
        { key: 2 + offset * 2, data: { f1: 2 + offset * 2, f2: "two", f3: "second" } }
      ]);
    }
  };

  const { container } = render(<Table model={tableViewModel} />);
  expect(container.querySelector("tbody").childElementCount).toEqual(2);
  expect(container.firstChild).toMatchSnapshot();
});
test("table test - load more", () => {
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
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.limit === 2) {
      ready([
        { key: 1 + offset * 2, data: { f1: 1 + offset * 2, f2: "one", f3: "first" } },
        { key: 2 + offset * 2, data: { f1: 2 + offset * 2, f2: "two", f3: "second" } }
      ]);
    }
  };
  const { container } = render(<Table model={tableViewModel} />);
  var oldCallback = tableViewModel.addRowsCallback;
  var rows = [];
  tableViewModel.addRowsCallback = (data) => {
    rows = [...data];
  };
  expect(tableViewModel.rows.map(r => r.getKey())).toEqual([1, 2]);
  fireEvent.click(container.querySelector("tfoot button"));
  expect(tableViewModel.rows.map(r => r.getKey())).toEqual([1, 2, 5, 6]);
  expect(rows.map(r => r.getKey())).toEqual([1, 2, 5, 6]);
});