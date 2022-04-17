import React from 'react';
import { FormStringFieldViewModel } from '../../viewmodels/form';

interface IProps {
  model: FormStringFieldViewModel;
}

interface IState {
  text: string;
}
export class FormInputField extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.state = { text: props.model.getText() };
    props.model.updateCallback = (data: string) => {
      this.setState({ text: data });
    };
  }
  handleChange(e: any) {
    this.props.model.setText(e.target.value);
  }
  render() {
    return (
      <div>
        <label>{this.props.model.getTitle()}</label>
        <input value={this.state.text || ""} onChange={this.handleChange}></input>
      </div>
    );
  }
}