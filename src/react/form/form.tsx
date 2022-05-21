import React from 'react';
import { FormViewModel } from '../../viewmodels/form';
import { FormInputField } from './field';
import { FormRelationship } from './relationship';

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
  componentDidMount() {
    this.props.model.reloadData();
  }
  render() {
    return (
      <form className={this.css().root} action="#">
        {this.props.model.fields.map((f, index) => <FormInputField key={index} model={f} />)}
        {this.props.model.rels.map((r, index) => <FormRelationship key={index} model={r} />)}
      </form>
    );
  }
}