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
  isForm() {
    return this.props.model.dataViewModel instanceof FormViewModel;
  }
  render() {
    return (
      <div>
        <div>Close</div>
        <div>
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