import { BaseNode } from "../../src/vanilla/basenode";
import { TableViewModel } from "../../src/viewmodels/table";
test("base node test", () => {
  expect((new BaseNode().element())).toBeNull();
});
