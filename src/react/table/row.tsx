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
  }
  getCells() {
    return this.props.model.getCells();
  }
  render() {
    return (
      <tr>{this.getCells().map((cell) => <TableCell model={cell} />)}</tr>
    );
  }
}