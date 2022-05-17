import { IDataBase } from "../src/schema";

export const dbDescription: IDataBase = {
  entities: {
    table: {
      attributes: {
        table_key: { isPrimaryKey: true },
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
    },
    child1: {
      title: "child table 1",
      attributes: {
        child_key: {},
        e_key: {},
        f1: {
          title: "c1 first"
        },
        f2: {
          title: "c1 second"
        },
      }
    },
    child2: {
      title: "child table 2",
      attributes: {
        child_key: {},
        e_key: {},
        f1: {
          title: "c2 first"
        },
        f2: {
          title: "c2 second"
        },
      }
    },
    grandchild: {
      title: "grandchild table",
      attributes: {
        g_child_key: {},
        c_key: {},
        f1: {
          title: "gc first"
        },
        f2: {
          title: "gc second"
        },
      }
    }
  },
  relationships: [{
    title: "c1 rel",
    parent: "table",
    child: "child1",
    childKey: "e_key"
  },
  {
    parent: "table",
    child: "child2",
    childKey: "e_key"
  },
  {
    parent: "child1",
    child: "grandchild",
    childKey: "c_key"
  }]
};
/*
function generateMockData() {
  let tableData = [];
  let child1Data = [];
  for (let i: number = 0; i < 23; i++) {
    tableData.push({ table_key: "table_" + i, f1: "table_f1_" + i, f2: "table_f2_" + i, f3: "table_f3_" + i })
  }
  for (let i: number = 0; i < 200; i++) {
    child1Data.push({ child_key: "child1_" + i, e_key: "table_" + (i * 17 % 13), f1: "child1_f1_" + i, f2: "child1_f2_" + i })
  }
}


export function getDataMock(entityId, attributes, limit, offset, filter, ready) {
  let d = [];
  for (let i: number = 1; i < limit; i++) {

  }
}
*/