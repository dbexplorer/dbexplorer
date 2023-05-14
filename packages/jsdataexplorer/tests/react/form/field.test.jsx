import React from 'react';
import { FormInputField } from "../../../src/react/form/field";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import {
  FormStringFieldViewModel,
} from "../../../src/viewmodels/form";
import { act } from 'react-dom/test-utils';
test("Form field HTML test", () => {
  var fieldViewModel = new FormStringFieldViewModel({
    name: "f1",
    title: "field_1"
  });

  const { container } = render(<FormInputField model={fieldViewModel} />);
  expect(container.firstChild).toMatchSnapshot("empty field");
  act(() => {
    fieldViewModel.setText("t1");
  })

  expect(container.firstChild).toMatchSnapshot("field with data");
  fireEvent.change(container.querySelector("input"), { target: { value: 't2' } })
  expect(fieldViewModel.getText()).toEqual("t2");
});

test("Form field with reference", () => {
  var fieldViewModel = new FormStringFieldViewModel({
    name: "f1",
    title: "field_1",
    hasReference: true
  });
  let fieldExplored = false;
  fieldViewModel.exploreCallback = () => { fieldExplored = true };
  const { container } = render(<FormInputField model={fieldViewModel} />);
  expect(container.firstChild).toMatchSnapshot("field with ref");
  fireEvent.click(container.querySelector("label"));
  expect(fieldExplored).toBeTruthy();
});