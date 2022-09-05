import { dbDescription } from "../schema_helper";
import {
  ExplorerPanelViewModel,
  ExplorerViewModel,
  IExplorerOptions
} from "../../src/viewmodels/explorer";
import { TableRowViewModel, TableViewModel } from "../../src/viewmodels/table";
import { FormStringFieldViewModel, FormViewModel } from "../../src/viewmodels/form";
import { format } from "path";

test("Explorer table test", () => {
  var explorer = new ExplorerViewModel(dbDescription, "table", {});

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

  explorer.start();
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


test("Explorer remove panel test", () => {
  var explorer = new ExplorerViewModel(dbDescription, "table", {});
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
  var explorer = new ExplorerViewModel(dbDescription, "table", {});
  explorer.getDataCallback = (entityId, attributes, options, ready) => {
    ready([]);
  }
  explorer.addPanelCallback = () => { }
  explorer.removePanelCallback = () => { };
  explorer.start();
  (explorer.getPanels()[0].dataViewModel as TableViewModel).exploreRowCallback(new TableRowViewModel(["a", "b", "c"], "a"));
  var form = explorer.getPanels()[0].extraDataViewModel as FormViewModel;
  var fieldStringsUpdated: string[] = [];
  form.fields.map(f => f.updateCallback = (text) => { fieldStringsUpdated.push(text) });
  form.reloadData();
  expect(fieldStringsUpdated).toEqual(["", "", ""]);
})

test("Explore reference field row", () => {
  var explorer = new ExplorerViewModel(dbDescription, "child1", {});
  explorer.getDataCallback = (entityId, attributes, options, ready) => {
    ready([{ key: 1, data: { child_key: 1, e_key: 1, f1: "One", f2: "First" } }]);
  }
  explorer.addPanelCallback = () => { };
  explorer.removePanelCallback = () => { };
  explorer.start();

  (explorer.getPanels()[0].dataViewModel as TableViewModel).exploreRowCallback(new TableRowViewModel(["a", "b", "c"], "a"));
  var form = explorer.getPanels()[0].extraDataViewModel as FormViewModel;
  form.reloadData();

  const field = new FormStringFieldViewModel({ name: "e_key" });
  field.setText("1");
  (explorer.getPanels()[0].extraDataViewModel as FormViewModel).exploreFieldCallback(field);
  expect(explorer.getPanels().length).toBe(2);
})

test("Explorer add form panel test", () => {
  var explorer = new ExplorerViewModel(dbDescription, "child1", {});
  explorer.addPanelCallback = () => { };
  explorer.start();
  (explorer.getPanels()[0].dataViewModel as TableViewModel).exploreRowCallback(new TableRowViewModel(["a", "b", "c"], "a"));
  expect(explorer.getPanels()[0].getHeader()).toBe("child table 1");
})