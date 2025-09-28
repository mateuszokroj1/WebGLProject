import { mat4 } from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import { ISceneGraphComponent, SceneGraphComponentBase } from "../interfaces/ISceneGraph";

export default abstract class VisibleObjectBase extends SceneGraphComponentBase {
    constructor(name: string) {
        super();
        this.name = name;
    }

    readonly name: string;

    abstract getModelTransformation(): mat4;
    abstract render(renderContext: IRenderer): void;
}