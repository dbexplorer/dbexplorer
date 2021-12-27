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
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.getDataCallback = (limit, offset, ready) => {
    if (limit === 2) {
      ready([
        { f1: 1 + offset * 2, f2: "one", f3: "first" },
        { f1: 2 + offset * 2, f2: "two", f3: "second" }
      ]);
    }
  };
  var table: TableNode = new TableNode(tableViewModel);
  tableViewModel.loadData();
  tableViewModel.loadData();
  expect(table.element().querySelector("thead")).toMatchSnapshot();
  expect(table.element().querySelector("tbody")).toMatchSnapshot();
});
