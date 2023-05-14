import { JSDBMock } from "../src/index";
export class JSDBMockTest extends JSDBMock {
   getDBDescription = () => {
    return {
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
   }
  };
  getDemoData = () => { 
    return { 
      table:{
        fields: ["table_key", "f1", "f2", "f3"],
        data:
        [
          [1, "a1", "b1", "c1"],
          [2, "a2", "b2", "c2"],
          [3, "a3", "b3", "c1"]
        ]
      }
    }};
    constructor(){
      super();
      this.initDatabase();
    }
};