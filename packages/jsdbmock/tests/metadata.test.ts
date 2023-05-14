import { JSDBMockTest } from "./helper";

test("Get fields", async() => {
  const stub = new JSDBMockTest();

  const fields = await stub.getFields("table");
  expect(fields).toStrictEqual(["table_key", "f1", "f2", "f3"]);
});

test("Get entities", async() => {
  const stub = new JSDBMockTest();

  const fields = await stub.getEntities();
  expect(fields).toStrictEqual(["table", "child1", "child2", "grandchild"]);
});