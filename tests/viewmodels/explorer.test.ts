import { dbDescription } from "../schema_helper";
import {
  ExplorerViewModel,
  IExplorerOptions
} from "../../src/viewmodels/explorer";
import { TableRowViewModel, TableViewModel } from "../../src/viewmodels/table";
import { FormViewModel } from "../../src/viewmodels/form";

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
  var dVM: any;
  explorer.addPanelCallback = (viewModel) => {
    dVM = viewModel.dataViewModel;
  }
  explorer.start("table");
  var table = (explorer as any).panels[0].dataViewModel;
  expect(dVM).toEqual(table);
  var d;
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


test("Explorer add form panel test", () => {
  var explorer = new ExplorerViewModel(dbDescription, {});
  var actualEntityId, actualAttributes;
  explorer.getDataCallback = (entityId, attributes, limit, offset, ready) => {
    actualEntityId = entityId;
    actualAttributes = attributes;
    if (limit == 2) {
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
  var dVM: any;
  explorer.addPanelCallback = (viewModel) => {
    dVM = viewModel.dataViewModel;
  }
  explorer.start("table");
  var table = (explorer as any).panels[0].dataViewModel as TableViewModel;
  expect(dVM).toEqual(table);

  table.exploreRowCallback(table.rows[0]);
  var form = (explorer as any).panels[1].dataViewModel as FormViewModel;
  var fieldStringsUpdated = [];
  form.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated.push(text) });
  expect(dVM).toEqual(form);
  form.reloadData();
  var fieldStrings = form.fields.map(f => f.getText());
  expect(fieldStrings).toEqual(["1", "one", "third"]);
  expect(fieldStringsUpdated).toEqual(["1", "one", "third"]);
});
