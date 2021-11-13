import { BaseNode } from "./basenode";
import { TableColumnDescription, TableViewModel } from "../viewmodels/table";
import { truncateSync } from "fs";
export class TableCellNode {
  constructor() {}
}

export class TableRowNode {
  constructor() {}
}

export class TableNode extends BaseNode {
  tableHTMLElement: HTMLTableElement;
  tableHeadElement: HTMLTableSectionElement;
  tableBodyElement: HTMLTableSectionElement;

  constructor(public viewModel: TableViewModel) {
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
  addRows(data: []) {}

  element(): HTMLElement {
    return this.tableHTMLElement;
  }
}
