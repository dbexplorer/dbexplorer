import {
  TableCellViewModel,
  TableRowViewModel,
  TableViewModel
} from "../../src/viewmodels/table";
test("First table cell test", () => {
  var cell = new TableCellViewModel();
  var d: string = null;
  cell.updateCallback = (data: string) => {
    d = data;
  };
  cell.setText("test");
  expect(d).toEqual("test");
});

test("First table test", () => {
  var table = new TableViewModel([
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
  table.getDataCallback = (limit, offset, ready) => {
    ready([
      { f1: 1, f2: "one", f3: "first" },
      { f1: 2, f2: "two", f3: "second" }
    ]);
  };
  var d: string[][];
  table.addRowsCallback = (data: TableRowViewModel[]) => {
    d = data.map((row) => row.getCells().map((cell) => cell.getText()));
  };
  table.loadData(2, 0);
  expect(d).toEqual([
    ["1", "one", "first"],
    ["2", "two", "second"]
  ]);
});
