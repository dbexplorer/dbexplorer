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
  explorer.getDataCallback = (entityId, attributes, options, ready) => {
    actualEntityId = entityId;
    actualAttributes = attributes;
    ready([
      { key: 1, data: { table_key: 1, f1: "one", f2: "first" } },
      { key: 2, data: { table_key: 2, f1: "two", f2: "second" } }
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
  explorer.getDataCallback = (entityId, attributes, options, ready) => {
    actualEntityId = entityId;
    actualAttributes = attributes;
    if (options.limit == 2) {
      ready([
        { key: 1, data: { table_key: 1, f1: "one", f2: "first" } },
        { key: 2, data: { table_key: 2, f1: "two", f2: "second" } }
      ]);
    }
    if (options.limit == 1) {
      if (options.filter.value == "1" && options.filter.type == "EQ" && options.filter.field == "table_key")
        ready(
          [{ key: 1, data: { table_key: 1, f1: "one", f3: "third" } }],
        );
      if (options.filter.value == "2" && options.filter.type == "EQ" && options.filter.field == "table_key")
        ready(
          [{ key: 2, data: { table_key: 2, f1: "two", f3: "second" } }],
        );
    }
  };
  var dVM: any;
  explorer.addPanelCallback = (viewModel) => {
    dVM = viewModel.dataViewModel;
  }
  explorer.start("table");
  let explorerPanels = (explorer as any).panels;
  expect(explorerPanels.length).toBe(1);
  var table = explorerPanels[0].dataViewModel as TableViewModel;
  expect(dVM).toEqual(table);
  table.addRowsCallback = (data: TableRowViewModel[]) => { };
  table["dataPartRowCount"] = 2;
  table.loadData();

  table.exploreRowCallback(table.rows[0]);
  expect(explorerPanels.length).toBe(2);
  var form = explorerPanels[1].dataViewModel as FormViewModel;

  expect(form.fields.map(f => f.getTitle())).toEqual(["table_key", "first", "third"]);
  expect(form.rels.map(r => r.getTitle())).toEqual(["c1 rel", "child table 2"]);

  var fieldStringsUpdated = [];
  form.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated.push(text) });
  expect(dVM).toEqual(form);
  form.reloadData();
  expect(fieldStringsUpdated).toEqual(["1", "one", "third"]);

  table.exploreRowCallback(table.rows[1]);
  //expect(explorerPanels.length).toBe(2);
  var form2 = explorerPanels[explorerPanels.length - 1].dataViewModel as FormViewModel;

  expect(form2.fields.map(f => f.getTitle())).toEqual(["table_key", "first", "third"]);
  expect(form2.rels.map(r => r.getTitle())).toEqual(["c1 rel", "child table 2"]);

  var fieldStringsUpdated2 = [];
  form2.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated2.push(text) });
  expect(dVM).toEqual(form2);
  form2.reloadData();
  expect(fieldStringsUpdated2).toEqual(["2", "two", "second"]);

});