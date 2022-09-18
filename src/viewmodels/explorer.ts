import { IBaseViewModel } from "./base";
import { DataBaseDescription, IDataBase, IDataEntity } from "../schema";
import { TableViewModel } from "./table";
import { FormViewModel } from "./form";
import { cssPrefix } from "../utils";
import { IGetDataFilter, IGetDataOptions } from "../data";

export interface IExplorerOptions { }
export class ExplorerPanelViewModel {
  constructor(public dataViewModel: TableViewModel, private key: string) { }
  public extraDataViewModel: IBaseViewModel;
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
  public closeLeftCallback: () => void;
  public closeRightCallback: () => void;
  public setExtraDataKeyCallback: (key: string) => void = () => { };
}
export class ExplorerViewModel {
  private sequence = 0;
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

  private createTablePanel(tableViewModel: TableViewModel, key: string) {
    const panel = new ExplorerPanelViewModel(tableViewModel, key);
    panel.closeCallback = () => { this.removePanel(panel, "this") };
    panel.closeRightCallback = () => { this.removePanel(panel, "after") };
    panel.closeLeftCallback = () => { this.removePanel(panel, "before") };
    return panel;
  }

  private addTablePanel(entityId: string, initKey: any, initFilter: IGetDataFilter, back: boolean = false) {
    const columns = this.description.getTableColumns(entityId);
    const attributes = columns.map((col) => col.name);
    let tableViewModel = new TableViewModel(columns, initKey, this.description.getTableTitle(entityId));
    tableViewModel.dataPartRowCount = 20;
    tableViewModel.getDataCallback = (options, ready) => {
      let newOptions = { ...options };
      newOptions.filter = initFilter;
      this.getDataCallback(entityId, attributes, newOptions, ready);
    };
    const panel = this.createTablePanel(tableViewModel, entityId + this.sequence++);
    if (!back) {
      this.panels.push(panel);
    }
    else {
      this.panels.unshift(panel);
    }
    this.addPanelCallback(panel);


    tableViewModel.exploreRowCallback = (row) => {
      panel.extraDataViewModel = this.createFormViewModel(entityId, row.getKey(), panel);
      panel.setExtraDataKeyCallback(row.getKey());
    }
  }

  private createFormViewModel(entityId: string, key: string | string[], sender: ExplorerPanelViewModel) {
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
            ready(result[0].data);
          }
          else {
            ready({});
          }

        });
    };

    formViewModel.exploreRelationshipCallback = (rel) => {
      this.removePanel(sender, "after");
      this.addTablePanel(rel.getEntityId(), null, { type: "EQ", field: rel.getKeyField(), value: key });
    };
    formViewModel.exploreFieldCallback = (field) => {
      const entityId = fieldRels.filter(r => r.key == field.getName())[0].entity;
      this.removePanel(sender, "before");
      this.addTablePanel(entityId, field.getText(), null, true);
    };
    return formViewModel;
  }

  private removePanel(viewModel: ExplorerPanelViewModel, option: "this" | "after" | "before") {
    const panelIndex = this.panels.indexOf(viewModel);
    switch (option) {
      case "this": this.panels.splice(panelIndex); break;
      case "after": this.panels.splice(panelIndex + 1); break;
      case "before": this.panels.splice(0, panelIndex); break;
    }

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

  public start(initKey: any = null) {
    this.panels = [];
    this.addTablePanel(this.rootEntity, initKey, null, null);
  }
}
