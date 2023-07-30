import { Text, JSONArray } from "yorkie-js-sdk";

export interface ENVtypes {
  url?: string;
  apiKey?: string;
}

export interface DocTypes {
  content: Text;
  mark: JSONArray<string>;
}

export interface EditorPropsTypes {
  content: Text;
  mark: JSONArray<string>;
  peers: any;
  actions: { [name: string]: Function };
}

export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

type ValuePiece = Date | null;

export type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];