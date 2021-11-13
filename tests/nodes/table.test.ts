import { getHeapCodeStatistics } from "v8";
import { TableNode } from "../../src/nodes/table";
test("document test", () => {
  var table: TableNode = new TableNode(null, {
    columns: [
      {
        name: "f1"
      },
      {
        name: "f2"
      },
      {
        name: "f3"
      }
    ],
    getData: (limit, offset, callback) => {
      callback([
        { f1: 1, f2: "one", f3: "first" },
        { f1: 2, f2: "two", f3: "second" }
      ]);
    }
  });
  expect(table.element().outerHTML).toEqual("");
});
