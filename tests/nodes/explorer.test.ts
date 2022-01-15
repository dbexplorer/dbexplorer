import { ExplorerFormPanelNode, ExplorerNode, ExplorerTablePanelNode } from "../../src/nodes/explorer";
import { TableViewModel } from "../../src/viewmodels/table";
import { ExplorerPanelViewModel, ExplorerViewModel } from "../../src/viewmodels/explorer";
import { FormViewModel } from "../../src/viewmodels/form";
import { dbDescription } from "../schema_helper";
test("table panel test", () => {
  var tableViewModel = new TableViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(tableViewModel);
  tableViewModel.getDataCallback = (limit, offset, ready) => {
    ready([]);
  };
  var panel: ExplorerTablePanelNode = new ExplorerTablePanelNode(
    panelViewModel
  );
  panel.element().querySelector("table").innerHTML = "";
  expect(panel.element()).toMatchSnapshot();
});

test("form panel test", () => {
  var formViewModel = new FormViewModel([]);
  var panelViewModel = new ExplorerPanelViewModel(formViewModel);
  formViewModel.getDataCallback = (ready) => {
    ready([{}]);
  };
  var panel: ExplorerFormPanelNode = new ExplorerFormPanelNode(
    panelViewModel
  );
  panel.element().querySelector("form").innerHTML = "";
  expect(panel.element()).toMatchSnapshot();
});

test("explorer test", () => {
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
  var explorer: ExplorerNode = new ExplorerNode(explorerViewModel);
  explorerViewModel.start("table");
  expect(explorer.element()).toMatchSnapshot();
  (<HTMLTableRowElement>explorer.element().querySelector("tbody tr")).onclick(null);
  expect(explorer.element()).toMatchSnapshot();
});