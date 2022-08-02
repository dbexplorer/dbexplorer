import React, { useState } from 'react';
import { FormStringFieldViewModel } from '../../viewmodels/form';

export function FormInputField({ model }: { model: FormStringFieldViewModel }) {
  const [text, setText] = useState(model.getText());
  model.updateCallback = setText;

  const css = model.css();

  function handleChange(e: any) {
    model.setText(e.target.value);
  }
  return (
    <div className={css.root}>
      <label className={css.label}>{model.getTitle()}</label>
      <input className={css.input} value={text || ""} onChange={handleChange}></input>
    </div>
  );
}