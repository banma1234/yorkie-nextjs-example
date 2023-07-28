import { Text, Indexable } from "yorkie-js-sdk";

export interface ENVtypes {
  url?: string;
  apiKey?: string;
}

export interface DocTypes {
  content: Text;
  peers?: any;
}
