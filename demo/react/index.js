// ========================================
const dbDescription = {
  entities: {
    table: {
      attributes: {
        table_key: {
          isPrimaryKey: true
        },
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

var explorerViewModel = new JSDataExplorer.ExplorerViewModel(dbDescription, {});
explorerViewModel.getDataCallback = function (entityId, attributes, options, ready) {
  console.log(entityId, attributes, options);
  if (options.limit > 1) {
    if (entityId == "table")
      ready([
        { key: 1, data: { table_key: 1, f1: "one", f2: "first" } },
        { key: 2, data: { table_key: 2, f1: "two", f2: "second" } }
      ]);
    if (entityId == "child1" && options.filter.value == "1" && options.filter.type == "EQ" && options.filter.field == "e_key")
      ready([
        { key: 1, data: { child_key: 1, e_key: 1, f1: "One", f2: "First" } },
        { key: 2, data: { child_key: 2, e_key: 1, f1: "Two", f2: "Second" } }
      ])
    if (entityId == "child1" && options.filter.value == "2" && options.filter.type == "EQ" && options.filter.field == "e_key")
      ready([
        { key: 1, data: { child_key: 3, e_key: 1, f1: "Three", f2: "Third" } },
        { key: 2, data: { child_key: 4, e_key: 1, f1: "Four", f2: "Fourth" } }
      ])

  }
  if (options.limit == 1) {
    if (options.filter.value == "1" && options.filter.type == "EQ" && options.filter.field == "table_key")
      ready(
        [{ key: 1, data: { table_key: 1, f1: "one", f3: "third" } }]
      );
    if (options.filter.value == "2" && options.filter.type == "EQ" && options.filter.field == "table_key")
      ready(
        [{ key: 2, data: { table_key: 2, f1: "two", f3: "second" } }]
      );
  }
};


let element = document.createElement("div");
element.id = "explorerElement";
document.body.appendChild(element);
ReactDOM.render(<JSDataExplorer.Explorer model={explorerViewModel} />, element);
explorerViewModel.start("table");
