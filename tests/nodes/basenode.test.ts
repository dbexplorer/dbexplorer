import { BaseNode } from "../../src/nodes/basenode";
import { TableViewModel } from "../../src/viewmodels/table";
test("base node test", () => {
  expect((new BaseNode().element())).toBeNull();
});
