import React, { useState } from 'react';
import { ExplorerPanelViewModel } from '../../viewmodels/explorer';
import { FormViewModel } from '../../viewmodels/form';
import { TableViewModel } from '../../viewmodels/table';
import { Form } from '../form/form';
import { Table } from '../table/table';

export function ExplorerPanel({ model }: { model: ExplorerPanelViewModel }) {
  const css = model.css();

  const isForm = model.dataViewModel instanceof FormViewModel;
  const formModel = model.dataViewModel as FormViewModel;
  const tableModel = model.dataViewModel as TableViewModel;

  function handleCloseClick(e: any) {
    model.closeCallback();
  }
  return (
    <div className={css.root}>
      <button className={css.close} onClick={handleCloseClick}></button>
      <div className={css.header}>{model.dataViewModel.getTitle()}</div>
      <div className={css.body}>
        {
          isForm ?
            <Form key={model.getKey()} model={formModel}></Form> :
            <Table key={model.getKey()} model={tableModel}></Table>
        }
      </div>
    </div>
  );
}