import React from 'react';
import { TableRow } from "../../../src/react/table/row";

import { render, fireEvent } from '@testing-library/react'
import {
  TableRowViewModel
} from "../../../src/viewmodels/table";

jest.mock("../../../src/react/table/cell", () => ({
  TableCell: (props) => {
    return <mock-table-cell title={props.model.getText()} />;
  }
}));

test("Table row test", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"], "t1");

  const { container } = render(<TableRow model={tableRowViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("Table test - row click", () => {
  var tableRowViewModel = new TableRowViewModel(["t1", "t2"], "t1");
  var d = "";
  tableRowViewModel.exploreCallback = () => {
    d = "clicked";
  }
  const { container } = render(<TableRow model={tableRowViewModel} />);

  fireEvent.click(container.querySelector("tr"));
  expect(d).toEqual("clicked");
});