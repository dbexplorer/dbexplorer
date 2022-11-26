import React from 'react';
import { Table } from "../../../src/react/table/table";
import { render, fireEvent } from '@testing-library/react'
import { TableViewModel } from "../../../src/viewmodels/table";
import { act } from 'react-test-renderer';
jest.mock("../../../src/react/table/row", () => ({
  TableRow: (props) => {
    return <tr className={"mock-table-row"} title={props.model.getKey()} />;
  }
}));

var old_observer = window.IntersectionObserver;
var observerCallback = {};
const intersectionObserverMockMore = (callback) => {
  return {
    observe: (element) => observerCallback[element.className] = callback,
    unobserve: () => null
  }
};
function callAllObservers() {
  act(() => Object.keys(observerCallback).forEach(k => observerCallback[k]([{ isIntersecting: true }])));
}
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMockMore);


test("Table test", () => {
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
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.limit === 2 && !options.back) {
      ready([
        { key: 1 + offset * 2, data: { f1: 1 + offset * 2, f2: "one", f3: "first" } },
        { key: 2 + offset * 2, data: { f1: 2 + offset * 2, f2: "two", f3: "second" } }
      ]);
    }
  };

  const { container } = render(<Table model={tableViewModel} />);
  callAllObservers();

  expect(container.querySelector("tbody").childElementCount).toEqual(3);
  expect(container.firstChild).toMatchSnapshot();
});

test("Table test with key", () => {
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
  ], 2);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.exploreRowCallback = () => { };
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.limit === 2 && !options.back) {
      ready([
        { key: 1 + offset * 2, data: { f1: 1 + offset * 2, f2: "one", f3: "first" } },
        { key: 2 + offset * 2, data: { f1: 2 + offset * 2, f2: "two", f3: "second" } }
      ]);
    }
  };

  let obj = null;
  window.HTMLElement.prototype.scrollIntoView = function () { obj = this };
  const { container } = render(<Table model={tableViewModel} />);
  callAllObservers();

  expect(container.firstChild).toMatchSnapshot();
  expect(obj.title).toEqual("2");
});

test("Table test with incorrect key", () => {
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
  ], 2222);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.exploreRowCallback = () => { };
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.limit === 2 && !options.back) {
      ready([
        { key: 1 + offset * 2, data: { f1: 1 + offset * 2, f2: "one", f3: "first" } },
        { key: 2 + offset * 2, data: { f1: 2 + offset * 2, f2: "two", f3: "second" } }
      ]);
    }
  };

  let obj = null;
  window.HTMLElement.prototype.scrollIntoView = function () { obj = this };
  const { container } = render(<Table model={tableViewModel} />);
  callAllObservers();
  expect(obj).toBeNull();
});


test("Table test - no load more", () => {
  var tableViewModel = new TableViewModel([]);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.getDataCallback = (options, ready) => {
    ready([]);
  };

  const { container } = render(<Table model={tableViewModel} />);
  callAllObservers();
  expect(container.firstChild).toMatchSnapshot();
});

test("Table test - no load more absolutely", () => {
  var tableViewModel = new TableViewModel([]);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.getDataCallback = (options, ready) => {
    ready([]);
  };
  tableViewModel.getLoadBackVisible = () => false;
  tableViewModel.getLoadMoreVisible = () => false;

  const { container } = render(<Table model={tableViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("table test - load more without click", () => {
  var tableViewModel = new TableViewModel([]);
  tableViewModel.dataPartRowCount = 2;
  tableViewModel.getDataCallback = (options, ready) => {
    let offset = options.offset;
    if (options.back) {
      ready([]);
      return;
    }
    if (options.limit === 2) {
      ready(offset < 6 ? [
        { key: 1 + offset * 2, data: {} },
        { key: 2 + offset * 2, data: {} }
      ] : []);
    }
  };

  const { container, unmount } = render(<Table model={tableViewModel} />);
  callAllObservers();
  act(() => {
    observerCallback["jsde-table-loading-bottom"]([{ isIntersecting: true }]);
  });
  expect(tableViewModel.rows.map(r => r.getKey())).toEqual([1, 2, 5, 6]);
  act(() => {
    observerCallback["jsde-table-loading-bottom"]([{ isIntersecting: true }]);
  });
  expect(tableViewModel.rows.map(r => r.getKey())).toEqual([1, 2, 5, 6, 9, 10]);
  act(() => {
    observerCallback["jsde-table-loading-bottom"]([{ isIntersecting: false }]);
  });
  expect(tableViewModel.rows.map(r => r.getKey())).toEqual([1, 2, 5, 6, 9, 10]);
  //expect(unobserved).toBeFalsy();
  //unmount();
  //expect(unobserved).toBeTruthy();
});