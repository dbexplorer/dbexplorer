import React from 'react';
import { TableRowViewModel } from '../../viewmodels/table';
import { TableCell } from './cell';

interface IProps {
  model: TableRowViewModel;
}

interface IState {
}
export class TableRow extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  css() {
    return this.props.model.css()
  }
  getCells() {
    return this.props.model.getCells();
  }
  handleClick() {
    this.props.model.exploreCallback();
  }
  render() {
    return (
      <><tr className={this.css().root} onClick={this.handleClick}>{this.getCells().map((cell, index) => <TableCell key={index} model={cell} />)}</tr></>
    );
  }
}