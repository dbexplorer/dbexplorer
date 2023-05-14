import React from 'react';
import { FormRelationshipViewModel } from '../../viewmodels/form';

export function FormRelationship({ model }: { model: FormRelationshipViewModel }) {
  const css = model.css();

  function handleClick() {
    model.exploreCallback();
  }
  return (
    <div className={css.root}>
      <button className={css.label} onClick={handleClick}>{model.getTitle()}</button>
    </div>
  );
}