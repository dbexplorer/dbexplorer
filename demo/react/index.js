var explorerViewModel = new JSDataExplorer.ExplorerViewModel(dbDescription, "orders", {});
explorerViewModel.getDataCallback = (entityId, attributes, newOptions, ready) => {
    JSDBMock.JSDBMock.Instance.getData(entityId, attributes, newOptions).then(ready)
};

let element = document.createElement("div");
element.id = "explorerElement";
element.style.height = "600px";
document.body.appendChild(element);
const root = ReactDOM.createRoot(element);
root.render(<JSDataExplorer.Explorer model={explorerViewModel} />);
