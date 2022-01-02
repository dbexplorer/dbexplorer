import { ExplorerFormPanelNode, ExplorerTablePanelNode } from "../../src/nodes/explorer";
import { TableViewModel } from "../../src/viewmodels/table";
import { ExplorerPanelViewModel } from "../../src/viewmodels/explorer";
import { FormViewModel } from "../../src/viewmodels/form";
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
    ready({});
  };
  var panel: ExplorerFormPanelNode = new ExplorerFormPanelNode(
    panelViewModel
  );
  panel.element().querySelector("form").innerHTML = "";
  expect(panel.element()).toMatchSnapshot();
});