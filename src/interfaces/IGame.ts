import Camera from "../models/Camera";
import IRenderer from "./IRenderer";

export default interface IGame {
  camera: Camera;
  get isStarted(): boolean;

  renderer: IRenderer | null;
  
  start(): Promise<void>;
  stop(): void;
}