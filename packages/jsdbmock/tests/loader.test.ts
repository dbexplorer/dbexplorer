import { classicmodels } from "../datasets/classicmodels/dataset";

test("Full entity load", async() => {
  expect(classicmodels["offices"].fields).toStrictEqual(["officeCode","city","phone","addressLine1","addressLine2","state","country","postalCode","territory"]);
  expect(classicmodels["offices"].data.length).toBe(7);
});