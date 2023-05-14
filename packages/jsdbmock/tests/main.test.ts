import { JSDBMockTest } from "./helper";

test("Full entity load", async() => {
  const stub = new JSDBMockTest();

  const data = await stub.getData("table");
  expect(data.length).toBe(3);
  expect(data).toStrictEqual([
    {key: 1, data: {table_key: 1, f1: "a1", f2: "b1", f3: "c1"}},
    {key: 2, data: {table_key: 2, f1: "a2", f2: "b2", f3: "c2"}},
    {key: 3, data: {table_key: 3, f1: "a3", f2: "b3", f3: "c1"}}
  ])
});
test("Entity load with selected attributes", async() => {
  const stub = new JSDBMockTest();

  const data = await stub.getData("table",["f1", "f3"]);
  expect(data.length).toBe(3);
  expect(data).toStrictEqual([
    {key: 1, data: {f1: "a1", f3: "c1"}},
    {key: 2, data: {f1: "a2", f3: "c2"}},
    {key: 3, data: {f1: "a3", f3: "c1"}}
  ])
});
test("Entity load filtered", async() => {
  const stub = new JSDBMockTest();

  let data = await stub.getData("table",["f1", "f3"], {filter: {type: "EQ", field: "table_key", value: "2"}});
  expect(data.length).toBe(1);
  expect(data).toStrictEqual([
    {key: 2, data: {f1: "a2", f3: "c2"}}
  ])

  data = await stub.getData("table",["f1", "f3"], {filter: {type: "EQ", field: "f3", value: "c1"}});
  expect(data.length).toBe(2);
  expect(data).toStrictEqual([
    {key: 1, data: {f1: "a1", f3: "c1"}},
    {key: 3, data: {f1: "a3", f3: "c1"}}
  ])

  data = await stub.getData("table",["f1", "f3"], {filter: {type: "QQ"}});
  expect(data.length).toBe(0);
  expect(data).toStrictEqual([])
});
test("Entity load limit", async() => {
  const stub = new JSDBMockTest();

  const data = await stub.getData("table", undefined, {limit: 2});
  expect(data.length).toBe(2);
  expect(data).toStrictEqual([
    {key: 1, data: {table_key: 1, f1: "a1", f2: "b1", f3: "c1"}},
    {key: 2, data: {table_key: 2, f1: "a2", f2: "b2", f3: "c2"}}
  ])
});
test("Entity load limit/offset", async() => {
  const stub = new JSDBMockTest();

  const data = await stub.getData("table", undefined, {limit: 2, offset: 1});
  expect(data.length).toBe(2);
  expect(data).toStrictEqual([
    {key: 2, data: {table_key: 2, f1: "a2", f2: "b2", f3: "c2"}},
    {key: 3, data: {table_key: 3, f1: "a3", f2: "b3", f3: "c1"}}
  ])
});
test("Entity load from", async() => {
  const stub = new JSDBMockTest();

  let data = await stub.getData("table", undefined, {from: {key: "f2", value: "b2"}});
  expect(data.length).toBe(2);
  expect(data).toStrictEqual([
    {key: 2, data: {table_key: 2, f1: "a2", f2: "b2", f3: "c2"}},
    {key: 3, data: {table_key: 3, f1: "a3", f2: "b3", f3: "c1"}}
  ])

  data = await stub.getData("table", undefined, {back: true, from: {key: "f2", value: "b2"}});
  expect(data.length).toBe(1);
  expect(data).toStrictEqual([
    {key: 1, data: {table_key: 1, f1: "a1", f2: "b1", f3: "c1"}},
  ])
});