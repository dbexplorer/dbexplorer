import React, { useState } from 'react';
import { IBaseViewModel } from '../../viewmodels/base';
import { ExplorerPanelViewModel } from '../../viewmodels/explorer';
import { FormViewModel } from '../../viewmodels/form';
import { TableViewModel } from '../../viewmodels/table';
import { Form } from '../form/form';
import { Table } from '../table/table';

export function ExplorerPanel({ model }: { model: ExplorerPanelViewModel }) {
  const [extraDataKey, setExtra] = useState("");

  model.setExtraDataKeyCallback = setExtra;
  const css = model.css();


  function handleCloseClick(e: any) {
    model.closeCallback();
  }

  return (
    <div className={css.root}>
      <button className={css.close} onClick={handleCloseClick}></button>
      <div className={css.header}>{model.dataViewModel.getTitle()}</div>
      <div className={css.body}>
        {<Table key={model.getKey()} model={model.dataViewModel as TableViewModel}></Table>}
        {extraDataKey ? <Form key={extraDataKey} model={model.extraDataViewModel as FormViewModel}></Form> : null}
      </div>
    </div>
  );
}