import React from 'react';
import { ExplorerPanelViewModel } from '../../viewmodels/explorer';
import { FormViewModel } from '../../viewmodels/form';
import { TableViewModel } from '../../viewmodels/table';
import { Form } from '../form/form';
import { Table } from '../table/table';

interface IProps {
  model: ExplorerPanelViewModel;
}

export class ExplorerPanel extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }
  css() {
    return this.props.model.css()
  }
  isForm() {
    return this.props.model.dataViewModel instanceof FormViewModel;
  }
  formModel() {
    return this.props.model.dataViewModel as FormViewModel;
  }
  tableModel() {
    return this.props.model.dataViewModel as TableViewModel;
  }
  render() {
    return (
      <div className={this.css().root}>
        <button className={this.css().close}></button>
        <div className={this.css().body}>
          {
            this.isForm() ?
              <Form key={this.props.model.getKey()} model={this.formModel()}></Form> :
              <Table key={this.props.model.getKey()} model={this.tableModel()}></Table>
          }
        </div>
      </div>
    );
  }
}