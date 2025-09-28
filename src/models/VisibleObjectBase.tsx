import { mat4 } from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import { ISceneGraphComponent } from "../interfaces/ISceneGraph";

export default abstract class VisibleObjectBase implements ISceneGraphComponent {
    constructor(name: string) {
        this.name = name;
    }

    readonly name: string;
    readonly id: string = crypto.randomUUID();

    abstract getModelTransformation(): mat4;
    abstract render(renderContext: IRenderer): void;
}