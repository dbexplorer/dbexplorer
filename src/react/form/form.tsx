import React from 'react';
import { FormViewModel } from '../../viewmodels/form';
import { FormInputField } from './field';

interface IProps {
  model: FormViewModel;
}

export class Form extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <form action="#">
        {this.props.model.fields.map((f) => <FormInputField model={f} />)}
      </form>
    );
  }
}