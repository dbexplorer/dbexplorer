import React from 'react';
import { TableRowViewModel, TableViewModel } from '../../viewmodels/table';
import { TableRow } from './row';

interface IProps {
  model: TableViewModel;
}

interface IState {
  rows: TableRowViewModel[];
}
export class Table extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { rows: props.model.rows };
    this.props.model.addRowsCallback = (data: []) => {
      this.setState({ rows: data });
    };
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }
  getHeaderCells() {
    return this.props.model.headerViewModel.captionsViewModel.getCells();
  }
  getRows() {
    return this.props.model.rows;
  }
  handleLoadMoreClick() {
    this.props.model.loadData();
  }
  render() {
    return (
      <table>
        <thead><tr>{this.getHeaderCells().map((cell) => <th>{cell.getText()}</th>)}</tr></thead>
        <tbody>
          {
            this.state.rows.map((row) => <TableRow model={row} />)
          }
        </tbody>
        <tfoot><button onClick={this.handleLoadMoreClick}>Load more data...</button></tfoot>
      </table>
    );
  }
}