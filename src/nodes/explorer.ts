import { ExplorerPanelViewModel, ExplorerViewModel } from "../viewmodels/explorer";

import { BaseNode } from "../nodes/basenode";
import { TableNode } from "../nodes/table";
import { TableViewModel } from "../viewmodels/table";
import { FormNode } from "./form";
import { FormViewModel } from "../viewmodels/form";

export class ExplorerPanelNode {
  private panelHTMLElement: HTMLDivElement;
  private closeButtonHTMLElement: HTMLDivElement;
  private containerHTMLElement: HTMLDivElement;

  protected containerNode: BaseNode;

  protected createElements() {
    this.panelHTMLElement = document.createElement("div");
    this.closeButtonHTMLElement = document.createElement("div");
    this.containerHTMLElement = document.createElement("div");
    this.panelHTMLElement.appendChild(this.closeButtonHTMLElement);
    this.panelHTMLElement.appendChild(this.containerHTMLElement);
    this.containerHTMLElement.appendChild(this.containerNode.element());
  }

  constructor() { }
  element(): HTMLElement {
    return this.panelHTMLElement;
  }
}

export class ExplorerTablePanelNode extends ExplorerPanelNode {
  private tableNode: TableNode;
  constructor(private viewModel: ExplorerPanelViewModel) {
    super();
    this.containerNode = new TableNode(
      this.viewModel.dataViewModel as TableViewModel
    );
    this.createElements();
  }
}

export class ExplorerFormPanelNode extends ExplorerPanelNode {
  private formNode: FormNode;
  constructor(private viewModel: ExplorerPanelViewModel) {
    super();
    this.containerNode = new FormNode(
      this.viewModel.dataViewModel as FormViewModel
    );
    this.createElements();
  }
}

export class ExplorerNode {
  private explorerHTMLElement: HTMLDivElement;
  private panelNodes: ExplorerPanelNode[];
  private createPanelNode(viewModel: ExplorerPanelViewModel): ExplorerPanelNode {
    if (viewModel.dataViewModel instanceof FormViewModel) {
      return new ExplorerFormPanelNode(viewModel);
    }
    return new ExplorerTablePanelNode(viewModel);
  }
  constructor(private viewModel: ExplorerViewModel) {
    this.explorerHTMLElement = document.createElement("div");
    this.panelNodes = [];
    viewModel.addPanelCallback = (panelViewModel) => {
      const panel = this.createPanelNode(panelViewModel);
      this.panelNodes.push(panel);
      this.explorerHTMLElement.appendChild(panel.element());
    }
  }
  element(): HTMLElement {
    return this.explorerHTMLElement;
  }
}