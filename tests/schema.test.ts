import { DataBaseDescription } from "../src/schema";
import { dbDescription } from "./schema_helper";

test("Database Schema tests - columns", () => {
  const desc = new DataBaseDescription(dbDescription);
  expect(desc.getTableColumns("table")).toEqual([
    {
      name: "table_key",
      title: "table_key"
    },
    {
      name: "f1",
      title: "first"
    },
    {
      name: "f2",
      title: "second"
    }
  ]);
});

test("Database Schema tests  - fields", () => {
  const desc = new DataBaseDescription(dbDescription);
  expect(desc.getFormFields("table")).toEqual([
    {
      name: "table_key",
      title: "table_key"
    },
    {
      name: "f1",
      title: "first"
    },
    {
      name: "f3",
      title: "third"
    }
  ]);
});

test("Database Schema tests  - relationships", () => {
  const desc = new DataBaseDescription(dbDescription);
  expect(desc.getDownRelationships("table")).toEqual([{
    title: "c1 rel",
    entity: "child1",
    key: "e_key"
  },
  {
    title: "child table 2",
    entity: "child2",
    key: "e_key"
  }]);

  expect(desc.getDownRelationships("child1")).toEqual([{
    title: "grandchild table",
    entity: "grandchild",
    key: "c_key"
  }]);

  expect(desc.getDownRelationships("child2")).toEqual([]);

  expect(desc.getDownRelationships("grandchild")).toEqual([]);
});