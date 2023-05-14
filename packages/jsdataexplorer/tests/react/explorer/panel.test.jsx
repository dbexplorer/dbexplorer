import React from 'react';
import { TableRowViewModel, TableViewModel } from "../../../src/viewmodels/table";
import { ExplorerPanelViewModel } from "../../../src/viewmodels/explorer";
import { ExplorerPanel } from "../../../src/react/explorer/panel"
import { FormViewModel } from "../../../src/viewmodels/form";
import { render, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils';

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

test("Table + form panel test", () => {
  var tableViewModel = new TableViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(tableViewModel);

  const { container } = render(<ExplorerPanel model={panelViewModel} />);

  act(() => {
    panelViewModel.extraDataViewModel = new FormViewModel([]);
    panelViewModel.setExtraDataKeyCallback("123");

    tableViewModel.getDataCallback = (options, ready) => {
      ready([]);
    };
  })
  expect(container.firstChild).toMatchSnapshot();
});

test("Close panel test", () => {
  var formViewModel = new FormViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(formViewModel);
  var d = "";
  panelViewModel.closeCallback = () => { d = "closed" };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  fireEvent.click(container.querySelector(".jsde-panel__close"));
  expect(d).toEqual("closed");
});

test("Table panel with title test", () => {
  var tableViewModel = new TableViewModel([], undefined, "Table title");
  var panelViewModel = new ExplorerPanelViewModel(tableViewModel);
  tableViewModel.getDataCallback = (options, ready) => {
    ready([]);
  };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("Form panel with title test", () => {
  var formViewModel = new FormViewModel([], [], null, "Form title");
  var panelViewModel = new ExplorerPanelViewModel(formViewModel);
  formViewModel.getDataCallback = (ready) => {
    ready([{}]);
  };
  const { container } = render(<ExplorerPanel model={panelViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});