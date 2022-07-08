import React from 'react';
import { TableViewModel } from "../../../src/viewmodels/table";
import { ExplorerPanelViewModel } from "../../../src/viewmodels/explorer";
import { ExplorerPanel } from "../../../src/react/explorer/panel"
import { FormViewModel } from "../../../src/viewmodels/form";
import { render, fireEvent } from '@testing-library/react'

jest.mock("../../../src/react/table/table", () => ({
  Table: () => {
    return <mock-table />;
  }
}));
jest.mock("../../../src/react/form/form", () => ({
  Form: () => {
    return <mock-form />;
  }
}));
test("Table panel test", () => {
  var tableViewModel = new TableViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(tableViewModel);
  tableViewModel.getDataCallback = (options, ready) => {
    ready([]);
  };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("Form panel test", () => {
  var formViewModel = new FormViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(formViewModel);
  formViewModel.getDataCallback = (ready) => {
    ready([{}]);
  };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("Close panel test", () => {
  var panelViewModel = new ExplorerPanelViewModel(null);
  var d = "";
  panelViewModel.closeCallback = () => { d = "closed" };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  fireEvent.click(container.querySelector(".jsde-panel__close"));
  expect(d).toEqual("closed");
});