import React, { useState, useEffect } from 'react';
import { ExplorerViewModel } from '../../viewmodels/explorer';
import { ExplorerPanel } from '../explorer/panel';

export function Explorer({ model }: { model: ExplorerViewModel }) {
  const [panels, setPanels] = useState(model.getPanels());
  useEffect(() => {
    model.start();
  }, [])

  model.addPanelCallback = () => {
    setPanels([...model.getPanels()]);
  };
  model.removePanelCallback = () => {
    setPanels([...model.getPanels()]);
  };
  const css = model.css();
  return (
    <div className={css.root}>
      {panels.map((panel, index) => <ExplorerPanel key={panel.getKey()} model={panel} />)}
    </div>
  );
}