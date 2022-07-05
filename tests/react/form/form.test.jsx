import React from 'react';
import { Form } from "../../../src/react/form/form";
import { render } from '@testing-library/react'
import {
  FormViewModel
} from "../../../src/viewmodels/form";

jest.mock("../../../src/react/form/field", () => ({
  FormInputField: (props) => {
    return <mock-form-input-field title={props.model.getTitle()} />;
  }
}));
jest.mock("../../../src/react/form/relationship", () => ({
  FormRelationship: (props) => {
    return <mock-form-relationship title={props.model.getTitle()} />;
  }
}));

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

  formViewModel.getDataCallback = (ready) => { };

  const { container } = render(<Form model={formViewModel} />);
  container.querySelector("form")
  expect(container.firstChild).toMatchSnapshot();
});
