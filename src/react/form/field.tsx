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
  css() {
    return this.props.model.css()
  }
  handleChange(e: any) {
    this.props.model.setText(e.target.value);
  }
  render() {
    return (
      <div className={this.css().root}>
        <label className={this.css().label}>{this.props.model.getTitle()}</label>
        <input className={this.css().input} value={this.state.text || ""} onChange={this.handleChange}></input>
      </div>
    );
  }
}