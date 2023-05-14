import {classicmodels} from '../datasets/classicmodels/dataset';
export class JSDBMock {
  public static Instance: JSDBMock = new JSDBMock();
  dbDescription = require('../datasets/classicmodels/description.json');
  db: {
    [key: string]: any;
  } = {};

  getDBDescription() { return this.dbDescription };
  getDemoData() { return classicmodels };

  initDatabase() {
    Object.keys(this.getDBDescription().entities).forEach((entity) => {
      this.db[entity] = [];
      let entityData = this.getDemoData()[entity];
      if (entityData) {
        
        const fields = this.getDBDescription().entities[entity].attributes;
        let keyIndexes: number[] = fields.filter((f: any) => f.isPrimaryKey).map((f:any) => fields.indexOf(f));
        entityData.data.forEach((row: any) => {
          var obj = { key: keyIndexes.map(i => row[i]), data: {} as {[key: string]: any;} };
    
          entityData.fields.forEach(function (attr: string, idx: number) {
            obj.data[attr] = row[idx];
          })
    
          this.db[entity].push(obj);
        })
      }
    })
  }

  constructor() {
    this.initDatabase();
  }
 
  getFields(entityId: string) {
    return this.getDBDescription().entities[entityId].attributes.map((a:any) => a.name || a);
  }

  getEntities() {
    return Object.keys(this.getDBDescription().entities);
  }

  getData(entityId: string, attributes: Array<string> = null, options: any = {}): Promise<Array<any>> {
    let data: Array<any> = this.db[entityId].slice();

    if (options.back) {
      data = data.reverse();

    }

    if (options.from) {
      // data = data.sort((a, b) => {
      //   if(a[options.from.key] < b[options.from.key]) return -1;
      //   if(a[options.from.key] > b[options.from.key]) return 1;
      // })
      if (options.back) {
        data = data.filter(d => d.data[options.from.key] < options.from.value);
      }
      else {
        data = data.filter(d => d.data[options.from.key] >= options.from.value);
      }
    }
    if (options.filter) {
      if (options.filter.type == "EQ") {
        data = data.filter(d => d.data[options.filter.field] == options.filter.value);
      }
      else{
        console.error("Unsupported filter type: %s", options.filter.type);
        data = [];
      }
    }
    if (options.offset) data = data.slice(options.offset);
    if (options.limit) data = data.slice(0, options.limit);

    
    if(!attributes) attributes = this.getDemoData()[entityId].fields;
    data = data.map((d) => {
      var row = { key: d.key, data: {} as {[key: string]: any;} };
      attributes.forEach((a) => {
        row.data[a] = d.data[a];
      });
      return row;
    })
    return new Promise<Array<any>>((resolve, reject) => {
      setTimeout(()=>{
        resolve(data);
      }, 0)
    })
  };



}
