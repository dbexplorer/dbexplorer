import { IBaseViewModel } from "./base";
import { DataBaseDescription, IDataBase, IDataEntity } from "../schema";
import { TableViewModel } from "./table";

export interface IExplorerOptions {}
export class ExplorerPanelViewModel {
  constructor(private dataViewModel: IBaseViewModel) {}
}
export class ExplorerViewModel {
  private panels: ExplorerPanelViewModel[] = [];
  private description: DataBaseDescription;
  constructor(
    dataBaseDescription: IDataBase,
    private options: IExplorerOptions
  ) {
    this.description = new DataBaseDescription(dataBaseDescription);
  }
  private addTablePanel(entityId: string) {
    const columns = this.description.getTableColumns(entityId);
    const attributes = columns.map((col) => col.name);
    let tableViewModel = new TableViewModel(columns);
    tableViewModel.getDataCallback = (limit, offset, ready) => {
      this.getDataCallback(entityId, attributes, limit, offset, ready);
    };
    this.panels.push(new ExplorerPanelViewModel(tableViewModel));
  }
  private addFormPanel(entityId: string) {}
  public getDataCallback: (
    entityId: string,
    attributes: string[],
    limit: number,
    offset: number,
    ready: (data: any) => void
  ) => void;
  public start(entityId: string) {
    this.panels = [];
    this.addTablePanel(entityId);
  }
}
