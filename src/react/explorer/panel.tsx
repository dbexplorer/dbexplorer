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
  render() {
    return (
      <div className={this.css().root}>
        <div className={this.css().close}>Close</div>
        <div className={this.css().body}>
          {
            this.isForm() ?
              <Form model={this.props.model.dataViewModel as FormViewModel}></Form> :
              <Table model={this.props.model.dataViewModel as TableViewModel}></Table>
          }
        </div>
      </div>
    );
  }
}