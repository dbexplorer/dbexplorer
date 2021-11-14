import { TableNode } from "../../src/nodes/table";
import { TableViewModel } from "../../src/viewmodels/table";
test("document test", () => {
  var tableViewModel = new TableViewModel([
    {
      name: "f1"
    },
    {
      name: "f2"
    },
    {
      name: "f3"
    }
  ]);
  tableViewModel.getDataCallback = (limit, offset, ready) => {
    ready([
      { f1: 1, f2: "one", f3: "first" },
      { f1: 2, f2: "two", f3: "second" }
    ]);
  };
  var table: TableNode = new TableNode(tableViewModel);
  expect(table.element().outerHTML).toEqual("");
});
