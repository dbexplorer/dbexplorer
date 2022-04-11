import { FormStringFieldViewModel, FormViewModel } from "../viewmodels/form";

export class FormInputFieldNode {
  private inputHTMLElement: HTMLInputElement;
  private labelHTMLElement: HTMLLabelElement;
  private fieldHTMLElement: HTMLDivElement;
  constructor(private viewModel: FormStringFieldViewModel) {
    this.labelHTMLElement = document.createElement("label");
    this.inputHTMLElement = document.createElement("input");
    this.fieldHTMLElement = document.createElement("div");
    this.fieldHTMLElement.appendChild(this.labelHTMLElement);
    this.fieldHTMLElement.appendChild(this.inputHTMLElement);

    this.labelHTMLElement.innerHTML = viewModel.getTitle();
    this.inputHTMLElement.value = viewModel.getText();
    viewModel.updateCallback = (data: string) => {
      this.inputHTMLElement.value = data;
    };
  }
  element(): HTMLElement {
    return this.fieldHTMLElement;
  }
}

export class FormNode {
  private formHTMLElement: HTMLFormElement;
  private fieldNodes: FormInputFieldNode[] = [];
  constructor(private viewModel: FormViewModel) {
    this.formHTMLElement = document.createElement("form");
    this.formHTMLElement.action = "#";
    viewModel.fields.forEach((field) => {
      let fieldNode = new FormInputFieldNode(field);
      this.fieldNodes.push();
      this.formHTMLElement.appendChild(fieldNode.element());
    });
    viewModel.reloadData();
  }
  element(): HTMLElement {
    return this.formHTMLElement;
  }
}
