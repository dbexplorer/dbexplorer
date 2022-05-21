import React from 'react';
import { FormInputField } from "../../src/react/form/field";
import { FormRelationship } from "../../src/react/form/relationship";
import { Form } from "../../src/react/form/form";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import {
  FormStringFieldViewModel,
  FormRelationshipViewModel,
  FormViewModel
} from "../../src/viewmodels/form";
import { act } from 'react-dom/test-utils';
test("Form field HTML test", () => {
  var fieldViewModel = new FormStringFieldViewModel({
    name: "f1",
    title: "field_1"
  });

  const { container } = render(<FormInputField model={fieldViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
  act(() => {
    fieldViewModel.setText("t1");
  })

  expect(container.firstChild).toMatchSnapshot();
  fireEvent.change(container.querySelector("input"), { target: { value: 't2' } })
  expect(fieldViewModel.getText()).toEqual("t2");
});

test("Form rel HTML test", () => {
  var relViewModel = new FormRelationshipViewModel({
    title: "rel_1"
  });
  let d = 0;
  relViewModel.exploreCallback = () => { d++ };

  const { container } = render(<FormRelationship model={relViewModel} />);
  expect(container.firstChild).toMatchSnapshot();

  fireEvent.click(container.querySelector("label"));
  expect(d).toEqual(1);
});

test("Form HTML test", () => {
  var formViewModel = new FormViewModel([

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
  ], [{
    title: "r 1",
    childTable: "child1",
    childKey: "e_key"
  },
  {
    title: "r 2",
    childTable: "child2",
    childKey: "e_key"
  }]);

  formViewModel.getDataCallback = (ready) => {
    ready({ f1: 1, f2: "one", f3: "first" });
  };

  const { container } = render(<Form model={formViewModel} />);
  expect(container.firstChild).toMatchSnapshot();
});
