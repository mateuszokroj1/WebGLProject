import Camera from "../models/Camera";
import IRenderer from "./IRenderer";
import { ISceneGraphComponent } from "./ISceneGraph";

export default interface IGame {
  camera: Camera;
  get isStarted(): boolean;
  renderer: IRenderer | null;
  scene_graph: ISceneGraphComponent;

  start(): Promise<void>;
  stop(): void;
  requestRenderingProcess(window: Window): void;
}