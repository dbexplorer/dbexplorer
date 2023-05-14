import React, { useEffect } from 'react';
import { FormViewModel } from '../../viewmodels/form';
import { FormInputField } from './field';
import { FormRelationship } from './relationship';

export function Form({ model }: { model: FormViewModel }) {
  const css = model.css();
  useEffect(() => {
    model.reloadData();
  }, [])
  return (
    <form className={css.root} action="#">
      {model.fields.map((f, index) => <FormInputField key={index} model={f} />)}
      {model.rels.map((r, index) => <FormRelationship key={index} model={r} />)}
    </form>
  );
}