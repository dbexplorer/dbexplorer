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
  tableViewModel.getDataCallback = (limit, offset, ready) => {
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
  explorerViewModel.getDataCallback = (entityId, attributes, limit, offset, ready) => {
    if (limit > 1) {
      ready([
        { table_key: 1, f1: "one", f2: "first" },
        { table_key: 2, f1: "two", f2: "second" }
      ]);
    }
    if (limit == 1) {
      ready([
        { table_key: 1, f1: "one", f3: "third" },
      ]);
    }
  };
  const { container } = render(<Explorer model={explorerViewModel} />);
  act(() => explorerViewModel.start("table"));
  expect(container.firstChild).toMatchSnapshot();
  fireEvent.click(container.querySelector("tbody tr"));
  expect(container.firstChild).toMatchSnapshot();
});
