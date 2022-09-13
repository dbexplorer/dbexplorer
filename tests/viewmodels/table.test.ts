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

test("Table row test", () => {
  var row = new TableRowViewModel(["a", "b", "c"], "a");
  row.setCellsText(["0", "1", "2"]);
  var d = [];
  row.getCells().map((cell) => cell.updateCallback = (data) => { d.push(data) })
  row.setCellsText(["e", "f", "g"]);
  expect(row.getCells().map((cell) => cell.getText())).toEqual(["e", "f", "g"]);
  expect(d).toEqual(["e", "f", "g"]);
})

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
  table.getDataCallback = (options, ready) => {
    let offset = options.offset;
    ready([
      { key: 1, data: { f1: 1 + offset, f2: "one" + offset, f3: "first" + offset } },
      { key: 2, data: { f1: 2 + offset, f2: "two" + offset, f3: "second" + offset } }
    ]);
  };
  var d: string[][];
  table.addRowsCallback = (data: TableRowViewModel[]) => {
    d = data.map((row) => row.getCells().map((cell) => cell.getText()));
  };
  table.loadData();
  expect(d).toEqual([
    ["1", "one0", "first0"],
    ["2", "two0", "second0"]
  ]);

  d = table.rows.map((row) => row.getCells().map((cell) => cell.getText()));
  expect(d).toEqual([
    ["1", "one0", "first0"],
    ["2", "two0", "second0"]
  ]);

  table.loadData();
  d = table.rows.map((row) => row.getCells().map((cell) => cell.getText()));
  expect(d).toEqual([
    ["1", "one0", "first0"],
    ["2", "two0", "second0"],
    ["11", "one10", "first10"],
    ["12", "two10", "second10"]
  ]);
});

test("Table explore row", () => {
  var table = new TableViewModel([]);
  table.getDataCallback = (options, ready) => {
    ready([
      { key: 1, data: {} },
      { key: 2, data: {} }
    ]);
  };
  var d = "";
  table.addRowsCallback = () => { };
  table.exploreRowCallback = (row) => {
    d = row.getKey();
  }
  table.loadData();
  var row0css = "", row1css = "";
  table.rows.map(r => r.css = () => ({ root: "r", rootExplored: "re" }));

  table.rows[0].updateCssCallback = css => row0css = css;
  table.rows[1].updateCssCallback = css => row1css = css;

  table.rows[0].exploreCallback();
  expect(d).toBe(table.rows[0].getKey());

  expect(row0css).toBe("r re");
  table.rows[1].exploreCallback();
  expect(row0css).toBe("r");
  expect(row1css).toBe("r re");

});

test("Table hide loadmore", () => {
  var table = new TableViewModel([]);
  table.getDataCallback = (options, ready) => {
    let offset = options.offset;
    ready((offset < 2) ? [
      { key: 1, data: {} },
      { key: 2, data: {} }
    ] : []);
  };
  var vis: boolean = true;
  table.addRowsCallback = () => { };
  table.loadMoreVisibleCallback = visible => vis = visible;
  table.loadData();
  expect(vis).toBeTruthy();
  table.loadData();
  expect(vis).toBeFalsy();

});

test("Table load key", () => {
  var table = new TableViewModel([], 123);
  expect(table.getKey()).toBe(123);
});

test("Table css", () => {
  var cell = new TableCellViewModel();
  expect(cell.css()).toEqual({
    "root": "jsde-table-cell"
  });

  var row = new TableRowViewModel([], "");
  expect(row.css()).toEqual({
    "root": "jsde-table-row",
    "rootExplored": "jsde-table-row--explored"
  });

  var table = new TableViewModel([]);
  expect(table.css()).toEqual({
    "body": "jsde-table-body",
    "foot": "jsde-table-foot",
    "head": "jsde-table-head",
    "root": "jsde-table",
  });
});