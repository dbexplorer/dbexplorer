import React from 'react';
import { FormRelationship } from "../../../src/react/form/relationship";
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import {
  FormRelationshipViewModel,
} from "../../../src/viewmodels/form";

test("Form rel HTML test", () => {
  var relViewModel = new FormRelationshipViewModel({
    title: "rel_1"
  });
  let d = 0;
  relViewModel.exploreCallback = () => { d++ };

  const { container } = render(<FormRelationship model={relViewModel} />);
  expect(container.firstChild).toMatchSnapshot();

  fireEvent.click(container.querySelector("button"));
  expect(d).toEqual(1);
});