import React from 'react';
import { TableViewModel } from "../../../src/viewmodels/table";
import { ExplorerPanelViewModel, ExplorerViewModel } from "../../../src/viewmodels/explorer";
import { ExplorerPanel } from "../../../src/react/explorer/panel"
import { Explorer } from "../../../src/react/explorer/explorer"
import { FormViewModel } from "../../../src/viewmodels/form";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { dbDescription } from "../../schema_helper";
import { act } from 'react-dom/test-utils';
jest.mock("../../../src/react/explorer/panel", () => ({
  ExplorerPanel: (props) => {
    return <mock-explorer-panel title={props.model.getKey()} />;
  }
}));
test("Explorer test", () => {
  var explorerViewModel = new ExplorerViewModel(dbDescription, {});
  explorerViewModel.getDataCallback = (entityId, attributes, options, ready) => {
    ready([]);
  };
  const { container } = render(<Explorer model={explorerViewModel} />);
  act(() => explorerViewModel.start("table"));
  expect(container.firstChild).toMatchSnapshot("one panel");

  const panel = new ExplorerPanelViewModel(null, "123");
  explorerViewModel.panels.push(panel);
  act(() => {
    explorerViewModel.addPanelCallback(panel);
  })
  expect(container.firstChild).toMatchSnapshot("two panels");
  explorerViewModel.panels.splice(1, 1);
  act(() => {
    explorerViewModel.removePanelCallback(panel);
  })
  expect(container.firstChild).toMatchSnapshot("one panel again");
});
