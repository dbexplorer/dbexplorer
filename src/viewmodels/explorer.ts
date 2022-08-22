import { IBaseViewModel } from "./base";
import { DataBaseDescription, IDataBase, IDataEntity } from "../schema";
import { TableViewModel } from "./table";
import { FormViewModel } from "./form";
import { cssPrefix } from "../utils";
import { IGetDataFilter, IGetDataOptions } from "../data";

export interface IExplorerOptions { }
export class ExplorerPanelViewModel {
  constructor(public dataViewModel: IBaseViewModel, private key: string) { }
  public getKey() {
    return this.key;
  }
  public getHeader() {
    return this.dataViewModel.getTitle();
  }
  css() {
    return {
      root: cssPrefix("panel"),
      close: cssPrefix("panel__close"),
      body: cssPrefix("panel-body"),
      header: cssPrefix("panel__header")
    };
  }
  public closeCallback: () => void;
}
export class ExplorerViewModel {
  private panels: ExplorerPanelViewModel[] = [];
  private description: DataBaseDescription;
  constructor(
    dataBaseDescription: IDataBase,
    private rootEntity: string,
    private options: IExplorerOptions
  ) {
    this.description = new DataBaseDescription(dataBaseDescription);
  }
  css() {
    return {
      root: cssPrefix("explorer"),
    };
  }
  private addTablePanel(entityId: string, initFilter: IGetDataFilter, senderIndex: number) {
    const columns = this.description.getTableColumns(entityId);
    const attributes = columns.map((col) => col.name);
    let tableViewModel = new TableViewModel(columns, this.description.getTableTitle(entityId));
    tableViewModel.dataPartRowCount = 20;
    tableViewModel.getDataCallback = (options, ready) => {
      let newOptions = { ...options };
      newOptions.filter = initFilter;
      this.getDataCallback(entityId, attributes, newOptions, ready);
    };
    const panel = new ExplorerPanelViewModel(tableViewModel, entityId);
    if (senderIndex < this.panels.length - 1) this.panels.splice(senderIndex + 1, this.panels.length);
    let panelIndex = this.panels.length;
    this.panels.push(panel);
    this.addPanelCallback(panel);
    panel.closeCallback = () => { this.removePanel(panel) };

    tableViewModel.exploreRowCallback = (row) => {
      this.addFormPanel(entityId, row.getKey(), panelIndex);
    }
  }

  private addFormPanel(entityId: string, key: string | string[], senderIndex: number) {
    const fields = this.description.getFormFields(entityId);
    const rels = this.description.getDownRelationships(entityId);
    const fieldRels = this.description.getUpRelationships(entityId);
    const attributes = fields.map((field) => field.name);
    const formkey = this.description.getPrimaryKey(entityId);
    let formViewModel = new FormViewModel(fields, rels, key, this.description.getTableTitle(entityId));
    formViewModel.getDataCallback = (ready) => {
      this.getDataCallback(
        entityId,
        attributes,
        { limit: 1, offset: 0, filter: { type: "EQ", field: formkey, value: key } },
        (result) => {
          if (result.length == 1) {
            ready(result[0].data)
          }
          else {
            ready({})
          }

        });
    };
    const panel = new ExplorerPanelViewModel(formViewModel, key.toString());
    if (senderIndex < this.panels.length - 1) this.panels.splice(senderIndex + 1, this.panels.length - 1 - senderIndex);
    let panelIndex = this.panels.length;
    this.panels.push(panel);
    this.addPanelCallback(panel);
    panel.closeCallback = () => { this.removePanel(panel) };

    formViewModel.exploreRelationshipCallback = (rel) => {
      this.addTablePanel(rel.getEntityId(), { type: "EQ", field: rel.getKeyField(), value: key }, panelIndex);
    }
    formViewModel.exploreFieldCallback = (field) => {
      let entityId = fieldRels.filter(r => r.key == field.getName())[0].entity;
      this.addFormPanel(entityId, field.getText(), panelIndex);
    }
  }
  private removePanel(viewModel: ExplorerPanelViewModel) {
    const panelIndex = this.panels.indexOf(viewModel);
    this.panels.splice(panelIndex);
    this.removePanelCallback();
  }

  public getDataCallback: (
    entityId: string,
    attributes: string[],
    options: IGetDataOptions,
    ready: (data: any) => void
  ) => void;

  public getPanels() {
    return this.panels;
  }
  public addPanelCallback: (viewModel: ExplorerPanelViewModel) => void;
  public removePanelCallback: () => void;

  public start() {
    this.panels = [];
    this.addTablePanel(this.rootEntity, null, -1);
  }
}
