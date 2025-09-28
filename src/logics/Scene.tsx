import { mat4 } from "gl-matrix";
import IRenderer from "../interfaces/IRenderer";
import { ISceneGraph, ISceneGraphComponent } from "../interfaces/ISceneGraph";
import { IInitializable } from "../interfaces/IInitializable";
import { Transformation } from "../models/Transformation";

export default class Scene implements ISceneGraph, IInitializable<HTMLCanvasElement> {
    public sceneTransformation: Transformation = new Transformation();

    addChild(child: ISceneGraphComponent): void {
        throw new Error("Method not implemented.");
    }

    removeChild(child: ISceneGraphComponent): void {
        throw new Error("Method not implemented.");
    }

    getModelTransformation(): mat4 {
        return this.sceneTransformation.getTransformationMatrix();
    }

    get isInitialized(): boolean {
        throw new Error("Method not implemented.");
    }

    initialize(argument: HTMLCanvasElement): Promise<void> {
        throw new Error("Method not implemented.");
    }

    render(renderContext: IRenderer): void {
        throw new Error("Method not implemented.");
    }
}