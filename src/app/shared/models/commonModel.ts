export interface AutoComplete {
  actual: any[];
  filtered: any[];
}
export interface MultiSelect {
  actual: any[];
  selected: any[];
}
export interface Dropdown{
  actual: any[];
}
export interface Message {
  severity?: string;
  summary?: string;
  detail?: string;
}
