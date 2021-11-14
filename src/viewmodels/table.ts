export class TableCellViewModel {
  private text: string;
  getText() {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
    this.updateCallback(this.text);
  }
  constructor(text: string = null) {
    this.text = text;
  }
  updateCallback: (data: string) => any;
}
export class TableRowViewModel {
  private cells: TableCellViewModel[];
  getCells() {
    return this.cells;
  }
  setCellsText(data: string[]) {
    if (!this.cells) {
      this.cells = data.map((s) => new TableCellViewModel(s));
    }
  }
  constructor(data: string[]) {
    this.setCellsText(data);
  }
  updateCallback: (data: TableCellViewModel[]) => any;
}

export class TableHeaderViewModel {
  public captionsViewModel: TableRowViewModel;
  constructor(captions: string[]) {
    this.captionsViewModel = new TableRowViewModel(captions);
  }
}

export class TableColumnDescription {
  name: string;
  title?: string;
}

export class TableViewModel {
  private columns: TableColumnDescription[];
  private dataOffset: number = 0;
  dataPartRowCount: number = 10;
  headerViewModel: TableHeaderViewModel;
  loadData() {
    this.getDataCallback(
      this.dataPartRowCount,
      this.dataOffset,
      (data: any) => {
        this.dataOffset += this.dataPartRowCount;
        this.addRowsCallback(
          data.map(
            (rowData: any) =>
              new TableRowViewModel(
                this.columns.map((col) => rowData[col.name].toString())
              )
          )
        );
      }
    );
  }
  rows: TableRowViewModel[];
  getDataCallback: (limit: number, offset: number, ready: any) => void;
  constructor(columns: TableColumnDescription[]) {
    this.columns = columns;
    this.headerViewModel = new TableHeaderViewModel(
      columns.map((col) => col.title || col.name)
    );
  }
  getColumns() {
    return this.columns;
  }
  addRowsCallback: (rows: TableRowViewModel[]) => any;
}
