var explorerViewModel = new JSDataExplorer.ExplorerViewModel(dbDescription, "customers", {});
explorerViewModel.getDataCallback = getData;

let element = document.createElement("div");
element.id = "explorerElement";
document.body.appendChild(element);
const root = ReactDOM.createRoot(element);
root.render(<JSDataExplorer.Explorer model={explorerViewModel} />);
