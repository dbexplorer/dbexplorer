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
  public exploredRelationshipEntityId: string;
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
  static readonly maxPanelsCount = 2;
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
      newOptions.from = (<any>options).key && { key: this.description.getPrimaryKey(entityId), value: (<any>options).key };
      this.getDataCallback(entityId, attributes, newOptions, ready);
    };
    const panel = this.createTablePanel(tableViewModel, entityId + this.sequence++);
    if (!back) {
      if (this.panels.length == ExplorerViewModel.maxPanelsCount) this.panels.splice(0, 1);
      this.panels.push(panel);
    }
    else {
      if (this.panels.length == ExplorerViewModel.maxPanelsCount) this.panels.splice(this.panels.length - 1, 1);
      this.panels.unshift(panel);
    }
    this.addPanelCallback(panel);


    tableViewModel.exploreRowCallback = (row) => {
      if (row) {
        panel.extraDataViewModel = this.createFormViewModel(entityId, row.getKey(), panel);
        panel.setExtraDataKeyCallback(row.getKey());
        const exploredRelationship = (panel.extraDataViewModel as FormViewModel).rels.find(r => r.getEntityId() == panel.exploredRelationshipEntityId);
        if (exploredRelationship) {
          this.removePanel(panel, "after");
          this.addTablePanel(exploredRelationship.getEntityId(), null, { type: "EQ", field: exploredRelationship.getKeyField(), value: row.getKey() })
        }
      }
      else {
        panel.extraDataViewModel = null;
        panel.setExtraDataKeyCallback(null);
        this.removePanel(panel, "after");
      }
    }
    return panel;
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
      sender.exploredRelationshipEntityId = rel.getEntityId();
    };
    formViewModel.exploreFieldCallback = (field) => {
      const parentEntityId = fieldRels.find(r => r.key == field.getName()).entity;
      this.removePanel(sender, "before");
      const newPanel = this.addTablePanel(parentEntityId, field.getText(), null, true);
      newPanel.exploredRelationshipEntityId = entityId;
    };
    return formViewModel;
  }

  private removePanel(viewModel: ExplorerPanelViewModel, option: "this" | "after" | "before") {
    const panelIndex = this.panels.indexOf(viewModel);
    switch (option) {
      case "this": this.panels.splice(panelIndex, 1); break;
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
