export interface IGetDataFilter {
  type: "EQ";
  field: string | string[];
  value: string | string[] | string[][];
}
export interface IGetDataOptions {
  limit?: number;
  offset?: number;
  from?: number;
  filter?: IGetDataFilter;
}