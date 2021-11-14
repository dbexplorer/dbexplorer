import { BaseNode } from "./basenode";
import {
  TableCellViewModel,
  TableRowViewModel,
  TableViewModel
} from "../viewmodels/table";

export class TableCellNode {
  private cellHTMLElement: HTMLTableCellElement;
  protected createElement(): HTMLTableCellElement {
    return null;
  }
  constructor(private viewModel: TableCellViewModel) {
    this.cellHTMLElement = this.createElement();
    this.cellHTMLElement.innerHTML = viewModel.getText();
  }
  element(): HTMLElement {
    return this.cellHTMLElement;
  }
}

export class TableDataCellNode extends TableCellNode {
  protected createElement() {
    return document.createElement("td");
  }
}

export class TableHeaderCellNode extends TableCellNode {
  protected createElement() {
    return document.createElement("th");
  }
}

export class TableRowNode {
  private rowHTMLElement: HTMLTableRowElement;
  private tableCellNodes: TableCellNode[] = [];

  protected createTableCellNode(cellViewModel: TableCellViewModel) {
    return new TableDataCellNode(cellViewModel) as TableCellNode;
  }
  constructor(private viewModel: TableRowViewModel) {
    this.rowHTMLElement = document.createElement("tr");
    this.viewModel.getCells().forEach((cellViewModel) => {
      const tableCellNode = this.createTableCellNode(cellViewModel);
      this.tableCellNodes.push(tableCellNode);
      this.rowHTMLElement.appendChild(tableCellNode.element());
    });
  }
  element(): HTMLElement {
    return this.rowHTMLElement;
  }
}

export class TableHeaderRowNode extends TableRowNode {
  createTableCellNode(cellViewModel: TableCellViewModel) {
    return new TableHeaderCellNode(cellViewModel);
  }
}

export class TableNode extends BaseNode {
  tableHTMLElement: HTMLTableElement;
  tableHeadElement: HTMLTableSectionElement;
  tableBodyElement: HTMLTableSectionElement;

  tableRowNodes: TableRowNode[] = [];

  constructor(private viewModel: TableViewModel) {
    super();
    this.viewModel.addRowsCallback = this.addRows;

    this.tableHTMLElement = document.createElement("table");
    this.tableHeadElement = this.tableHTMLElement.createTHead();

    const tableCaptions = new TableHeaderRowNode(
      viewModel.headerViewModel.captionsViewModel
    );

    this.tableHeadElement.appendChild(tableCaptions.element());
    this.tableBodyElement = this.tableHTMLElement.createTBody();

    this.viewModel.loadData(2, 0);
  }
  addRows = (data: []) => {
    data.forEach((rowViewModel) => {
      const node = new TableRowNode(rowViewModel);
      this.tableRowNodes.push(node);
      this.tableBodyElement.appendChild(node.element());
    });
  };

  element(): HTMLElement {
    return this.tableHTMLElement;
  }
}
