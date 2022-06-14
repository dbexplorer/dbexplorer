import React from 'react';
import { TableViewModel } from "../../src/viewmodels/table";
import { ExplorerPanelViewModel, ExplorerViewModel } from "../../src/viewmodels/explorer";
import { ExplorerPanel } from "../../src/react/explorer/panel"
import { Explorer } from "../../src/react/explorer/explorer"
import { FormViewModel } from "../../src/viewmodels/form";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { dbDescription } from "../schema_helper";
import { act } from 'react-dom/test-utils';
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

test("Explorer test", () => {
  var explorerViewModel = new ExplorerViewModel(dbDescription, {});
  explorerViewModel.getDataCallback = (entityId, attributes, options, ready) => {
    if (options.limit > 1) {
      ready([
        { key: 1, data: { table_key: 1, f1: "one", f2: "first" } },
        { key: 2, data: { table_key: 2, f1: "two", f2: "second" } }
      ]);
    }
    if (options.limit == 1) {
      if (options.filter.value == 1)
        ready([{ key: 1, data: { table_key: 1, f1: "one", f3: "third" } }]);
      if (options.filter.value == 2)
        ready([{ key: 2, data: { table_key: 2, f1: "two", f3: "second" } }]);
    }
  };
  const { container } = render(<Explorer model={explorerViewModel} />);
  act(() => explorerViewModel.start("table"));
  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(container.querySelectorAll("tbody tr")[0]);
  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(container.querySelectorAll("tbody tr")[1]);
  expect(container.firstChild).toMatchSnapshot();

  fireEvent.click(container.querySelectorAll(".jsde-panel__close")[1]);
  expect(container.firstChild).toMatchSnapshot();
});
