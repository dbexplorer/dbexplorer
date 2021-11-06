export class TableCellViewModel {
  private text: string;
  setText(text: string) {
    this.text = text;
    this.updateCallback(this.text);
  }
  constructor() {}
  updateCallback: (data: string) => any;
}
export class TableRowViewModel {
  private cells: TableCellViewModel[];
  constructor() {}
}
export class TableViewModel {
  rows: TableRowViewModel;
  constructor() {}
  addRowsCallback: (rows: TableRowViewModel) => {};
}
