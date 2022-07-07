import { dbDescription } from "../schema_helper";
import {
  ExplorerPanelViewModel,
  ExplorerViewModel,
  IExplorerOptions
} from "../../src/viewmodels/explorer";
import { TableRowViewModel, TableViewModel } from "../../src/viewmodels/table";
import { FormViewModel } from "../../src/viewmodels/form";
import { format } from "path";

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
      if (entityId == "table")
        ready([
          { key: 1, data: { table_key: 1, f1: "one", f2: "first" } },
          { key: 2, data: { table_key: 2, f1: "two", f2: "second" } }
        ]);
      if (entityId == "child1" && options.filter.value == "1" && options.filter.type == "EQ" && options.filter.field == "e_key")
        ready([
          { key: 1, data: { child_key: 1, e_key: 1, f1: "One", f2: "First" } },
          { key: 2, data: { child_key: 2, e_key: 1, f1: "Two", f2: "Second" } }
        ])
      if (entityId == "child1" && options.filter.value == "2" && options.filter.type == "EQ" && options.filter.field == "e_key")
        ready([
          { key: 1, data: { child_key: 3, e_key: 2, f1: "Three", f2: "Third" } },
          { key: 2, data: { child_key: 4, e_key: 2, f1: "Four", f2: "Fourth" } }
        ])

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
  explorer.removePanelCallback = () => { };
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

  form.exploreRelationshipCallback(form.rels[0]);
  expect(explorerPanels.length).toBe(3);
  var c_table = explorerPanels[2].dataViewModel as TableViewModel;
  var d;
  c_table.addRowsCallback = (data: TableRowViewModel[]) => {
    d = data.map((row) => row.getCells().map((cell) => cell.getText()));
  };
  c_table["dataPartRowCount"] = 2;
  c_table.loadData();
  expect(d).toEqual([["1", "1", "One", "First"], ["2", "1", "Two", "Second"]]);

  table.exploreRowCallback(table.rows[1]);
  expect(explorerPanels.length).toBe(2);
  var form2 = explorerPanels[explorerPanels.length - 1].dataViewModel as FormViewModel;

  expect(form2.fields.map(f => f.getTitle())).toEqual(["table_key", "first", "third"]);
  expect(form2.rels.map(r => r.getTitle())).toEqual(["c1 rel", "child table 2"]);

  var fieldStringsUpdated2 = [];
  form2.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated2.push(text) });
  expect(dVM).toEqual(form2);
  form2.reloadData();
  expect(fieldStringsUpdated2).toEqual(["2", "two", "second"]);

  explorerPanels[explorerPanels.length - 1].closeCallback();
  expect(explorerPanels.length).toBe(1);
  expect(explorerPanels[0].dataViewModel).toEqual(table);


  table.exploreRowCallback(table.rows[1]);
  expect(explorerPanels.length).toBe(2);
  form = explorerPanels[1].dataViewModel as FormViewModel;
  form.exploreRelationshipCallback(form.rels[0]);
  expect(explorerPanels.length).toBe(3);
  explorerPanels[explorerPanels.length - 1].closeCallback();
  expect(explorerPanels.length).toBe(2);


  table.exploreRowCallback(table.rows[1]);
  expect(explorerPanels.length).toBe(2);
  form = explorerPanels[1].dataViewModel as FormViewModel;
  form.exploreRelationshipCallback(form.rels[0]);
  expect(explorerPanels.length).toBe(3);
  expect((explorerPanels[2].dataViewModel as TableViewModel).headerViewModel.captionsViewModel.getCells().map(c => c.getText())).toEqual(["child_key", "e_key", "c1 first", "c1 second"]);
  form.exploreRelationshipCallback(form.rels[1]);
  expect(explorerPanels.length).toBe(3);
});

test("Explorer remove panel test", () => {
  var explorer = new ExplorerViewModel(dbDescription, {});
  explorer.removePanelCallback = () => { };

  var panel1 = new ExplorerPanelViewModel(new TableViewModel([]), "e1");
  var panel2 = new ExplorerPanelViewModel(new TableViewModel([]), "e2");
  var panel3 = new ExplorerPanelViewModel(new TableViewModel([]), "e3");

  explorer.getPanels().length = 0;
  explorer.getPanels().push(panel1);
  explorer.getPanels().push(panel2);
  explorer.getPanels().push(panel3);

  (explorer as any).removePanel(panel2);

  expect(explorer.getPanels().map(p => p.getKey())).toStrictEqual(["e1"]);
})

test("Explore empty row", () => {
  var explorer = new ExplorerViewModel(dbDescription, {});
  explorer.getDataCallback = (entityId, attributes, options, ready) => {
    ready([]);
  }
  explorer.addPanelCallback = () => { }
  explorer.removePanelCallback = () => { };
  explorer.start("table");
  (explorer.getPanels()[0].dataViewModel as TableViewModel).exploreRowCallback(new TableRowViewModel(["a", "b", "c"], "a"));
  var form = explorer.getPanels()[1].dataViewModel as FormViewModel;
  var fieldStringsUpdated: string[] = [];
  form.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated.push(text) });
  form.reloadData();
  expect(fieldStringsUpdated).toEqual(["", "", ""]);
})

