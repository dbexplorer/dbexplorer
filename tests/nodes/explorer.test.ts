import { ExplorerTablePanelNode } from "../../src/nodes/explorer";
import { TableViewModel } from "../../src/viewmodels/table";
import { ExplorerPanelViewModel } from "../../src/viewmodels/explorer";
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
  expect(panel.element().innerHTML).toEqual(
    "<tr><th>f1</th><th>f2</th><th>f3</th></tr>"
  );
});
