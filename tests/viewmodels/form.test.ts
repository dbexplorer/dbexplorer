import {
  FormRelationshipViewModel,
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

test("Field has reference test", () => {
  var field0 = new FormStringFieldViewModel({
    name: "f0",
    title: "field 0"
  });

  var field = new FormStringFieldViewModel({
    name: "f1",
    title: "field 1",
    hasReference: true
  });
  expect(field0.hasReference()).toBeFalsy();
  expect(field.hasReference()).toBeTruthy();

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
  ], [], 1);

  expect(form.getTitle()).toEqual("Form");

  form.getDataCallback = (ready) => {
    ready({ f1: 1, f2: "one", f3: "first" });
  };
  var d: string[] = [];
  form.fields.forEach((field) => {
    field.updateCallback = (text) => {
      d.push(text);
    };
  });

  form.reloadData();
  expect(d).toEqual(["1", "one", "first"]);
  expect(form.getKey()).toBe(1);
});

test("Form test references", () => {
  var form = new FormViewModel([
    {
      name: "f1",
      title: "field_1"
    },
    {
      name: "f2",
      title: "field_2",
      hasReference: true
    }
  ], [], 1);
  form.getDataCallback = (ready) => {
    ready({ f1: 1, f2: "one" });
  };
  var d: string[] = [];
  form.fields.forEach((field) => field.updateCallback = (text) => { });

  form.reloadData();
  var explored = false;
  form.exploreFieldCallback = () => { explored = true };
  form.fields[1].exploreCallback();
  expect(explored).toBeTruthy;
});


test("Form relationships test", () => {
  var form = new FormViewModel([
    {
      name: "f1",
      title: "field_1"
    }
  ], [{
    title: "r 1",
    entity: "child1",
    key: "e_key"
  },
  {
    title: "r 2",
    entity: "child2",
    key: "e_key"
  }], 1);

  form.fields.forEach((field) => {
    field.updateCallback = (text) => { };
  });

  var r: any;
  form.exploreRelationshipCallback = (rel) => r = rel;
  form.getDataCallback = (ready) => {
    ready({ f1: 1 });
  };
  form.reloadData();
  expect(form.rels.map(r => r.getTitle() + "|" + r.getEntityId() + "|" + r.getKeyField()))
    .toEqual(["r 1|child1|e_key", "r 2|child2|e_key"]);
  form.rels[1].exploreCallback();
  expect(r.getTitle()).toEqual("r 2");
});

test("Form css", () => {
  var field = new FormStringFieldViewModel({ name: "field_name" });
  expect(field.css()).toEqual({
    "input": "jsde-field__input",
    "label": "jsde-field__label",
    "ref": "jsde-field__ref",
    "root": "jsde-field",
  });

  var rel = new FormRelationshipViewModel({ title: "rel_title", entity: "entyty_name", key: "key_value" });
  expect(rel.css()).toEqual({
    "label": "jsde-relationship__label",
    "root": "jsde-relationship",
  });

  var table = new FormViewModel([], [], "key_value");
  expect(table.css()).toEqual({
    "root": "jsde-form",
  });
});