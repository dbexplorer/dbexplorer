export interface IDataAttribute {
  title?: string;
  type?: string;
  isPrimaryKey?: boolean;
  isAlternateKey?: boolean;
  hideInTable?: boolean;
  hideInForm?: boolean;
}
export interface IDataAttributes {
  [key: string]: IDataAttribute;
}
export interface IDataEntity {
  attributes: IDataAttributes;
}
export interface IDataEntities {
  [key: string]: IDataEntity;
}
export interface IDataRelationship {}

export interface IDataBase {
  entities: IDataEntities;
}

export class DataBaseDescription {
  constructor(private database: IDataBase) {}
  public getTableColumns(entityId: string) {
    let columns = [];
    const attributes = this.database.entities[entityId].attributes;
    for (let col in attributes) {
      if (!attributes[col].hideInTable) {
        columns.push({ name: col, title: attributes[col].title || col });
      }
    }
    return columns;
  }
  public getFormFields(entityId: string) {
    let fields = [];
    const attributes = this.database.entities[entityId].attributes;
    for (let col in attributes) {
      if (!attributes[col].hideInForm) {
        fields.push({ name: col, title: attributes[col].title || col });
      }
    }
    return fields;
  }
}
