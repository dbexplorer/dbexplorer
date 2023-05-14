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

test("Database Schema tests  - fields with references", () => {
  const desc = new DataBaseDescription(dbDescription);
  expect(desc.getFormFields("child1")).toEqual([
    {
      name: "child_key",
      title: "child_key"
    },
    {
      name: "e_key",
      title: "e_key",
      hasReference: true
    },
    {
      name: "f1",
      title: "c1 first"
    },
    {
      name: "f2",
      title: "c1 second"
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

test("Database Schema tests  - up relationships", () => {
  const desc = new DataBaseDescription(dbDescription);
  expect(desc.getUpRelationships("table")).toEqual([]);

  expect(desc.getUpRelationships("child1")).toEqual([{
    entity: "table",
    key: "e_key"
  }]);

  expect(desc.getUpRelationships("child2")).toEqual([{
    entity: "table",
    key: "e_key"
  }]);
});