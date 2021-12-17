import { IDataBase } from "../src/schema";

export const dbDescription: IDataBase = {
  entities: {
    table: {
      attributes: {
        table_key: {},
        f1: {
          title: "first"
        },
        f2: {
          hideInForm: true,
          title: "second"
        },
        f3: {
          hideInTable: true,
          title: "third"
        }
      }
    }
  }
};
