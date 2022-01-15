import {
  FormStringFieldViewModel,
  FormViewModel
} from "../../src/viewmodels/form";
test("Field test", () => {
  var field = new FormStringFieldViewModel({
    name: "f1",
    title: "field 1"
  });
  var d: string = null;
  field.updateCallback = (data: string) => {
    d = data;
  };
  field.setText("test");
  expect(d).toEqual("test");
  expect(field.getText()).toEqual("test");
  expect(field.getName()).toEqual("f1");
  expect(field.getTitle()).toEqual("field 1");
});

test("Field test update", () => {
  var field = new FormStringFieldViewModel({
    name: "f1",
    title: "field 1"
  });
  var d = [];
  field.updateCallback = (data: string) => {
    d.push(data);
  };
  field.setText("test");
  expect(d).toEqual(["test"]);
  field.setText("test2");
  expect(d).toEqual(["test", "test2"]);
  field.setText("test2");
  expect(d).toEqual(["test", "test2"]);
});

test("Form test", () => {
  var form = new FormViewModel([
    {
      name: "f1",
      title: "field_1"
    },
    {
      name: "f2",
      title: "field_2"
    },
    {
      name: "f3",
      title: "field_3"
    }
  ]);
  form.getDataCallback = (ready) => {
    ready([{ f1: 1, f2: "one", f3: "first" }]);
  };
  var d: string[] = [];
  form.fields.forEach((field) => {
    field.updateCallback = (text) => {
      d.push(text);
    };
  });

  form.reloadData();
  expect(d).toEqual(["1", "one", "first"]);
});
