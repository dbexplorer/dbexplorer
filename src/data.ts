export interface IGetDataFilter {
  type: "EQ";
  field: string;
  value: string | string[];
}
export interface IGetDataOptions {
  limit?: number;
  offset?: number;
  filter?: IGetDataFilter;
}