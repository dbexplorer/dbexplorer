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
  title?: string;
  attributes: IDataAttributes;
}
export interface IDataEntities {
  [key: string]: IDataEntity;
}
export interface IDataRelationship {
  title?: string;
  parent: string;
  child: string;
  childKey: string | string[];
}

export interface IDataBase {
  entities: IDataEntities;
  relationships: IDataRelationship[];
}

export class DataBaseDescription {
  constructor(private database: IDataBase) { }
  public getPrimaryKey(entityId: string): string | string[] {
    let columns = [];
    const attributes = this.database.entities[entityId].attributes;
    for (let col in attributes) {
      if (attributes[col].isPrimaryKey) {
        columns.push(col);
      }
    }
    return columns.length == 1 ? columns[0] : columns;
  }
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
  public getDownRelationships(entityId: string) {
    return this.database.relationships
      .filter(rel => rel.parent == entityId)
      .map(rel => <any>{ entity: rel.child, key: rel.childKey, title: rel.title || this.database.entities[rel.child].title });
  }
  /*
  public getUpRelationships(entityId: string) {
    return this.database.relationships
      .filter(rel => rel.child == entityId)
      .map(rel => <any> { entity: rel.parent, key: rel.childKey, title: rel.title || this.database.entities[rel.child].title });
  }
  */
}
