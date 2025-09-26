import IRenderer from "./IRenderer";

export default interface IGame {
  assignRenderer<TRenderer implements IRenderer>(): void;
  start(): void;
  stop(): void;
  zoom(): void;
  move(): void;
}