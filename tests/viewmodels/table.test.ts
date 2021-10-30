import { TableCellViewModel } from "../../src/viewmodels/table";
test("First table cell test", () => {
  var cell = new TableCellViewModel();
  var d: string = null;
  cell.updateCallback = (data: string) => {
    d = data;
  };
  cell.setText("test");
  expect(d).toEqual("test");
});
