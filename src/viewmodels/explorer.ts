import { IBaseViewModel } from "./base";
import { DataBaseDescription, IDataBase, IDataEntity } from "../schema";
import { TableViewModel } from "./table";
import { FormViewModel } from "./form";

export interface IExplorerOptions { }
export class ExplorerPanelViewModel {
  constructor(public dataViewModel: IBaseViewModel) { }
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
    const panel = new ExplorerPanelViewModel(tableViewModel);
    this.panels.push(panel);
    this.addPanelCallback(panel);

    tableViewModel.exploreRowCallback = () => {
      this.addFormPanel(entityId);
    }
  }

  private addFormPanel(entityId: string) {
    const fields = this.description.getFormFields(entityId);
    const attributes = fields.map((field) => field.name);
    let formViewModel = new FormViewModel(fields, []);
    formViewModel.getDataCallback = (ready) => {
      this.getDataCallback(entityId, attributes, 1, 0, ready);
    };
    const panel = new ExplorerPanelViewModel(formViewModel);
    this.panels.push(panel);
    this.addPanelCallback(panel);
  }

  public getDataCallback: (
    entityId: string,
    attributes: string[],
    limit: number,
    offset: number,
    ready: (data: any) => void
  ) => void;

  public getPanels() {
    return this.panels;
  }
  public addPanelCallback: (viewModel: ExplorerPanelViewModel) => void;

  public start(entityId: string) {
    this.panels = [];
    this.addTablePanel(entityId);
  }
}
