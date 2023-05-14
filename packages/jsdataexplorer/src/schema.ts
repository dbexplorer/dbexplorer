export interface IDataAttribute {
  name: string;
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
  attributes: (string | IDataAttribute)[];
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
  constructor(private database: IDataBase) {
    this.entityAttributes = {};
    for (let entity in database.entities) {
      this.entityAttributes[entity] = this.getEntityAttributes(entity);
    }
  }
  private entityAttributes: {
    [key: string]: IDataAttribute[];
  };
  private getEntityAttributes(entity: string) {
    const attrMap: IDataAttributes = {};
    return this.database.entities[entity].attributes.map(a => {
      if (typeof (a) === "string") {
        return { name: a };
      } else {
        return a;
      }
    })
  }
  public getPrimaryKey(entityId: string): string | string[] {
    const attributes = this.entityAttributes[entityId];
    const columns = attributes.filter(a => a.isPrimaryKey).map(a => a.name);
    return columns.length == 1 ? columns[0] : columns;
  }
  public getTableTitle(entityId: string) {
    return this.database.entities[entityId].title || entityId;
  }
  public getTableColumns(entityId: string) {
    const attributes = this.entityAttributes[entityId];
    return attributes.filter(a => !a.hideInTable).map(a => ({ name: a.name, title: a.title || a.name }))
  }
  public getFormFields(entityId: string) {
    let fields = [];
    const attributes = this.entityAttributes[entityId];
    return attributes.filter(a => !a.hideInForm).map(a => {
      const res: { name: string, title: string, hasReference?: boolean } = {
        name: a.name,
        title: a.title || a.name
      }
      if (this.database.relationships.filter(rel => rel.child == entityId && rel.childKey == a.name).length > 0) {
        res.hasReference = true;
      }
      return res;
    })
  }
  public getDownRelationships(entityId: string) {
    return this.database.relationships
      .filter(rel => rel.parent == entityId)
      .map(rel => <any>{ entity: rel.child, key: rel.childKey, title: rel.title || this.getTableTitle(rel.child) });
  }
  public getUpRelationships(entityId: string) {
    return this.database.relationships
      .filter(rel => rel.child == entityId)
      .map(rel => <any>{ entity: rel.parent, key: rel.childKey });
  }
}
