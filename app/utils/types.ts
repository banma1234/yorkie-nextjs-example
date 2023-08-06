export interface ENVtypes {
  url: string;
  apiKey: string;
}

export interface ContentTypes {
  date: string;
  text: string;
}

export interface EditorPropsTypes {
  content: Array<ContentTypes>;
  actions: { [name: string]: Function };
}

export type ChangeEventHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void;

type ValuePiece = Date | null;

export type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];
