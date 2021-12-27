import { ExplorerPanelViewModel } from "../viewmodels/explorer";

import { BaseNode } from "../nodes/basenode";
import { TableNode } from "../nodes/table";
import { TableViewModel } from "../viewmodels/table";

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

  constructor() {}
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
