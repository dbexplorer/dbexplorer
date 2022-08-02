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
        child_key: {
          isPrimaryKey: true
        },
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
        child_key: {
          isPrimaryKey: true
        },
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
        g_child_key: {
          isPrimaryKey: true
        },
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

var db = {};
db["table"] = [];
db["child1"] = [];
db["child2"] = [];
db["grandchild"] = [];

for (let i = 0; i < 23; i++) {
  db["table"].push({ key: "table_" + i, data: { table_key: "table_" + i, f1: "table_f1_" + i, f2: "table_f2_" + i, f3: "table_f3_" + i } })
}
for (let i = 0; i < 200; i++) {
  db["child1"].push({ key: "child1_" + i, data: { child_key: "child1_" + i, e_key: "table_" + (i * 17 % 23), f1: "child1_f1_" + i, f2: "child1_f2_" + i } })
}
for (let i = 0; i < 100; i++) {
  db["child2"].push({ key: "child2_" + i, data: { child_key: "child2_" + i, e_key: "table_" + (i * 19 % 23), f1: "child1_f1_" + i, f2: "child1_f2_" + i } })
}
for (let i = 0; i < 3000; i++) {
  db["grandchild"].push({ key: "grandchild_" + i, data: { g_child_key: "grandchild_" + i, c_key: "child1_" + (i * 1371 % 200), f1: "grandchild_f1_" + i, f2: "grandchild_f2_" + i } })
}
console.log(db);

function getData(entityId, attributes, options, ready) {
  console.log(entityId, attributes, options);

  let data = db[entityId];
  if (options.filter) {
    if (options.filter.type == "EQ") {
      data = data.filter(d => d.data[options.filter.field] == options.filter.value);
    }
  }
  if (options.offset) data = data.slice(options.offset);
  if (options.limit) data = data.slice(0, options.limit);

  data = data.map((d) => {
    var row = { key: d.key, data: {} };
    attributes.forEach((a) => {
      row.data[a] = d.data[a];
    });
    return row;
  })
  ready(data);
};
// ========================================
var explorerViewModel = new JSDataExplorer.ExplorerViewModel(dbDescription, "table", {});
explorerViewModel.getDataCallback = getData;

let element = document.createElement("div");
element.id = "explorerElement";
document.body.appendChild(element);
const root = ReactDOM.createRoot(element);
root.render(<JSDataExplorer.Explorer model={explorerViewModel} />);
