import { FormNode } from "./nodes/form";
import { TableNode } from "./nodes/table";
import { FormViewModel } from "./viewmodels/form";
import { TableViewModel } from "./viewmodels/table";

var formViewModel = new FormViewModel([
  {
    name: "f1",
    title: "f_1"
  },
  {
    name: "f2",
    title: "f_2"
  },
  {
    name: "f3",
    title: "f_3"
  }
]);

formViewModel.getDataCallback = (ready) => {
  ready({ f1: 1, f2: "one", f3: "first" });
};
var form: FormNode = new FormNode(formViewModel);
document.body.appendChild(form.element());

var tableViewModel = new TableViewModel([
  {
    name: "f1"
  },
  {
    name: "f2"
  },
  {
    name: "f3"
  }
]);
tableViewModel.dataPartRowCount = 10;
tableViewModel.getDataCallback = (limit, offset, ready) => {
  var res = [];
  for (var i: number = 0; i < limit; i++) {
    res.push({ f1: offset + i, f2: "one", f3: "first" });
  }
  ready(res);
};
var table: TableNode = new TableNode(tableViewModel);
document.body.appendChild(table.element());
