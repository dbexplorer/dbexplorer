import { TableNode } from "./nodes/table";
import { TableViewModel } from "./viewmodels/table";

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
tableViewModel.dataPartRowCount = 1000;
tableViewModel.getDataCallback = (limit, offset, ready) => {
  var res = [];
  for (var i: number = 0; i < limit; i++) {
    res.push({ f1: offset + i, f2: "sdaasd", f3: "first" });
  }
  ready(res);
};
var table: TableNode = new TableNode(tableViewModel);
document.body.appendChild(table.element());
