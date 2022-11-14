import { IGetDataOptions } from "../data";
import { cssPrefix } from "../utils";

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
  css() {
    return { root: cssPrefix("table-cell") };
  }
  updateCallback: (data: string) => any = () => { };
}
export class TableRowViewModel {
  private cells: TableCellViewModel[];
  getKey() {
    return this.key as string;
  }
  getCells() {
    return this.cells;
  }
  setCellsText(data: string[]) {
    if (!this.cells) {
      this.cells = data.map((s) => new TableCellViewModel(s));
    }
    else {
      data.map((s, idx) => this.cells[idx].setText(s));
    }
  }
  setExplored(explored: boolean) {
    this.updateCssCallback(explored ? this.css().root + " " + this.css().rootExplored : this.css().root);
  }
  css() {
    return { root: cssPrefix("table-row"), rootExplored: cssPrefix("table-row--explored") };
  }
  constructor(data: string[], private key: string | string[]) {
    this.setCellsText(data);
  }
  updateDataCallback: (data: TableCellViewModel[]) => any;
  updateCssCallback: (css: string) => any;
  exploreCallback: () => void;
}

export class TableHeaderViewModel {
  public captionsViewModel: TableRowViewModel;
  constructor(captions: string[]) {
    this.captionsViewModel = new TableRowViewModel(captions, null);
  }
}

export class TableColumnDescription {
  name: string;
  title?: string;
  hasReference?: boolean;
  isMain?: boolean;
}

export class TableViewModel {
  private columns: TableColumnDescription[];
  private dataOffset: number = 0;
  private dataBackOffset: number = 0;
  private exploredRow: TableRowViewModel = null;
  private loadBackVisible = true;
  dataPartRowCount: number = 10;
  headerViewModel: TableHeaderViewModel;
  private setLoadBackVisible(value: boolean) {
    this.loadBackVisible = value;
    this.loadBackVisibleCallback(false);
  }
  loadData(back = false) {
    const options = { limit: this.dataPartRowCount, offset: back ? this.dataBackOffset : this.dataOffset, key: this.key, back: back };
    this.getDataCallback(
      options,
      (data: any) => {
        if (back) {
          this.dataBackOffset += this.dataPartRowCount;
        }
        else {
          this.dataOffset += this.dataPartRowCount;
        }
        if (data.length > 0) {
          const rows = data.map(
            (rowData: any) => {
              const row = new TableRowViewModel(
                this.columns.map((col) => rowData.data[col.name].toString()),
                rowData.key
              )
              if (rowData.key == this.key) {
                this.exploredRow = row;
                this.exploreRowCallback(row);
              }
              row.exploreCallback = () => {
                this.exploredRow?.setExplored(false);
                this.exploredRow = row;
                this.exploredRow.setExplored(true);
                this.exploreRowCallback(row);
              }
              return row;
            }
          )
          if (back) {
            this.rows = rows.reverse().concat(this.rows);
          }
          else {
            this.rows = this.rows.concat(rows);
          }
          this.addRowsCallback(this.rows);
        }
        else {
          if (back) this.setLoadBackVisible(false); else this.loadMoreVisibleCallback(false);
        }
        if (!this.key) this.loadBackVisibleCallback(false);
      }
    );
  }
  rows: TableRowViewModel[];
  css() {
    return {
      root: cssPrefix("table"),
      head: cssPrefix("table-head"),
      body: cssPrefix("table-body"),
      foot: cssPrefix("table-foot"),
      loadingTop: cssPrefix("table-loading-top"),
      loadingBottom: cssPrefix("table-loading-bottom"),
    };
  }
  getDataCallback: (options: IGetDataOptions, ready: any) => void;
  constructor(columns: TableColumnDescription[], private key: any = undefined, private title = "Table") {
    this.columns = columns;
    this.headerViewModel = new TableHeaderViewModel(
      columns.map((col) => col.title || col.name)
    );
    this.rows = [];
  }
  getKey() {
    return this.key;
  }
  getTitle() {
    return this.title;
  }
  getCurrentRowIndex() {
    let index = this.rows.indexOf(this.rows.filter(r => r.getKey() == this.key)[0]);
    if (index >= 0 && this.loadBackVisible) index++;
    return index;
  }
  addRowsCallback: (rows: TableRowViewModel[]) => any;
  loadMoreVisibleCallback: (visible: boolean) => any;
  loadBackVisibleCallback: (visible: boolean) => any = () => { };
  exploreRowCallback: (row: TableRowViewModel) => any;
}
