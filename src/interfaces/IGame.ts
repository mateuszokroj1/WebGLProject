import IRenderer from "./IRenderer";

export default interface IGame {
  assignRenderer(renderer: IRenderer): void;
  start(): void;
  stop(): void;
  zoom(): void;
  move(): void;
}