import { mat4 } from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import { SceneGraphComponentBase } from "../logics/SceneGraph";
import Box from "./Box";

export default abstract class VisibleObjectBase extends SceneGraphComponentBase {
    constructor(name: string) {
        super();
        this.name = name;
    }

    readonly name: string;

    abstract getModelTransformation(): mat4;
    abstract getBoundingBox(): Box;
    abstract acceptRenderer(visitor: IRenderer): void;
}