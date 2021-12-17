import { dbDescription } from "../schema_helper";
import {
  ExplorerViewModel,
  IExplorerOptions
} from "../../src/viewmodels/explorer";
import { TableRowViewModel } from "../../src/viewmodels/table";

test("Explorer table test", () => {
  var explorer = new ExplorerViewModel(dbDescription, {});
  var actualEntityId, actualAttributes;
  explorer.getDataCallback = (entityId, attributes, limit, offset, ready) => {
    actualEntityId = entityId;
    actualAttributes = attributes;
    ready([
      { table_key: 1, f1: "one", f2: "first" },
      { table_key: 2, f1: "two", f2: "second" }
    ]);
  };
  var d: string[][];
  explorer.start("table");
  var table = (explorer as any).panels[0].dataViewModel;
  table.addRowsCallback = (data: TableRowViewModel[]) => {
    d = data.map((row) => row.getCells().map((cell) => cell.getText()));
  };
  table.loadData();
  expect(actualEntityId).toEqual("table");
  expect(actualAttributes).toEqual(["table_key", "f1", "f2"]);
  expect(d).toEqual([
    ["1", "one", "first"],
    ["2", "two", "second"]
  ]);
});
