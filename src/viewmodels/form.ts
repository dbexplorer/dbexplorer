import { cssPrefix } from "../utils";
import { IBaseViewModel } from "./base";
import { TableColumnDescription } from "./table";

export class FormRelationshipDescription {
  title: string;
  entity: string;
  key: string | string[];
}
export class FormStringFieldViewModel {
  getName() {
    return this.columnDescription.name;
  }

  getTitle() {
    return this.columnDescription.title;
  }
  getText() {
    return this.text;
  }
  setText(text: string) {
    if (this.text !== text) {
      this.text = text;
      this.updateCallback(this.text);
    }
  }
  constructor(
    private columnDescription: TableColumnDescription,
    private text: string = null
  ) { }
  css() {
    return {
      root: cssPrefix("field"),
      label: cssPrefix("field__label"),
      input: cssPrefix("field__input"),
    };
  }
  updateCallback: (data: string) => any;
}

export class FormRelationshipViewModel {
  getTitle() {
    return this.relDescription.title;
  }
  getEntityId() {
    return this.relDescription.entity;
  }
  getKeyField() {
    return this.relDescription.key;
  }
  constructor(
    private relDescription: FormRelationshipDescription,
  ) { }
  css() {
    return {
      root: cssPrefix("relationship"),
      label: cssPrefix("relationship__label"),
    };
  }
  updateCallback: (data: string) => any;
  exploreCallback: () => void;
}

export class FormViewModel implements IBaseViewModel {
  fields: FormStringFieldViewModel[] = [];
  rels: FormRelationshipViewModel[] = [];
  constructor(private fieldsDescription: TableColumnDescription[], relDescriptions: FormRelationshipDescription[]) {
    this.fields = fieldsDescription.map(
      (field) => new FormStringFieldViewModel(field)
    );
    if (relDescriptions) {
      this.rels = relDescriptions.map(
        (rel) => {
          const relation = new FormRelationshipViewModel(rel)
          relation.exploreCallback = () => {
            this.exploreRelationshipCallback(relation);
          }
          return relation;
        }
      );
    }
  }
  css() {
    return {
      root: cssPrefix("form"),
    };
  }
  reloadData() {
    this.getDataCallback((data: any) => {
      let dataRow = data[0];
      this.fields.forEach((field) =>
        field.setText(dataRow[field.getName()].toString())
      );
    });
  }
  getDataCallback: (ready: any) => void;
  exploreRelationshipCallback: (row: FormRelationshipViewModel) => any;
}
