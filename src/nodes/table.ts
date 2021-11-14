import { BaseNode } from "./basenode";
import {
  TableCellViewModel,
  TableColumnDescription,
  TableRowViewModel,
  TableViewModel
} from "../viewmodels/table";
export class TableCellNode {
  private cellHTMLElement: HTMLTableCellElement;
  constructor(private viewModel: TableCellViewModel) {
    this.cellHTMLElement = document.createElement("td");
    this.cellHTMLElement.innerHTML = viewModel.getText();
  }
  element(): HTMLElement {
    return this.cellHTMLElement;
  }
}

export class TableRowNode {
  private rowHTMLElement: HTMLTableRowElement;
  private tableCellNodes: TableCellNode[] = [];
  constructor(private viewModel: TableRowViewModel) {
    this.rowHTMLElement = document.createElement("tr");
    this.viewModel.getCells().forEach((cellViewModel) => {
      const tableCellNode = new TableCellNode(cellViewModel);
      this.tableCellNodes.push(tableCellNode);
      this.rowHTMLElement.appendChild(tableCellNode.element());
    });
  }
  element(): HTMLElement {
    return this.rowHTMLElement;
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
    const tr = document.createElement("tr");
    this.viewModel.getColumns().forEach((col) => {
      const th = document.createElement("th");
      th.innerHTML = col.name;
      tr.appendChild(th);
    });
    this.tableHeadElement.appendChild(tr);
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
