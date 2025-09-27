import Camera from "../models/Camera";
import IRenderer from "./IRenderer";

export default interface IGame {
  assignRenderer(renderer: IRenderer): void;
  assignCamera(camera: Camera): void;
  start(): void;
  stop(): void;
}