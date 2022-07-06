import React from 'react';
import { FormRelationshipViewModel } from '../../viewmodels/form';

interface IProps {
  model: FormRelationshipViewModel;
}

interface IState {
  text: string;
}
export class FormRelationship extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
    this.state = { text: props.model.getTitle() };
  }
  css() {
    return this.props.model.css()
  }
  handleClick() {
    this.props.model.exploreCallback();
  }
  render() {
    return (
      <div className={this.css().root}>
        <button className={this.css().label} onClick={this.handleClick}>{this.props.model.getTitle()}</button>
      </div>
    );
  }
}