export interface IGetDataFilter {
  type: "EQ";
  field: string | string[];
  value: string | string[] | string[][];
}
export interface IGetDataOptions {
  back?: boolean;
  limit?: number;
  offset?: number;
  from?: any;
  filter?: IGetDataFilter;
}