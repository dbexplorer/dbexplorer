const dbDescription = {
  entities: {
    project: {
      attributes: {
        project_key: {
          isPrimaryKey: true
        },
        name: {
          title: "Name"
        },
        cost: {
          title: "Cost, $"
        },
        deadline: {
          title: "Deadline"
        },
        info: {
          hideInTable: true,
          title: "Brief information"
        }
      }
    },
    task: {
      title: "Task",
      attributes: {
        task_key: {
          isPrimaryKey: true
        },
        project_key: {},
        title: {
          title: "Title"
        },
        due_time: {
          title: "Due time"
        },
        progress: {
          title: "Progress"
        },
        description: {
          title: "Description"
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
    title: "Tasks",
    parent: "project",
    child: "task",
    childKey: "project_key"
  },
  {
    parent: "project",
    child: "child2",
    childKey: "e_key"
  },
  {
    parent: "child1",
    child: "grandchild",
    childKey: "c_key"
  }]
};

const stringComponents = {
  project: {
    name: [["Tannotis", "Edogawa", "Yicilles", "Onkeon", "Thater", "Chaunus", "Zeitera", "Suumia", "Thoth SSUL"],
    ["Library", "Software", "Framework", "Components", "Builder", "Backend"],
    ["1.0", "2.0", "3.0", "4.0", "Alpha", "Beta", "Release"]]
  },
  task: {
    title: [["Implement", "Write", "Create"], ["code", "tests", "prototype", "debug data"]]
  }
}

function getRandomDate(init, days) {
  var someDate = new Date(init);
  someDate.setDate(someDate.getDate() + days);
  return someDate.toISOString().substring(0, 10);
}

function getRandomText(hash) {
  let characters = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  return characters.substring(0, 200 + (hash * 196129387) % 220);
}

function getStringFromComponents(components, hash) {
  return components.map((comp, i) => comp[hash * ((i + 1) * 1997 + 1242) * 182368273 % 1238421 % comp.length]).join(" ");
}

var db = {};
db["project"] = [];
db["task"] = [];
db["child2"] = [];
db["grandchild"] = [];

for (let i = 0; i < 57; i++) {
  db["project"].push({
    key: i,
    data: {
      project_key: i,
      name: getStringFromComponents(stringComponents.project.name, 78423629387 * (i + 1) % 1926283),
      info: getRandomText(172361278 * (i + 1) % 1823023),
      cost: (i * 11217 + 113943).toString().substring(0, ((i + 1) * 163 % 3 + 4)),
      deadline: getRandomDate('2022-01-01', ((i + 1) * 1117 + 113) % 993)
    }
  })
}

for (let i = 0; i < 200; i++) {
  db["task"].push({
    key: i, data: {
      task_key: i,
      project_key: (i * 17 % 57),
      title: getStringFromComponents(stringComponents.task.title, 34534515 * (i + 13452345) % 11349267),
      description: getRandomText(172361278 * (i + 1) % 182303),
      progress: (i + 123) * 18236 % 75 + 25,
      due_time: getRandomDate('2022-01-01', ((i + 1) * 1117 + 113) % 756)
    }
  })
}
/*
for (let i = 0; i < 100; i++) {
  db["child2"].push({ key: "child2_" + i, data: { child_key: "child2_" + i, e_key: "table_" + (i * 19 % 23), f1: "child1_f1_" + i, f2: "child1_f2_" + i } })
}
for (let i = 0; i < 3000; i++) {
  db["grandchild"].push({ key: "grandchild_" + i, data: { g_child_key: "grandchild_" + i, c_key: "child1_" + (i * 1371 % 200), f1: "grandchild_f1_" + i, f2: "grandchild_f2_" + i } })
}
*/
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
var explorerViewModel = new JSDataExplorer.ExplorerViewModel(dbDescription, {});
explorerViewModel.getDataCallback = getData;

let element = document.createElement("div");
element.id = "explorerElement";
document.body.appendChild(element);
ReactDOM.render(<JSDataExplorer.Explorer model={explorerViewModel} />, element);
explorerViewModel.start("project");
