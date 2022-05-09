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
  css() {
    return this.props.model.css();
  }
  render() {
    return (
      <form className={this.css().root} action="#">
        {this.props.model.fields.map((f, index) => <FormInputField key={index} model={f} />)}
      </form>
    );
  }
}