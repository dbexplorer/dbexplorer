import { IBaseViewModel } from "./base";
import { TableColumnDescription } from "./table";
export class FormStringFieldViewModel {
  getName() {
    return this.columnDescription.name;
  }

  getTitle() {
    return this.columnDescription.title;
  }
  getText() {
    return this.text;
  }
  setText(text: string) {
    if (this.text !== text) {
      this.text = text;
      this.updateCallback(this.text);
    }
  }
  constructor(
    private columnDescription: TableColumnDescription,
    private text: string = null
  ) {}
  updateCallback: (data: string) => any;
}

export class FormViewModel implements IBaseViewModel {
  fields: FormStringFieldViewModel[] = [];
  constructor(private fieldsDescription: TableColumnDescription[]) {
    this.fields = fieldsDescription.map(
      (field) => new FormStringFieldViewModel(field)
    );
  }
  reloadData() {
    this.getDataCallback((data: any) => {
      this.fields.forEach((field) =>
        field.setText(data[field.getName()].toString())
      );
    });
  }
  getDataCallback: (ready: any) => void;
}
