import { cssPrefix } from "../utils";
import { IBaseViewModel } from "./base";
import { TableColumnDescription } from "./table";

export class FormRelationshipDescription {
  title: string;
  entity: string;
  key: string | string[];

}

export class FormFieldDescription {
  name: string;
  title?: string;
  hasReference?: boolean;
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
  hasReference() {
    return !!this.columnDescription.hasReference;
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
  updateCallback: (data: string) => any = () => { };
  exploreCallback: () => void;
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
  exploreCallback: () => void;
}

export class FormViewModel implements IBaseViewModel {
  fields: FormStringFieldViewModel[] = [];
  rels: FormRelationshipViewModel[] = [];
  constructor(private fieldsDescription: TableColumnDescription[], private relDescriptions: FormRelationshipDescription[], private key: any) {
    this.fields = fieldsDescription.map(
      (fld) => {
        const field = new FormStringFieldViewModel(fld);
        if (fld.hasReference) {
          field.exploreCallback = () => {
            this.exploreFieldCallback(field);
          }
        }
        return field;
      }
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
  getKey() {
    return this.key;
  }
  reloadData() {
    this.getDataCallback((data: any) => {
      let dataRow = data;
      this.fields.forEach((field) =>
        field.setText((dataRow[field.getName()] || "").toString())
      );
    });
  }
  getDataCallback: (ready: any) => void;
  exploreRelationshipCallback: (row: FormRelationshipViewModel) => any;
  exploreFieldCallback: (row: FormStringFieldViewModel) => any;
}
