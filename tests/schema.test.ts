import { DataBaseDescription } from "../src/schema";
import { dbDescription } from "./schema_helper";

test("Database Schema tests", () => {
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
