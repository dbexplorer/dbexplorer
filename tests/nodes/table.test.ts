import { TableNode } from "../../src/nodes/table";
import { TableViewModel } from "../../src/viewmodels/table";
test("table test", () => {
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

test("table test - load more", () => {
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

  table["loadMoreButtonElement"].onclick(null);
});
test("table test - row click", () => {
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
  var d = {};
  tableViewModel.exploreRowCallback = (data) => {
    d = data.getCells();
  }

  (<HTMLTableRowElement>table.element().querySelector("tbody tr")).onclick(null);
  expect(d).toEqual([{"text": "1"}, {"text": "one"}, {"text": "first"}]);
});
