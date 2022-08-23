import React from 'react';
import { TableRow } from "../../../src/react/table/row";

import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils';
import {
  TableRowViewModel
} from "../../../src/viewmodels/table";

jest.mock("../../../src/react/table/cell", () => ({
  TableCell: (props) => {
    return <td className={"mock-table-cell"} title={props.model.getText()} />;
  }
}));

test("Table row test", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"], "t1");
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  document.body.appendChild(table)
  table.appendChild(tbody);

  const { container } = render(<TableRow model={tableRowViewModel} />, {
    container: tbody
  });
  expect(container.firstChild).toMatchSnapshot();
});

test("Table test - row click", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"], "t1");
  var d = "";
  tableRowViewModel.exploreCallback = () => {
    d = "clicked";
  }
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  document.body.appendChild(table)
  table.appendChild(tbody);
  const { container } = render(<TableRow model={tableRowViewModel} />, {
    container: tbody,
  });

  fireEvent.click(container.querySelector("tr"));
  expect(d).toEqual("clicked");
});

test("Table row test - update css", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"], "t1");
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  document.body.appendChild(table)
  table.appendChild(tbody);

  const { container } = render(<TableRow model={tableRowViewModel} />, {
    container: tbody
  });
  act(() => {
    tableRowViewModel.updateCssCallback("new-class");
  });
  expect(container.firstChild).toMatchSnapshot();
});