import React from 'react';
import { FormStringFieldViewModel } from '../../viewmodels/form';

interface IProps {
  model: FormStringFieldViewModel;
}

interface IState {
  title: string;
  text: string;
}
export class FormInputField extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    const model = props.model as FormStringFieldViewModel;
    this.state = { title: model.getTitle(), text: model.getText() };
    model.updateCallback = (data: string) => {
      this.setState({ text: data });
    };
  }
  handleChange(e: any) {
    this.props.model.setText(e.target.value);
  }
  render() {
    return (
      <div>
        <label>{this.state.title}</label>
        <input value={this.state.text} onChange={this.handleChange}></input>
      </div>
    );
  }
}